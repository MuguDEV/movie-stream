import React from 'react';
import { Play, Plus } from 'lucide-react';
import Loader from './Loader';

const Hero = ({ movie, onPlay, wishlist, onToggleWishlist, onSurpriseMe }) => {
  if (!movie) {
    return (
      <div className="h-[70vh] sm:h-[75vh] md:h-[85vh] w-full bg-gradient-to-b from-[#1c1c1e] to-black flex items-center justify-center">
        <Loader className="w-10 h-10 sm:w-12 sm:h-12" />
      </div>
    );
  }

  const isInWishlist = wishlist && wishlist.some(m => m?.id === movie.id);

  return (
    <div className="relative h-[70vh] sm:h-[75vh] md:h-[85vh] w-full overflow-hidden group">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={movie.background_image_original || movie.large_cover_image}
          alt=""
          className="w-full h-full object-cover object-center opacity-0 transition-opacity duration-700"
          onLoad={(e) => e.target.classList.remove('opacity-0')}
        />
        {/* Fallback */}
        <div className="absolute inset-0 bg-[#1c1c1e] -z-10" />

        {/* Gradient Overlay - stronger on mobile */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 sm:via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 sm:from-black/60 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-end pb-6 sm:pb-16 md:pb-24 px-4 sm:px-6 md:px-12 max-w-[1920px] mx-auto safe-area-inset">
        <div className="max-w-2xl space-y-3 sm:space-y-4 md:space-y-6 animate-fade-in-up w-full">
          {/* Metadata */}
          <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs md:text-sm font-medium text-white/80 uppercase tracking-wider">
            <span>{movie.genres?.[0] || 'Movie'}</span>
            <span>•</span>
            <span>{movie.year}</span>
            {movie.rating && (
              <>
                <span>•</span>
                <span className="text-yellow-500">★ {movie.rating}</span>
              </>
            )}
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight drop-shadow-2xl line-clamp-2">
            {movie.title}
          </h1>

          {/* Description - hidden on small mobile, visible on larger screens */}
          <p className="hidden sm:block text-sm md:text-base lg:text-lg text-white/90 line-clamp-2 md:line-clamp-3 font-medium drop-shadow-md">
            {movie.summary || movie.description_full}
          </p>

          {/* Buttons - stacked on mobile, row on tablet+ */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 md:gap-4 pt-2 sm:pt-4">
            <button
              onClick={() => onPlay?.(movie)}
              className="flex items-center justify-center gap-2 bg-white text-black px-6 sm:px-8 py-3 sm:py-3.5 rounded-lg font-bold text-sm sm:text-base active:scale-95 sm:hover:scale-105 transition-transform duration-200 shadow-lg shadow-white/10"
            >
              <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
              <span>Play</span>
            </button>

            <button
              onClick={() => onToggleWishlist?.(movie)}
              className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-lg font-bold text-sm sm:text-base active:scale-95 sm:hover:bg-white/20 transition-all duration-200 border border-white/10"
            >
              <Plus className={`w-4 h-4 sm:w-5 sm:h-5 ${isInWishlist ? 'rotate-45' : ''} transition-transform duration-300`} />
              <span>{isInWishlist ? 'In Wishlist' : 'Wishlist'}</span>
            </button>

            <button
              onClick={() => onSurpriseMe?.()}
              className="flex items-center justify-center gap-2 bg-purple-600 text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-lg font-bold text-sm sm:text-base active:scale-95 sm:hover:bg-purple-700 transition-all duration-200 shadow-lg shadow-purple-900/20"
            >
              <span className="text-lg sm:text-xl">🎲</span>
              <span>Surprise Me</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
