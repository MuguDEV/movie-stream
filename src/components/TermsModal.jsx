import React from 'react';
import { X } from 'lucide-react';

const TermsModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center animate-fade-in">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

            <div className="relative bg-[#1c1c1e] w-full sm:w-[95%] sm:max-w-2xl h-[90vh] sm:h-auto sm:max-h-[80vh] rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-fade-in-up border-t sm:border border-white/10 safe-area-inset">
                {/* Header */}
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/10 bg-white/5 flex-shrink-0">
                    <h2 className="text-lg sm:text-2xl font-bold text-white">Terms of Service</h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full bg-white/10 active:bg-white/20 sm:hover:bg-white/20 text-white transition-colors"
                    >
                        <X className="w-5 h-5 sm:w-6 sm:h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto text-gray-300 space-y-5 sm:space-y-6 leading-relaxed text-sm sm:text-base">
                    <section>
                        <h3 className="text-white font-bold text-base sm:text-lg mb-2">1. Acceptance of Terms</h3>
                        <p>By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.</p>
                    </section>

                    <section>
                        <h3 className="text-white font-bold text-base sm:text-lg mb-2">2. Educational Purpose</h3>
                        <p>This platform is created for educational and demonstration purposes only. It is a portfolio project designed to showcase web development skills.</p>
                    </section>

                    <section>
                        <h3 className="text-white font-bold text-base sm:text-lg mb-2">3. Content Disclaimer</h3>
                        <p>We do not host any content on our servers. All content is provided by non-affiliated third parties. We do not accept responsibility for content hosted on third-party websites.</p>
                    </section>

                    <section>
                        <h3 className="text-white font-bold text-base sm:text-lg mb-2">4. User Privacy</h3>
                        <p>We respect your privacy. No personal data, viewing history, or search logs are stored on our servers. All data handling is performed locally on your device.</p>
                    </section>

                    <section>
                        <h3 className="text-white font-bold text-base sm:text-lg mb-2">5. Changes to Terms</h3>
                        <p>We reserve the right to modify these terms at any time. Your continued use of the site after any such changes constitutes your acceptance of the new terms.</p>
                    </section>
                </div>

                {/* Footer */}
                <div className="p-4 sm:p-6 border-t border-white/10 bg-white/5 flex justify-end flex-shrink-0">
                    <button
                        onClick={onClose}
                        className="w-full sm:w-auto px-6 py-3 sm:py-2 bg-blue-600 active:bg-blue-700 sm:hover:bg-blue-700 text-white rounded-xl sm:rounded-lg font-medium transition-colors"
                    >
                        I Understand
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TermsModal;
