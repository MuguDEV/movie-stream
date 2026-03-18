import React, { useState, useEffect } from 'react';
import { X, Filter, ChevronDown, Star } from 'lucide-react';
import { movies as api } from '../services/api';
import Loader from './Loader';

const Explore = ({ isOpen, onClose, onMovieClick, initialGenre = 'all', initialSort = 'date_added' }) => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [showFilters, setShowFilters] = useState(false);

    // Filters
    const [genre, setGenre] = useState(initialGenre);
    const [rating, setRating] = useState('0');
    const [sortBy, setSortBy] = useState(initialSort);
    const [orderBy, setOrderBy] = useState('desc');

    const genres = ["All", "Action", "Adventure", "Animation", "Biography", "Comedy", "Crime", "Documentary", "Drama", "Family", "Fantasy", "Film-Noir", "History", "Horror", "Music", "Musical", "Mystery", "Romance", "Sci-Fi", "Short", "Sport", "Thriller", "War", "Western"];
    const ratings = ["All", "9+", "8+", "7+", "6+", "5+"];
    const sortOptions = [
        { value: 'date_added', label: 'Latest' },
        { value: 'download_count', label: 'Popular' },
        { value: 'rating', label: 'Top Rated' },
        { value: 'year', label: 'Year' },
        { value: 'title', label: 'A-Z' }
    ];

    // Reset filters when modal opens
    useEffect(() => {
        if (isOpen) {
            setGenre(initialGenre);
            setSortBy(initialSort);
            setPage(1);
            setMovies([]);
            fetchMovies();
        }
    }, [isOpen, initialGenre, initialSort]);

    useEffect(() => {
        if (isOpen) {
            fetchMovies();
        }
    }, [genre, rating, sortBy, orderBy, page]);

    const fetchMovies = async () => {
        setLoading(true);
        try {
            const params = {
                limit: 20,
                page: page,
                sort_by: sortBy,
                order_by: orderBy,
            };

            if (genre !== 'all') params.genre = genre.toLowerCase();
            if (rating !== '0') params.minimum_rating = parseInt(rating);

            const res = await api.getMovies(params);
            if (page === 1) {
                setMovies(res.data.data.movies || []);
            } else {
                setMovies(prev => [...prev, ...(res.data.data.movies || [])]);
            }
        } catch (error) {
            console.error("Error fetching explore movies:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (setter, value) => {
        setter(value);
        setPage(1);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] bg-[#0a0a0a] overflow-y-auto animate-fade-in">
            {/* Header - Fixed */}
            <div className="sticky top-0 z-20 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/10">
                <div className="px-3 sm:px-4 md:px-12 py-3 sm:py-4 flex items-center justify-between">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white flex items-center gap-2">
                        <Filter className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
                        <span className="hidden sm:inline">Explore Movies</span>
                        <span className="sm:hidden">Explore</span>
                    </h2>
                    <div className="flex items-center gap-2">
                        {/* Mobile filter toggle */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="sm:hidden p-2 rounded-full bg-white/10 active:bg-white/20 text-white"
                        >
                            <ChevronDown className={`w-5 h-5 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full bg-white/10 active:bg-white/20 sm:hover:bg-white/20 text-white transition-colors"
                        >
                            <X className="w-5 h-5 sm:w-6 sm:h-6" />
                        </button>
                    </div>
                </div>

                {/* Filters - Collapsible on mobile */}
                <div className={`px-3 sm:px-4 md:px-12 py-3 sm:py-4 border-t border-white/5 bg-white/5 ${showFilters ? 'block' : 'hidden sm:block'}`}>
                    <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4">
                        {/* Genre - Horizontal scroll on mobile */}
                        <div className="w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 -mx-3 px-3 sm:mx-0 sm:px-0">
                            <div className="flex sm:block gap-2 min-w-max sm:min-w-0">
                                <div className="relative sm:hidden flex gap-2">
                                    {genres.slice(0, 8).map(g => (
                                        <button
                                            key={g}
                                            onClick={() => handleFilterChange(setGenre, g === 'All' ? 'all' : g)}
                                            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                                                genre === (g === 'All' ? 'all' : g)
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-white/10 text-white/70'
                                            }`}
                                        >
                                            {g}
                                        </button>
                                    ))}
                                </div>
                                {/* Desktop select */}
                                <div className="relative hidden sm:block">
                                    <select
                                        value={genre}
                                        onChange={(e) => handleFilterChange(setGenre, e.target.value)}
                                        className="appearance-none bg-black border border-white/20 text-white text-sm py-2 pl-3 pr-8 rounded-lg focus:outline-none focus:border-blue-500 cursor-pointer"
                                    >
                                        {genres.map(g => (
                                            <option key={g} value={g === 'All' ? 'all' : g}>{g}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        {/* Rating */}
                        <div className="relative">
                            <select
                                value={rating}
                                onChange={(e) => handleFilterChange(setRating, e.target.value)}
                                className="appearance-none bg-black border border-white/20 text-white text-sm py-2 pl-3 pr-8 rounded-lg focus:outline-none focus:border-blue-500 cursor-pointer"
                            >
                                <option value="0">Rating</option>
                                {ratings.slice(1).map(r => (
                                    <option key={r} value={r.replace('+', '')}>{r}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none" />
                        </div>

                        {/* Sort By */}
                        <div className="relative">
                            <select
                                value={sortBy}
                                onChange={(e) => handleFilterChange(setSortBy, e.target.value)}
                                className="appearance-none bg-black border border-white/20 text-white text-sm py-2 pl-3 pr-8 rounded-lg focus:outline-none focus:border-blue-500 cursor-pointer"
                            >
                                {sortOptions.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Results Grid - Optimized for all screen sizes */}
            <div className="px-3 sm:px-4 md:px-12 py-4 sm:py-6 md:py-8 safe-area-inset">
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
                    {movies.map(movie => (
                        <div
                            key={movie.id}
                            onClick={() => onMovieClick(movie)}
                            className="cursor-pointer group active:scale-95 transition-transform"
                        >
                            <div className="relative aspect-[2/3] rounded-lg sm:rounded-xl overflow-hidden mb-1.5 sm:mb-2 md:mb-3 shadow-lg">
                                <img
                                    src={movie.medium_cover_image}
                                    alt={movie.title}
                                    loading="lazy"
                                    className="w-full h-full object-cover sm:group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-black/60 backdrop-blur-sm px-1.5 py-0.5 sm:px-2 sm:py-1 rounded text-[10px] sm:text-xs font-bold text-yellow-500 flex items-center gap-0.5 sm:gap-1">
                                    <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current" />
                                    {movie.rating}
                                </div>
                            </div>
                            <h3 className="text-[11px] sm:text-xs md:text-sm font-medium text-white sm:group-hover:text-blue-400 transition-colors truncate">{movie.title}</h3>
                            <p className="text-[10px] sm:text-xs text-white/50">{movie.year}</p>
                        </div>
                    ))}
                </div>

                {/* Load More */}
                {!loading && movies.length > 0 && (
                    <div className="flex justify-center mt-8 sm:mt-10 md:mt-12 mb-6 sm:mb-8">
                        <button
                            onClick={() => setPage(prev => prev + 1)}
                            className="bg-white/10 active:bg-white/20 sm:hover:bg-white/20 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-sm sm:text-base font-medium transition-colors"
                        >
                            Load More
                        </button>
                    </div>
                )}

                {loading && (
                    <div className="flex justify-center mt-8 sm:mt-12">
                        <Loader className="w-6 h-6 sm:w-8 sm:h-8" />
                    </div>
                )}

                {!loading && movies.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 sm:py-20 text-white/50">
                        <p className="text-sm sm:text-base">No movies found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Explore;
