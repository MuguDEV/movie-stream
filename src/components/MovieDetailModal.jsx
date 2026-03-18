import React, { useState, useEffect } from 'react';
import { X, Play, Star, Calendar, Clock, Youtube, Share2 } from 'lucide-react';
import { movies as api } from '../services/api';

const MovieDetailModal = ({ movie, isOpen, onClose, onPlay, wishlist, onToggleWishlist, onSwitchMovie }) => {
    const [similarMovies, setSimilarMovies] = useState([]);
    const [showTrailer, setShowTrailer] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        if (movie?.id) {
            api.getSuggestions(movie.id)
                .then(res => setSimilarMovies(res.data.data.movies || []))
                .catch(err => console.error("Error fetching suggestions:", err));
        }
    }, [movie]);

    if (!isOpen || !movie) return null;

    const isInWishlist = wishlist && wishlist.some(m => m?.id === movie.id);

    return (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Modal Content - Full screen on mobile, centered on tablet/desktop */}
            <div className="relative bg-[#1c1c1e] w-full sm:w-[95%] md:w-full sm:max-w-4xl md:max-w-5xl lg:max-w-6xl h-[92vh] sm:h-auto sm:max-h-[90vh] rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden border-t sm:border border-white/10 flex flex-col animate-fade-in-up safe-area-inset">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 p-2 rounded-full bg-black/50 active:bg-white/20 sm:hover:bg-white/20 text-white transition-colors"
                >
                    <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>

                {/* Mobile: Scrollable content / Desktop: Flex layout */}
                <div className="flex flex-col md:flex-row h-full overflow-y-auto md:overflow-hidden">
                    {/* Left Side: Poster (Hidden on mobile, visible on desktop) */}
                    <div className="hidden md:block w-1/3 relative flex-shrink-0">
                        <img
                            src={movie.large_cover_image || movie.medium_cover_image}
                            alt={movie.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-[#1c1c1e]" />
                    </div>

                    {/* Mobile Header Image */}
                    <div className="md:hidden relative w-full h-48 sm:h-56 flex-shrink-0">
                        <img
                            src={movie.background_image_original || movie.large_cover_image}
                            alt=""
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1c1c1e] via-black/40 to-transparent" />
                    </div>

                    {/* Right Side: Details */}
                    <div className="flex-1 p-4 sm:p-6 md:p-8 lg:p-12 overflow-y-auto">
                        <div className="space-y-4 sm:space-y-5 md:space-y-6">
                            {/* Title & Meta */}
                            <div>
                                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-3 md:mb-4 leading-tight">
                                    {movie.title}
                                </h2>
                                <div className="flex flex-wrap items-center gap-2 sm:gap-3 md:gap-4 text-xs sm:text-sm font-medium text-white/70">
                                    <span className="flex items-center gap-1 text-yellow-500">
                                        <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />
                                        {movie.rating}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                                        {movie.year}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                                        {movie.runtime} min
                                    </span>
                                    <span className="border border-white/20 px-2 py-0.5 rounded text-[10px] sm:text-xs uppercase">
                                        {movie.genres?.[0]}
                                    </span>
                                </div>
                            </div>

                            {/* Synopsis */}
                            <div>
                                <p className="text-sm sm:text-base md:text-lg text-white/80 leading-relaxed">
                                    {isExpanded
                                        ? (movie.description_full || movie.summary)
                                        : (movie.description_full || movie.summary)?.slice(0, 120) + '...'}
                                </p>
                                {(movie.description_full || movie.summary)?.length > 120 && (
                                    <button
                                        onClick={() => setIsExpanded(!isExpanded)}
                                        className="mt-2 text-blue-400 active:text-blue-300 sm:hover:text-blue-300 font-medium text-xs sm:text-sm"
                                    >
                                        {isExpanded ? 'Read Less' : 'Read More'}
                                    </button>
                                )}
                            </div>

                            {/* Actions - Stacked on mobile */}
                            <div className="pt-2 sm:pt-4 md:pt-6 flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4">
                                <button
                                    onClick={() => onPlay(movie)}
                                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 sm:gap-3 bg-white text-black px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base md:text-lg active:scale-95 sm:hover:scale-105 transition-transform shadow-lg shadow-white/10"
                                >
                                    <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />
                                    <span>Play Movie</span>
                                </button>

                                <button
                                    onClick={() => onToggleWishlist && onToggleWishlist(movie)}
                                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 sm:gap-3 bg-white/10 border border-white/10 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base md:text-lg active:bg-white/20 sm:hover:bg-white/20 transition-colors"
                                >
                                    {isInWishlist ? (
                                        <>
                                            <span className="text-green-400">✓</span>
                                            <span>In Wishlist</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>+</span>
                                            <span>Wishlist</span>
                                        </>
                                    )}
                                </button>

                                <div className="flex gap-2 sm:gap-3">
                                    {movie.yt_trailer_code && (
                                        <button
                                            onClick={() => setShowTrailer(true)}
                                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-red-600/20 border border-red-600/50 text-red-500 px-4 sm:px-6 py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base active:bg-red-600/30 sm:hover:bg-red-600/30 transition-colors"
                                        >
                                            <Youtube className="w-5 h-5 sm:w-6 sm:h-6" />
                                            <span className="sm:inline">Trailer</span>
                                        </button>
                                    )}

                                    <button
                                        onClick={() => {
                                            const url = `${window.location.origin}?movie=${movie.id}`;
                                            navigator.clipboard.writeText(url);
                                            alert("Link copied!");
                                        }}
                                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-xl font-bold text-sm sm:text-base active:bg-white/10 sm:hover:bg-white/10 transition-colors"
                                        title="Share Movie"
                                    >
                                        <Share2 className="w-5 h-5 sm:w-6 sm:h-6" />
                                    </button>
                                </div>
                            </div>

                            {/* Similar Movies */}
                            {similarMovies.length > 0 && (
                                <div className="pt-6 sm:pt-8 border-t border-white/10 mt-4 sm:mt-6 md:mt-8">
                                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-3 sm:mb-4">You Might Also Like</h3>
                                    <div className="grid grid-cols-4 sm:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
                                        {similarMovies.slice(0, 4).map(sim => (
                                            <div
                                                key={sim.id}
                                                onClick={() => onSwitchMovie && onSwitchMovie(sim)}
                                                className="cursor-pointer group active:scale-95 transition-transform"
                                            >
                                                <div className="relative aspect-[2/3] rounded-lg overflow-hidden mb-1 sm:mb-2">
                                                    <img
                                                        src={sim.medium_cover_image}
                                                        alt={sim.title}
                                                        loading="lazy"
                                                        className="w-full h-full object-cover sm:group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                </div>
                                                <h4 className="text-[10px] sm:text-xs md:text-sm font-medium text-white/80 truncate sm:group-hover:text-white transition-colors">{sim.title}</h4>
                                                <p className="text-[9px] sm:text-xs text-white/50">{sim.year}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <p className="mt-4 text-xs sm:text-sm text-white/40 text-center md:text-left pb-4 sm:pb-0">
                                Streaming securely via Seedr.cc
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Trailer Modal */}
            {showTrailer && (
                <div className="fixed inset-0 z-[150] bg-black/90 flex items-center justify-center p-2 sm:p-4">
                    <div className="relative w-full max-w-4xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl">
                        <button
                            onClick={() => setShowTrailer(false)}
                            className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 p-2 rounded-full bg-black/50 text-white active:bg-white/20 sm:hover:bg-white/20 transition-colors"
                        >
                            <X className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>
                        <iframe
                            width="100%"
                            height="100%"
                            src={`https://www.youtube.com/embed/${movie.yt_trailer_code}?autoplay=1`}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MovieDetailModal;
