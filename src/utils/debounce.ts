export const debounce = (fn: (...args: any[]) => Promise<void>, delay: number) => {
  let timer: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(async () => {
      await fn(...args);
    }, delay);
  };
};
