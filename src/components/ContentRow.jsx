import React, { useRef } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import MovieCard from './MovieCard';

const ContentRow = ({ title, movies, onMovieClick, onTitleClick }) => {
    const rowRef = useRef(null);

    const scroll = (direction) => {
        if (rowRef.current) {
            const { current } = rowRef;
            const scrollAmount = direction === 'left' ? -window.innerWidth / 2 : window.innerWidth / 2;
            current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    if (!movies || movies.length === 0) return null;

    return (
        <div className="space-y-2 sm:space-y-3 md:space-y-4 py-3 sm:py-5 md:py-8 relative group/row">
            {/* Title */}
            <h2
                onClick={onTitleClick}
                className={`text-base sm:text-lg md:text-2xl font-bold text-white px-3 sm:px-4 md:px-12 flex items-center gap-1 sm:gap-2 transition-colors ${onTitleClick ? 'cursor-pointer hover:text-blue-400 group-hover/title:text-blue-400' : ''}`}
            >
                {title}
                {onTitleClick && <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-white/50" />}
            </h2>

            {/* Scroll Container */}
            <div className="relative">
                {/* Left Arrow - Hidden on mobile */}
                <button
                    onClick={() => scroll('left')}
                    className="hidden sm:flex absolute left-0 top-0 bottom-0 w-12 md:w-16 bg-gradient-to-r from-black/80 to-transparent z-20 items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity duration-300 disabled:opacity-0 cursor-pointer"
                >
                    <ChevronLeft className="w-8 h-8 text-white drop-shadow-lg" />
                </button>

                {/* Cards Rail */}
                <div
                    ref={rowRef}
                    className="flex gap-2.5 sm:gap-4 md:gap-6 overflow-x-auto scrollbar-hide px-3 sm:px-4 md:px-12 pb-4 sm:pb-6 md:pb-8 pt-1 sm:pt-2 snap-x scroll-container"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {movies.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} onClick={onMovieClick} />
                    ))}
                </div>

                {/* Right Arrow - Hidden on mobile */}
                <button
                    onClick={() => scroll('right')}
                    className="hidden sm:flex absolute right-0 top-0 bottom-0 w-12 md:w-16 bg-gradient-to-l from-black/80 to-transparent z-20 items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity duration-300 cursor-pointer"
                >
                    <ChevronRight className="w-8 h-8 text-white drop-shadow-lg" />
                </button>
            </div>
        </div>
    );
};

export default ContentRow;
