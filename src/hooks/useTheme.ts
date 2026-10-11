import { useEffect, useState } from 'react';

export function useTheme() {
  const [dark, setDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('hn-theme') === 'dark' ||
      (!localStorage.getItem('hn-theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add('dark');
      localStorage.setItem('hn-theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('hn-theme', 'light');
    }
  }, [dark]);

  return { dark, toggle: () => setDark((d) => !d), setDark };
}
