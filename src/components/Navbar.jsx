import React, { useState, useEffect } from 'react';
import { Search, Download, X, Menu, User as UserIcon, LogOut, Heart, Compass } from 'lucide-react';

const Navbar = ({ onLoginClick, onSearch, user, onLogout, onWishlistClick, onExploreClick }) => {
    const [scrolled, setScrolled] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showInstallButton, setShowInstallButton] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);

        const handleInstallPrompt = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowInstallButton(true);
        };
        window.addEventListener('beforeinstallprompt', handleInstallPrompt);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('beforeinstallprompt', handleInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            setShowInstallButton(false);
        }
        setDeferredPrompt(null);
    };

    const handleSearchChange = (value) => {
        setSearchQuery(value);
        onSearch(value);
    };

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled || isMenuOpen ? 'bg-black/80 backdrop-blur-xl border-b border-white/10 shadow-lg' : 'bg-gradient-to-b from-black/90 via-black/50 to-transparent'}`}>
            <div className="max-w-[1920px] mx-auto px-4 sm:px-6 md:px-12 h-16 sm:h-18 flex items-center justify-between">
                {/* Left: Menu + Logo */}
                <div className="flex items-center gap-3 sm:gap-4">
                    {/* Mobile Menu Button */}
                    <button
                        className="sm:hidden text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-all"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    <a href="/" className="flex items-center gap-2 group">
                        <span className="font-bold text-xl sm:text-2xl bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-tight group-hover:from-indigo-300 group-hover:via-purple-300 group-hover:to-pink-300 transition-all duration-300">Movies</span>
                    </a>
                </div>

                {/* Desktop Actions */}
                <div className="hidden sm:flex items-center gap-6">
                    <div className="relative group">
                        <Search className="w-5 h-5 text-white/60 group-hover:text-white/90 transition-colors absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Search movies..."
                            value={searchQuery}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            className="glass-dark rounded-full py-2.5 pl-10 pr-12 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 w-56 lg:w-72 transition-all duration-300"
                        />
                    </div>

                    <button
                        onClick={onExploreClick}
                        className="flex items-center gap-2 text-white/70 hover:text-white transition-all px-4 py-2 rounded-lg hover:bg-white/10"
                    >
                        <Compass className="w-4 h-4" />
                        <span className="text-sm font-medium">Explore</span>
                    </button>

                    <button
                        onClick={onWishlistClick}
                        className="flex items-center gap-2 text-white/70 hover:text-white transition-all px-4 py-2 rounded-lg hover:bg-white/10"
                    >
                        <Heart className="w-4 h-4" />
                        <span className="text-sm font-medium">Wishlist</span>
                    </button>

                    {showInstallButton && deferredPrompt && (
                        <button
                            onClick={handleInstallClick}
                            className="flex items-center gap-2 glass rounded-full px-4 py-2 text-xs font-medium hover:bg-white/15 transition-all"
                        >
                            <Download className="w-4 h-4" />
                            <span>Install</span>
                        </button>
                    )}

                    {user ? (
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-purple-500/30">
                                {user.username?.[0]?.toUpperCase() || 'U'}
                            </div>
                            <button
                                onClick={onLogout}
                                className="flex items-center gap-2 text-white/70 hover:text-red-400 transition-all px-3 py-2 rounded-lg hover:bg-red-500/10"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={onLoginClick}
                            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:shadow-lg hover:shadow-indigo-500/30 hover:scale-105 transition-all duration-300"
                        >
                            Sign In
                        </button>
                    )}
                </div>

                {/* Mobile Right Actions */}
                <div className="sm:hidden flex items-center gap-2">
                    {/* Search Toggle */}
                    <button
                        onClick={() => setIsSearchOpen(!isSearchOpen)}
                        className="p-2 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-all"
                    >
                        {isSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
                    </button>

                    {showInstallButton && deferredPrompt && (
                        <button
                            onClick={handleInstallClick}
                            className="p-2 glass rounded-full text-white"
                        >
                            <Download className="w-4 h-4" />
                        </button>
                    )}

                    {user ? (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white shadow-lg">
                            {user.username?.[0]?.toUpperCase() || 'U'}
                        </div>
                    ) : (
                        <button
                            onClick={onLoginClick}
                            className="text-xs font-semibold text-white px-3 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full"
                        >
                            Sign In
                        </button>
                    )}
                </div>
            </div>

            {/* Mobile Search Bar */}
            {isSearchOpen && (
                <div className="sm:hidden px-4 pb-4 animate-fade-in">
                    <div className="relative">
                        <Search className="w-5 h-5 text-white/50 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search movies..."
                            value={searchQuery}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            autoFocus
                            className="w-full glass-dark rounded-xl py-3 pl-10 pr-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                        />
                    </div>
                </div>
            )}

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="sm:hidden glass-strong border-t border-white/10 animate-slide-up safe-area-inset">
                    <div className="flex flex-col p-4 gap-2">
                        <button
                            onClick={() => {
                                onExploreClick();
                                setIsMenuOpen(false);
                            }}
                            className="flex items-center gap-3 text-left text-base font-medium text-white/80 hover:text-white py-3 px-4 rounded-xl hover:bg-white/10 transition-all"
                        >
                            <Compass className="w-5 h-5" />
                            Explore
                        </button>

                        <button
                            onClick={() => {
                                onWishlistClick();
                                setIsMenuOpen(false);
                            }}
                            className="flex items-center gap-3 text-left text-base font-medium text-white/80 hover:text-white py-3 px-4 rounded-xl hover:bg-white/10 transition-all"
                        >
                            <Heart className="w-5 h-5" />
                            Wishlist
                        </button>

                        {user && (
                            <button
                                onClick={() => {
                                    onLogout();
                                    setIsMenuOpen(false);
                                }}
                                className="flex items-center gap-3 text-left text-base font-medium text-red-400 hover:text-red-300 py-3 px-4 rounded-xl hover:bg-red-500/10 mt-2 border-t border-white/10 pt-4 transition-all"
                            >
                                <LogOut className="w-5 h-5" />
                                Logout
                            </button>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
