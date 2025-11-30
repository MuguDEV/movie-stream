import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import Plyr from 'plyr';
import Hls from 'hls.js';
import 'plyr/dist/plyr.css';

const Player = ({ src, onClose, title, movieId }) => {
    const videoRef = useRef(null);
    const playerRef = useRef(null);
    const hlsRef = useRef(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        // Determine if HLS
        const isHls = src.includes('.m3u8');

        // Default Plyr options
        const defaultOptions = {
            autoplay: true,
            controls: [
                'play-large', 'play', 'progress', 'current-time', 'duration', 'mute', 'volume',
                'captions', 'settings', 'pip', 'airplay', 'fullscreen'
            ],
            ratio: '16:9',
            fullscreen: { enabled: true, fallback: true, iosNative: true },
        };

        const initPlyr = () => {
            if (playerRef.current) return;

            // Restore progress
            const savedProgress = JSON.parse(localStorage.getItem('movie_progress') || '{}');
            const startTime = savedProgress[movieId] || 0;

            playerRef.current = new Plyr(video, defaultOptions);

            // Set start time once metadata is loaded
            playerRef.current.on('loadedmetadata', () => {
                if (startTime > 0) {
                    playerRef.current.currentTime = startTime;
                }
                // Try to play
                playerRef.current.play().catch(e => console.log("Autoplay blocked:", e));
            });

            // Save progress
            playerRef.current.on('timeupdate', () => {
                if (playerRef.current.currentTime > 5) { // Only save if watched > 5s
                    const currentProgress = JSON.parse(localStorage.getItem('movie_progress') || '{}');
                    currentProgress[movieId] = playerRef.current.currentTime;
                    localStorage.setItem('movie_progress', JSON.stringify(currentProgress));
                }
            });
        };

        if (isHls && Hls.isSupported()) {
            const hls = new Hls({
                maxBufferHole: 2.5,
                highBufferWatchdogPeriod: 3,
                fragLoadingTimeOut: 20000,
            });
            hlsRef.current = hls;
            hls.loadSource(src);
            hls.attachMedia(video);

            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                initPlyr();
            });

            hls.on(Hls.Events.ERROR, function (event, data) {
                if (data.fatal) {
                    switch (data.type) {
                        case Hls.ErrorTypes.NETWORK_ERROR:
                            hls.startLoad();
                            break;
                        case Hls.ErrorTypes.MEDIA_ERROR:
                            hls.recoverMediaError();
                            break;
                        default:
                            hls.destroy();
                            break;
                    }
                }
            });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            // Safari native HLS
            video.src = src;
            initPlyr();
        } else {
            // Normal MP4
            video.src = src;
            initPlyr();
        }

        // Cleanup
        return () => {
            if (hlsRef.current) {
                hlsRef.current.destroy();
            }
            if (playerRef.current) {
                playerRef.current.destroy();
            }
        };
    }, [src, movieId]);

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-[200] bg-black flex flex-col animate-fade-in">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 p-4 md:p-6 flex justify-between items-center z-50 bg-gradient-to-b from-black/90 to-transparent pointer-events-none">
                <h3 className="text-white font-medium text-lg drop-shadow-md pointer-events-auto pl-2">{title}</h3>
                <button
                    onClick={onClose}
                    className="bg-white/10 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/20 transition-all pointer-events-auto border border-white/10"
                >
                    <X className="w-6 h-6" />
                </button>
            </div>

            {/* Player Container */}
            <div className="flex-1 flex items-center justify-center bg-black w-full h-full">
                <div className="w-full h-full">
                    <video
                        ref={videoRef}
                        className="plyr-react plyr"
                        playsInline
                        crossOrigin="anonymous"
                        style={{ width: '100%', height: '100%' }}
                    />
                </div>
            </div>

            {/* Custom CSS */}
            <style>{`
                .plyr {
                    width: 100%;
                    height: 100%;
                }
                .plyr__video-wrapper {
                    height: 100%;
                }
                .plyr--video .plyr__controls {
                    padding-bottom: 40px;
                    padding-left: 40px;
                    padding-right: 40px;
                }
                .plyr__control--overlaid {
                    background: rgba(255, 255, 255, 0.2);
                    backdrop-filter: blur(4px);
                }
                .plyr__control--overlaid:hover {
                    background: rgba(255, 255, 255, 0.4);
                }
            `}</style>
        </div>
    );
};

export default Player;
