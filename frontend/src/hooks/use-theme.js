import { useCallback, useEffect, useState } from 'react';

const THEME_STORAGE_KEY = 'theme';
const DEFAULT_THEME = 'light';

const getStoredTheme = () => {
  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  return storedTheme === 'dark' ? 'dark' : DEFAULT_THEME;
};

const useTheme = () => {
  const [theme, setTheme] = useState(getStoredTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((currentTheme) => (currentTheme === 'light' ? 'dark' : 'light'));
  }, []);

  return { theme, toggleTheme };
};

export default useTheme;
