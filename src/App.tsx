/**
 * App component
 * - Reads pageConfig.json (typed as PageConfig)
 * - Maps declared component types to concrete React components
 * - Renders each component with its id and props from config
 */
import React, { useEffect, useMemo, useState } from 'react';
import CalendarComponent from './components/CalendarComponent';
import ButtonComponent from './components/ButtonComponent';
import ChartComponent from './components/ChartComponent';
import DropdownComponent from './components/DropdownComponent';
import TextboxComponent from './components/TextboxComponent';
import pageConfig from './config/pageConfig.json';
import { ComponentConfig, ComponentType, PageConfig } from './config/types';
import { Theme, ThemeContext } from './themeContext';

// Cast the imported JSON to the PageConfig TS type for better type safety
const cfg = pageConfig as PageConfig;

// Integration seam: map logical types from config to actual React components
const componentMap: Record<ComponentType, React.FC<any>> = {
  calendar: CalendarComponent,
  button: ButtonComponent,
  chart: ChartComponent,
  dropdown: DropdownComponent,
  textbox: TextboxComponent,
};

const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') return 'light';
  try {
    const stored = window.localStorage.getItem('preferred-theme');
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {
    // If storage is unavailable, fall back to the media query
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
};

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      window.localStorage.setItem('preferred-theme', theme);
    } catch {
      // Storage might be unavailable (e.g., private mode); ignore gracefully
    }
  }, [theme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = (event: MediaQueryListEvent) => {
      setTheme(event.matches ? 'dark' : 'light');
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    }

    mediaQuery.addListener(listener);
    return () => mediaQuery.removeListener(listener);
  }, []);

  const themeLabel = useMemo(
    () =>
      theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme',
    [theme],
  );

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className='app'>
        <header className='app__header'>
          <h1 className='app__title'>Dynamic Dashboard</h1>
          <button
            className='control control--button theme-toggle'
            type='button'
            onClick={toggleTheme}
          >
            {themeLabel}
          </button>
        </header>

        <div className='components-grid'>
          {/* Render all components declared in the configuration */}
          {cfg.components.map((c: ComponentConfig) => {
            const Comp = componentMap[c.type];
            return (
              <div key={c.id} className='component-card'>
                <Comp id={c.id} {...c.props} />
              </div>
            );
          })}
        </div>
      </div>
    </ThemeContext.Provider>
  );
};

export default App;
