import React from 'react';
import { X, Play, Trash2 } from 'lucide-react';

const WishlistModal = ({ isOpen, onClose, wishlist, onPlay, onRemove }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Modal Content - Full width bottom sheet on mobile */}
            <div className="relative bg-[#1c1c1e] w-full sm:w-[95%] sm:max-w-4xl h-[85vh] sm:h-auto sm:max-h-[80vh] rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden border-t sm:border border-white/10 flex flex-col animate-fade-in-up safe-area-inset">
                {/* Header */}
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/10 flex-shrink-0">
                    <h2 className="text-lg sm:text-2xl font-bold text-white">My Wishlist</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full bg-white/10 active:bg-white/20 sm:hover:bg-white/20 text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto p-3 sm:p-6">
                    {wishlist.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-white/50">
                            <p className="text-base sm:text-lg">Your wishlist is empty.</p>
                            <p className="text-xs sm:text-sm mt-2">Add movies to watch them later.</p>
                        </div>
                    ) : (
                        <div className="space-y-3 sm:grid sm:grid-cols-2 sm:gap-4 sm:space-y-0">
                            {wishlist.map(movie => (
                                <div key={movie.id} className="flex gap-3 sm:gap-4 bg-white/5 p-3 rounded-xl active:bg-white/10 sm:hover:bg-white/10 transition-colors">
                                    <img
                                        src={movie.medium_cover_image}
                                        alt={movie.title}
                                        className="w-16 sm:w-20 aspect-[2/3] object-cover rounded-lg shadow-md flex-shrink-0"
                                    />
                                    <div className="flex-1 flex flex-col justify-between py-0.5 sm:py-1 min-w-0">
                                        <div>
                                            <h3 className="font-bold text-white text-sm sm:text-base line-clamp-1">{movie.title}</h3>
                                            <p className="text-xs sm:text-sm text-white/60">{movie.year} • {movie.genres?.[0]}</p>
                                        </div>
                                        <div className="flex items-center gap-2 sm:gap-3 mt-2 sm:mt-3">
                                            <button
                                                onClick={() => onPlay(movie)}
                                                className="flex items-center gap-1.5 sm:gap-2 bg-white text-black px-3 sm:px-4 py-2 sm:py-1.5 rounded-lg text-xs sm:text-sm font-bold active:scale-95 sm:hover:scale-105 transition-transform"
                                            >
                                                <Play className="w-3 h-3 fill-current" />
                                                Play
                                            </button>
                                            <button
                                                onClick={() => onRemove(movie)}
                                                className="flex items-center gap-1.5 sm:gap-2 text-red-400 active:text-red-300 sm:hover:text-red-300 px-2 py-2 sm:py-1.5 rounded-lg text-xs sm:text-sm transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                <span className="hidden sm:inline">Remove</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default WishlistModal;
