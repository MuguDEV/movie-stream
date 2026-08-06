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
      <div className="relative h-full flex items-end pb-8 sm:pb-16 md:pb-24 px-4 sm:px-6 md:px-12 max-w-[1920px] mx-auto safe-area-inset">
        <div className="max-w-3xl space-y-4 sm:space-y-5 md:space-y-7 animate-fade-in-up w-full">
          {/* Metadata */}
          <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs md:text-sm font-semibold text-white/90 uppercase tracking-wider">
            <span className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">{movie.genres?.[0] || 'Movie'}</span>
            <span>•</span>
            <span>{movie.year}</span>
            {movie.rating && (
              <>
                <span>•</span>
                <span className="text-yellow-400 flex items-center gap-1">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                  </svg>
                  {movie.rating}
                </span>
              </>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight drop-shadow-2xl line-clamp-2 gradient-text">
            {movie.title}
          </h1>

          {/* Description - hidden on small mobile, visible on larger screens */}
          <p className="hidden sm:block text-sm md:text-base lg:text-lg text-white/90 line-clamp-3 md:line-clamp-4 font-medium drop-shadow-md max-w-2xl">
            {movie.summary || movie.description_full}
          </p>

          {/* Buttons - stacked on mobile, row on tablet+ */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-4 sm:pt-6">
            <button
              onClick={() => onPlay?.(movie)}
              className="flex items-center justify-center gap-2 btn-primary group shadow-xl shadow-indigo-500/20"
            >
              <Play className="w-5 h-5 sm:w-6 sm:h-6 fill-current group-hover:scale-110 transition-transform" />
              <span className="text-base sm:text-lg">Play Now</span>
            </button>

            <button
              onClick={() => onToggleWishlist?.(movie)}
              className={`flex items-center justify-center gap-2 btn-modern group ${isInWishlist ? 'bg-pink-500/20 border-pink-500/50' : ''}`}
            >
              <Plus className={`w-5 h-5 sm:w-6 sm:h-6 ${isInWishlist ? 'rotate-45' : ''} transition-transform duration-300`} />
              <span className="text-base sm:text-lg">{isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}</span>
            </button>

            <button
              onClick={() => onSurpriseMe?.()}
              className="flex items-center justify-center gap-2 glass-dark text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl font-bold text-base sm:text-lg active:scale-95 hover:bg-white/15 transition-all duration-300 border border-white/10 hover:border-purple-500/50 group"
            >
              <span className="text-xl sm:text-2xl group-hover:rotate-12 transition-transform">🎲</span>
              <span>Surprise Me</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
