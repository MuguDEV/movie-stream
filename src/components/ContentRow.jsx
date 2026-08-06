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
        <div className="space-y-3 sm:space-y-4 md:space-y-6 py-4 sm:py-6 md:py-8 relative group/row px-3 sm:px-4 md:px-12">
            {/* Title */}
            <div className="flex items-center justify-between">
                <h2
                    onClick={onTitleClick}
                    className={`text-lg sm:text-xl md:text-2xl font-bold text-white flex items-center gap-2 transition-all duration-300 ${onTitleClick ? 'cursor-pointer group/title hover:text-indigo-400' : ''}`}
                >
                    {title}
                    {onTitleClick && <ChevronRight className="w-5 h-5 text-white/50 group-hover/title:text-indigo-400 transition-colors" />}
                </h2>
            </div>

            {/* Scroll Container */}
            <div className="relative -mx-3 sm:-mx-4 md:-mx-12 px-3 sm:px-4 md:px-12">
                {/* Left Arrow - Hidden on mobile */}
                <button
                    onClick={() => scroll('left')}
                    className="hidden sm:flex absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-black via-black/80 to-transparent z-20 items-center justify-center opacity-0 group-hover/row:opacity-100 transition-all duration-300 cursor-pointer rounded-l-xl"
                >
                    <div className="glass-dark p-3 rounded-full hover:bg-white/20 transition-all">
                        <ChevronLeft className="w-6 h-6 text-white drop-shadow-lg" />
                    </div>
                </button>

                {/* Cards Rail */}
                <div
                    ref={rowRef}
                    className="flex gap-3 sm:gap-4 md:gap-6 overflow-x-auto scrollbar-hide pb-6 pt-2 snap-x scroll-container"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {movies.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} onClick={onMovieClick} />
                    ))}
                </div>

                {/* Right Arrow - Hidden on mobile */}
                <button
                    onClick={() => scroll('right')}
                    className="hidden sm:flex absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-black via-black/80 to-transparent z-20 items-center justify-center opacity-0 group-hover/row:opacity-100 transition-all duration-300 cursor-pointer rounded-r-xl"
                >
                    <div className="glass-dark p-3 rounded-full hover:bg-white/20 transition-all">
                        <ChevronRight className="w-6 h-6 text-white drop-shadow-lg" />
                    </div>
                </button>
            </div>
        </div>
    );
};

export default ContentRow;
