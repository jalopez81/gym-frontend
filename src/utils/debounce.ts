export const debounce = <T extends unknown[]>(
  fn: (id: string, ...args: T) => Promise<void>,
  delay: number
) => {
  const timers = new Map<string, NodeJS.Timeout>();

  return (id: string, ...args: T) => {
    // Clear existing timer for this specific ID
    const existingTimer = timers.get(id);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    // Set new timer for this ID
    const timer = setTimeout(async () => {
      await fn(id, ...args);
      timers.delete(id); // Clean up
    }, delay);

    timers.set(id, timer);
  };
};
