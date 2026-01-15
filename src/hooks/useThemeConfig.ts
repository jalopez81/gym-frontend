'use client';

import { useEffect, useState } from 'react';

export function useThemeConfig() {
  const [config, setConfig] = useState({});

  useEffect(() => {
    const stored = localStorage.getItem('config');
    if (stored) setConfig(JSON.parse(stored));
  }, []);

  return config;
}