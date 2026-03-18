import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import Plyr from 'plyr';
import Hls from 'hls.js';
import 'plyr/dist/plyr.css';

const Player = ({ src, onClose, title, movieId }) => {
    const videoRef = useRef(null);
    const playerRef = useRef(null);
    const hlsRef = useRef(null);
    const containerRef = useRef(null);

    // Lock to landscape on mobile
    useEffect(() => {
        const lockOrientation = async () => {
            try {
                if (screen.orientation && screen.orientation.lock) {
                    await screen.orientation.lock('landscape');
                }
            } catch (e) {
                // Orientation lock not supported
            }
        };

        lockOrientation();

        return () => {
            try {
                if (screen.orientation && screen.orientation.unlock) {
                    screen.orientation.unlock();
                }
            } catch (e) {
                // Silent fail
            }
        };
    }, []);

    // Hide Android navigation bar (fullscreen immersive)
    useEffect(() => {
        const enterFullscreen = async () => {
            try {
                if (containerRef.current && containerRef.current.requestFullscreen) {
                    await containerRef.current.requestFullscreen();
                } else if (containerRef.current?.webkitRequestFullscreen) {
                    await containerRef.current.webkitRequestFullscreen();
                }
            } catch (e) {
                // Fullscreen not supported
            }
        };

        // Small delay to ensure DOM is ready
        const timer = setTimeout(enterFullscreen, 100);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const isHls = src.includes('.m3u8');

        const defaultOptions = {
            autoplay: true,
            controls: [
                'play-large', 'play', 'progress', 'current-time', 'duration', 'mute', 'volume',
                'captions', 'settings', 'pip', 'airplay', 'fullscreen'
            ],
            ratio: '16:9',
            fullscreen: { enabled: true, fallback: true, iosNative: true },
            tooltips: { controls: false, seek: true },
            keyboard: { focused: true, global: true },
        };

        const initPlyr = () => {
            if (playerRef.current) return;

            const savedProgress = JSON.parse(localStorage.getItem('movie_progress') || '{}');
            const startTime = savedProgress[movieId] || 0;

            playerRef.current = new Plyr(video, defaultOptions);

            playerRef.current.on('loadedmetadata', () => {
                if (startTime > 0) {
                    playerRef.current.currentTime = startTime;
                }
                playerRef.current.play().catch(e => console.log("Autoplay blocked:", e));
            });

            playerRef.current.on('timeupdate', () => {
                if (playerRef.current.currentTime > 5) {
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

            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                initPlyr();
            });

            hls.on(Hls.Events.ERROR, function (event, data) {
                console.error('HLS Error:', event, data);
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

            hls.loadSource(src);
            hls.attachMedia(video);
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = src;
            initPlyr();
        } else {
            video.src = src;
            initPlyr();
        }

        return () => {
            if (hlsRef.current) {
                hlsRef.current.destroy();
                hlsRef.current = null;
            }
            if (playerRef.current) {
                playerRef.current.destroy();
                playerRef.current = null;
            }
        };
    }, [src, movieId]);

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape' && onClose) {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    // Handle back button on Android
    useEffect(() => {
        const handlePopState = () => {
            if (onClose) {
                onClose();
            }
        };

        // Push a dummy state so back button triggers popstate
        window.history.pushState({ player: true }, '');
        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [onClose]);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-[200] bg-black flex flex-col animate-fade-in"
            style={{ touchAction: 'none' }}
        >
            {/* Header - Auto-hide on mobile */}
            <div className="absolute top-0 left-0 right-0 p-2 sm:p-4 md:p-6 flex justify-between items-center z-50 bg-gradient-to-b from-black/90 to-transparent pointer-events-none">
                <h3 className="text-white font-medium text-sm sm:text-base md:text-lg drop-shadow-md pointer-events-auto pl-2 truncate max-w-[70%]">
                    {title}
                </h3>
                <button
                    onClick={onClose}
                    className="bg-white/10 backdrop-blur-md p-2 sm:p-2.5 rounded-full text-white active:bg-white/30 sm:hover:bg-white/20 transition-all pointer-events-auto border border-white/10"
                >
                    <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
            </div>

            {/* Player Container - Full screen */}
            <div className="flex-1 flex items-center justify-center bg-black w-full h-full">
                <div className="w-full h-full">
                    <video
                        ref={videoRef}
                        className="plyr-react plyr"
                        playsInline
                        crossOrigin="anonymous"
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                </div>
            </div>

            {/* Mobile-optimized Plyr styles */}
            <style>{`
                .plyr {
                    width: 100%;
                    height: 100%;
                }
                .plyr__video-wrapper {
                    height: 100%;
                }

                /* Mobile: Larger touch targets */
                @media (max-width: 768px) {
                    .plyr--video .plyr__controls {
                        padding: 12px 8px 20px !important;
                    }
                    .plyr__control {
                        padding: 10px !important;
                    }
                    .plyr__volume {
                        display: none !important;
                    }
                }

                /* Tablet */
                @media (min-width: 769px) and (max-width: 1024px) {
                    .plyr--video .plyr__controls {
                        padding-bottom: 30px;
                        padding-left: 20px;
                        padding-right: 20px;
                    }
                }

                /* Desktop */
                @media (min-width: 1025px) {
                    .plyr--video .plyr__controls {
                        padding-bottom: 40px;
                        padding-left: 40px;
                        padding-right: 40px;
                    }
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
