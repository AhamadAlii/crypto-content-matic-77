
import React from 'react';
import { Button } from '@/components/ui/button';
import { Settings, Moon, Sun } from 'lucide-react';

interface HeaderProps {
  toggleTheme: () => void;
  isDarkMode: boolean;
}

const Header: React.FC<HeaderProps> = ({ toggleTheme, isDarkMode }) => {
  return (
    <header className="animate-fade-in fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/10 dark:border-gray-800/30 backdrop-blur-lg flex items-center justify-between px-8 py-4">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <span className="text-2xl font-bold text-gradient">Crypto</span>
          <span className="absolute -top-1 -right-1.5 h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse-light"></span>
        </div>
        <span className="text-2xl font-bold text-gradient">ContentMatic</span>
      </div>
      
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={toggleTheme}
          className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-all duration-200">
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </Button>
        
        <Button 
          variant="ghost" 
          size="icon"
          className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-all duration-200">
          <Settings size={20} />
        </Button>
      </div>
    </header>
  );
};

export default Header;
