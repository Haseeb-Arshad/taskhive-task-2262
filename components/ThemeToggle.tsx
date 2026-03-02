import { useState, useEffect } from 'react';

interface ThemeToggleProps {
  defaultTheme?: 'light' | 'dark';
  onThemeChange?: (theme: 'light' | 'dark') => void;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  defaultTheme = 'light',
  onThemeChange
}) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(defaultTheme);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = prefersDark ? 'dark' : 'light';
      setTheme(initialTheme);
      document.documentElement.setAttribute('data-theme', initialTheme);
      localStorage.setItem('theme', initialTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    
    if (onThemeChange) {
      onThemeChange(newTheme);
    }
  };

  return (
    <div className="theme-toggle">
      <button
        onClick={toggleTheme}
        className="theme-toggle-btn flex items-center gap-2 p-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        <div className="switch relative inline-block w-10 h-6">
          <input
            type="checkbox"
            checked={theme === 'dark'}
            onChange={toggleTheme}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            aria-label="Toggle theme"
          />
          <div className="slider absolute inset-0 bg-gray-300 rounded-full transition-all duration-300">
            <div className="sun-moon absolute inset-0 flex items-center justify-center transition-all duration-300">
              <div className={`star absolute w-2 h-2 bg-yellow-400 rounded-full ${
                theme === 'dark' ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
              }`} />
              <div className={`moon absolute w-4 h-4 bg-gray-800 rounded-full ${
                theme === 'dark' ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`} />
            </div>
          </div>
        </div>
        <span className="text-sm font-medium">
          {theme === 'light' ? 'Light' : 'Dark'}
        </span>
      </button>
    </div>
  );
};

// CSS for the theme toggle (can be moved to globals.css if preferred)
const themeToggleStyles = `
  .theme-toggle-btn {
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 0.75rem;
    transition: all 0.2s ease;
  }
  
  .theme-toggle-btn:hover {
    background: rgba(59, 130, 246, 0.1);
  }
  
  .theme-toggle-btn .switch {
    position: relative;
    display: inline-block;
    width: 48px;
    height: 24px;
  }
  
  .theme-toggle-btn .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  
  .theme-toggle-btn .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: 0.4s;
    border-radius: 24px;
  }
  
  .theme-toggle-btn .slider:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
  }
  
  .theme-toggle-btn input:checked + .slider {
    background-color: #2196F3;
  }
  
  .theme-toggle-btn input:checked + .slider:before {
    transform: translateX(24px);
  }
  
  .theme-toggle-btn .sun-moon {
    position: relative;
    width: 100%;
    height: 100%;
  }
  
  .theme-toggle-btn .star {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transition: all 0.3s ease;
  }
  
  .theme-toggle-btn .moon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transition: all 0.3s ease;
  }
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = themeToggleStyles;
document.head.appendChild(styleSheet);