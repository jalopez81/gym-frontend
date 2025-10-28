export const debounce = (fn: (...args: any[]) => Promise<void>, delay: number) => {
  const timers = new Map<string, NodeJS.Timeout>();
  
  return (id: string, ...args: any[]) => {
    // Clear existing timer for this specific ID
    if (timers.has(id)) {
      clearTimeout(timers.get(id)!);
    }
    
    // Set new timer for this ID
    const timer = setTimeout(async () => {
      await fn(id, ...args);
      timers.delete(id); // Clean up
    }, delay);
    
    timers.set(id, timer);
  };
};
