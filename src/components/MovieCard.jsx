import React from 'react';
import { Play } from 'lucide-react';

const MovieCard = ({ movie, onClick }) => {
    return (
        <div
            onClick={() => onClick && onClick(movie)}
            className="relative group min-w-[100px] sm:min-w-[130px] md:min-w-[180px] lg:min-w-[200px] aspect-[2/3] cursor-pointer snap-start"
        >
            {/* Image Container */}
            <div className="relative w-full h-full overflow-hidden rounded-xl sm:rounded-2xl shadow-lg">
                <img
                    src={movie.medium_cover_image || movie.image}
                    alt={movie.title}
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-75"
                    loading="lazy"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />
            </div>

            {/* Hover Overlay Content (Desktop) */}
            <div className="hidden sm:flex absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-2xl items-center justify-center backdrop-blur-sm bg-black/40">
                <div className="transform scale-90 group-hover:scale-100 transition-transform duration-300 flex flex-col items-center gap-3 px-2">
                    <button className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full p-3 shadow-xl hover:shadow-indigo-500/50 hover:scale-110 transition-all duration-300 group/btn">
                        <Play className="w-6 h-6 fill-current pl-1 group-hover/btn:scale-110 transition-transform" />
                    </button>
                    <div className="text-center">
                        <h3 className="text-white font-bold text-sm drop-shadow-lg line-clamp-2">{movie.title}</h3>
                        <p className="text-white/80 text-xs font-medium mt-1">
                            {movie.year}
                        </p>
                    </div>
                </div>
            </div>
            
            {/* Mobile Info - Always visible on mobile */}
            <div className="sm:hidden absolute bottom-0 left-0 right-0 p-2">
                <h3 className="text-white font-semibold text-xs drop-shadow-md line-clamp-2">{movie.title}</h3>
                <p className="text-white/70 text-[10px]">{movie.year}</p>
            </div>
        </div>
    );
};

export default MovieCard;
