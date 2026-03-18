import React, { useState, useEffect } from 'react';
import { Search, Download, X } from 'lucide-react';

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
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || isMenuOpen ? 'bg-black/95 backdrop-blur-md border-b border-white/5' : 'bg-gradient-to-b from-black/80 to-transparent'}`}>
            <div className="max-w-[1920px] mx-auto px-3 sm:px-4 md:px-12 h-14 sm:h-16 flex items-center justify-between">
                {/* Left: Menu + Logo */}
                <div className="flex items-center gap-2 sm:gap-4 md:gap-8">
                    {/* Mobile Menu Button */}
                    <button
                        className="sm:hidden text-white/80 active:text-white p-1"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>

                    <a href="/" className="flex items-center gap-2 text-white">
                        <span className="font-semibold text-base sm:text-lg tracking-tight">Movies</span>
                    </a>
                </div>

                {/* Desktop Actions */}
                <div className="hidden sm:flex items-center gap-4 md:gap-6">
                    <div className="flex items-center gap-3 md:gap-4">
                        {showInstallButton && deferredPrompt && (
                            <button
                                onClick={handleInstallClick}
                                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
                            >
                                <Download className="w-3 h-3" />
                                <span>Install</span>
                            </button>
                        )}

                        <div className="relative group">
                            <Search className="w-4 h-4 md:w-5 md:h-5 text-white/70 group-hover:text-white transition-colors absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <input
                                type="text"
                                placeholder="Search"
                                value={searchQuery}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                className="bg-white/10 border border-white/10 rounded-lg py-1.5 md:py-2 pl-9 md:pl-10 pr-4 text-sm text-white placeholder-white/50 focus:outline-none focus:bg-white/20 focus:w-64 w-40 md:w-48 transition-all duration-300"
                            />
                        </div>
                    </div>

                    <button
                        onClick={onExploreClick}
                        className="text-sm font-medium text-white/70 hover:text-white transition-colors"
                    >
                        Explore
                    </button>

                    <button
                        onClick={onWishlistClick}
                        className="text-sm font-medium text-white/70 hover:text-white transition-colors"
                    >
                        Wishlist
                    </button>

                    {user ? (
                        <div className="flex items-center gap-3 md:gap-4">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shadow-lg">
                                {user.username?.[0]?.toUpperCase() || 'U'}
                            </div>
                            <button
                                onClick={onLogout}
                                className="text-sm text-white/70 hover:text-white transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={onLoginClick}
                            className="bg-white text-black px-4 py-1.5 rounded-md text-sm font-medium hover:scale-105 transition-transform duration-200"
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
                        className="p-2 text-white/80 active:text-white"
                    >
                        {isSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
                    </button>

                    {showInstallButton && deferredPrompt && (
                        <button
                            onClick={handleInstallClick}
                            className="p-2 bg-white/10 rounded-full text-white"
                        >
                            <Download className="w-4 h-4" />
                        </button>
                    )}

                    {user ? (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
                            {user.username?.[0]?.toUpperCase() || 'U'}
                        </div>
                    ) : (
                        <button
                            onClick={onLoginClick}
                            className="text-sm font-medium text-white px-3 py-1.5 bg-white/10 rounded-lg"
                        >
                            Sign In
                        </button>
                    )}
                </div>
            </div>

            {/* Mobile Search Bar */}
            {isSearchOpen && (
                <div className="sm:hidden px-3 pb-3 animate-fade-in">
                    <div className="relative">
                        <Search className="w-5 h-5 text-white/50 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search movies..."
                            value={searchQuery}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            autoFocus
                            className="w-full bg-white/10 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-white placeholder-white/50 focus:outline-none focus:bg-white/20"
                        />
                    </div>
                </div>
            )}

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="sm:hidden bg-black/95 backdrop-blur-xl border-t border-white/10 animate-fade-in safe-area-inset">
                    <div className="flex flex-col p-4 gap-1">
                        <button
                            onClick={() => {
                                onExploreClick();
                                setIsMenuOpen(false);
                            }}
                            className="text-left text-base font-medium text-white/80 active:text-white py-3 px-2 rounded-lg active:bg-white/10"
                        >
                            Explore
                        </button>

                        <button
                            onClick={() => {
                                onWishlistClick();
                                setIsMenuOpen(false);
                            }}
                            className="text-left text-base font-medium text-white/80 active:text-white py-3 px-2 rounded-lg active:bg-white/10"
                        >
                            Wishlist
                        </button>

                        {user && (
                            <button
                                onClick={() => {
                                    onLogout();
                                    setIsMenuOpen(false);
                                }}
                                className="text-left text-base font-medium text-red-400 active:text-red-300 py-3 px-2 rounded-lg active:bg-white/10 mt-2 border-t border-white/10 pt-4"
                            >
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
