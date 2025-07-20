import { useSyncExternalStore } from 'react';

type WindowSize = {
  width: number;
  height: number;
};

const getWindowWidth = () => {
  return window.innerWidth;
};
const getWindowHeight = () => {
  return window.innerHeight;
};

const subscribeWindowSizeChange = (callback: () => void) => {
  window.addEventListener('resize', callback);
  return () => window.removeEventListener('resize', callback);
};

export const useWindowSize = (): WindowSize => {
  const width = useSyncExternalStore(subscribeWindowSizeChange, getWindowWidth);
  const height = useSyncExternalStore(
    subscribeWindowSizeChange,
    getWindowHeight
  );
  return { width, height };
};
