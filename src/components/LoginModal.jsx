import React, { useState } from 'react';
import { X, Lock } from 'lucide-react';

const LoginModal = ({ isOpen, onClose, onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await onLogin(username, password);
            onClose();
        } catch (err) {
            setError(err.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content - Bottom sheet on mobile */}
            <div className="relative bg-[#1c1c1e] w-full sm:w-[95%] sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden border-t sm:border border-white/10 animate-fade-in-up safe-area-inset">
                {/* Header */}
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/5">
                    <h2 className="text-lg sm:text-xl font-bold text-white">Sign in to Seedr</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full bg-white/10 active:bg-white/20 sm:hover:bg-white/10 transition-colors text-white/70 active:text-white sm:hover:text-white"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5 sm:space-y-6">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 sm:p-4 text-red-400 text-xs sm:text-sm">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-white/70 mb-2">Email</label>
                            <input
                                type="email"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3.5 sm:py-3 text-white placeholder-white/30 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                placeholder="Enter your email"
                                required
                                autoComplete="email"
                            />
                        </div>
                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-white/70 mb-2">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3.5 sm:py-3 text-white placeholder-white/30 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                                placeholder="Enter your password"
                                required
                                autoComplete="current-password"
                            />
                        </div>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-white text-black font-bold py-4 sm:py-3.5 rounded-xl sm:hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Lock className="w-4 h-4" />
                                    <span>Sign In</span>
                                </>
                            )}
                        </button>
                    </div>

                    <p className="text-center text-[10px] sm:text-xs text-white/40 pb-2 sm:pb-0">
                        Your credentials are sent securely to Seedr.cc
                    </p>
                </form>
            </div>
        </div>
    );
};

export default LoginModal;
