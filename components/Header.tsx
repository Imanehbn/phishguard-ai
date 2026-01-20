import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface HeaderProps {
  onOpenPrivacy: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenPrivacy }) => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">PhishGuard AI</h1>
            <p className="text-xs text-gray-500 hidden sm:block">Intelligent Email Threat Detection</p>
          </div>
        </div>
        <nav className="flex gap-4">
          <button 
            type="button"
            className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
          >
            How it Works
          </button>
          <button 
            type="button"
            onClick={onOpenPrivacy}
            className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
          >
            Privacy
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;