import { useState, useCallback } from 'react';
import { seedr } from '../services/api';
// import parseTorrent from 'parse-torrent'; // This might be causing issues if it's a mix of CJS/ESM
import * as parseTorrentLib from 'parse-torrent';
const parseTorrent = parseTorrentLib.default || parseTorrentLib;
const toMagnetURI = parseTorrentLib.toMagnetURI || parseTorrent.toMagnetURI;
import { Buffer } from 'buffer';
import axios from 'axios';

export const useSeedr = () => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchFiles = useCallback(async (folderId = '0') => {
        setLoading(true);
        try {
            const res = folderId === '0' ? await seedr.getFiles() : await seedr.getFolder(folderId);
            if (res.data.folders || res.data.files) {
                const items = [
                    ...(res.data.folders || []).map(f => ({ ...f, type: 'folder' })),
                    ...(res.data.files || []).map(f => ({ ...f, type: 'file' }))
                ];
                setFiles(items);
                return res.data; // Return full data for polling
            } else {
                setFiles([]);
                return null;
            }
        } catch (err) {
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // Recursive function to find the first video file
    const findVideoFile = async (folderId) => {
        try {
            const res = await seedr.getFolder(folderId);
            const data = res.data;

            // Check files in current folder - Prioritize MP4 for browser support
            const mp4 = data.files?.find(f => f.name.endsWith('.mp4'));
            if (mp4) {
                console.log('Found MP4 file:', mp4);
                return mp4;
            }

            const otherVideo = data.files?.find(f => f.name.endsWith('.mkv') || f.name.endsWith('.avi'));
            if (otherVideo) {
                console.log('Found video file:', otherVideo);
                return otherVideo;
            }

            // Check subfolders
            if (data.folders && data.folders.length > 0) {
                for (const folder of data.folders) {
                    const found = await findVideoFile(folder.id);
                    if (found) return found;
                }
            }
            
            console.warn('No video file found in folder', folderId);
            return null;
        } catch (err) {
            console.error('Error searching for video file:', err);
            return null;
        }
    };

    const addAndPlay = async (hashOrMagnet, title = 'video') => {
        setLoading(true);
        setError(null);
        try {
            // 0. Clean Root Folder
            try {
                const rootFiles = await seedr.getFiles();
                if (rootFiles?.data?.folders) {
                    for (const folder of rootFiles.data.folders) {
                        try {
                            await seedr.deleteItem(folder.id);
                        } catch (e) {
                            // Skip deletion errors
                        }
                    }
                }
                if (rootFiles?.data?.files) {
                    for (const file of rootFiles.data.files) {
                        try {
                            await seedr.deleteItem(file.id);
                        } catch (e) {
                            // Skip deletion errors
                        }
                    }
                }
                if (rootFiles?.data?.torrents) {
                    for (const torrent of rootFiles.data.torrents) {
                        try {
                            await seedr.deleteItem(torrent.id);
                        } catch (e) {
                            // Skip deletion errors
                        }
                    }
                }
            } catch (cleanErr) {
                console.warn('Error cleaning root folder:', cleanErr);
            }

            // 1. Construct Magnet Link
            let magnet;
            if (hashOrMagnet.startsWith('magnet:')) {
                magnet = hashOrMagnet;
            } else {
                // Construct magnet from hash
                const trackers = [
                    "udp://open.demonii.com:1337/announce",
                    "udp://tracker.openbittorrent.com:80",
                    "udp://tracker.coppersurfer.tk:6969",
                    "udp://glotorrents.pw:6969/announce",
                    "udp://tracker.opentrackr.org:1337/announce",
                    "udp://torrent.gresille.org:80/announce",
                    "udp://p4p.arenabg.com:1337",
                    "udp://tracker.leechers-paradise.org:6969"
                ];
                const trParams = trackers.map(tr => `&tr=${encodeURIComponent(tr)}`).join('');
                magnet = `magnet:?xt=urn:btih:${hashOrMagnet}&dn=${encodeURIComponent(title)}${trParams}`;
            }

            // 2. Add Magnet
            console.log('Adding magnet link...');
            const addRes = await seedr.addMagnet(magnet);
            if (!addRes.data.success && addRes.data.result !== true) {
                throw new Error("Failed to add torrent to Seedr");
            }
            console.log('Magnet added successfully, waiting for download...');

            // 3. Poll for completion
            const streamUrl = await new Promise((resolve, reject) => {
                let attempts = 0;
                const maxAttempts = 120; // 4 minutes
                let pollInterval = null;

                const clearPoll = () => {
                    if (pollInterval) clearInterval(pollInterval);
                };

                const pollFn = async () => {
                    try {
                        attempts++;
                        console.log(`Poll attempt ${attempts}/${maxAttempts}`);

                        if (attempts > maxAttempts) {
                            clearPoll();
                            reject(new Error("Download timeout - waited too long for file to appear"));
                            return;
                        }

                        const data = await fetchFiles('0');
                        if (!data) {
                            console.log('No data returned, will retry...');
                            return;
                        }

                        // Check active torrents for progress
                        const activeTorrent = data?.torrents?.find(t =>
                            t.hash === addRes.data.torrent_hash ||
                            (t.name && t.name.toLowerCase().includes(title.toLowerCase())) ||
                            (t.title && t.title.toLowerCase().includes(title.toLowerCase()))
                        );

                        if (activeTorrent) {
                            console.log(`Download progress: ${activeTorrent.progress}%`);
                            if (activeTorrent.progress < 100) {
                                return; // Still downloading, continue polling
                            }
                        }

                        // If torrent is gone or 100%, check for folder
                        const folder = data?.folders?.find(f => {
                            const folderName = f.path || f.name || '';
                            const folderNameLower = folderName.toLowerCase();
                            const titleLower = title.toLowerCase();
                            
                            return folderNameLower.includes(titleLower) || 
                                   titleLower.includes(folderNameLower) ||
                                   folderNameLower.includes(titleLower.split(' ')[0]);
                        });

                        if (folder) {
                            console.log('Found folder for download:', folder.name);
                            // Add slight delay to ensure Seedr has fully processed the file
                            await new Promise(r => setTimeout(r, 2000));
                            
                            // 4. Find Video File recursively
                            const video = await findVideoFile(folder.id);
                            if (!video) {
                                clearPoll();
                                reject(new Error("No video file found in downloaded folder"));
                                return;
                            }

                            console.log('Found video file, waiting before requesting stream URL...');
                            // Add extra wait before getting stream URL to ensure Seedr is ready
                            await new Promise(r => setTimeout(r, 3000));
                            
                            // 5. Get Stream URL with retries
                            let retries = 3;
                            while (retries > 0) {
                                try {
                                    console.log(`Attempting to get video URL (attempt ${4 - retries}/3)...`);
                                    const streamUrlRes = await seedr.getVideo(video.id);
                                    console.log('Stream URL response structure:', streamUrlRes);
                                    if (streamUrlRes?.data?.url) {
                                        console.log('Successfully got stream URL');
                                        clearPoll();
                                        resolve(streamUrlRes.data.url);
                                        return;
                                    } else {
                                        console.warn('Invalid response structure:', streamUrlRes);
                                        retries--;
                                        if (retries > 0) {
                                            await new Promise(r => setTimeout(r, 3000));
                                        }
                                    }
                                } catch (urlErr) {
                                    console.error(`Error getting video URL:`, urlErr.message);
                                    retries--;
                                    if (retries > 0) {
                                        console.warn(`Retrying... (${retries} attempts left)`);
                                        await new Promise(r => setTimeout(r, 3000));
                                    }
                                }
                            }
                            clearPoll();
                            reject(new Error("Failed to get stream URL after 3 attempts"));
                            return;
                        }
                    } catch (pollErr) {
                        console.error('Poll error:', pollErr.message);
                        console.error('Full error:', pollErr);
                        // Continue polling on network errors, but log for debugging
                    }
                };

                // Run polling immediately and then every 2 seconds
                pollFn().then(() => {
                    if (!pollInterval) {
                        pollInterval = setInterval(pollFn, 2000);
                    }
                }).catch(err => {
                    clearPoll();
                    reject(err);
                });
            });

            return streamUrl;

        } catch (err) {
            const errorMsg = err.message || "Unknown error occurred while preparing stream";
            console.error('addAndPlay error:', errorMsg);
            setError(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { files, loading, error, fetchFiles, addAndPlay };
};
