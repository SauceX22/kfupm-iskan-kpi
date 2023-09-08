declare global {
  interface Array<T> {
    groupBy<K extends keyof never>(getKey: (item: T) => K): Record<K, T[]>;
  }
}

Array.prototype.groupBy = function <T, K extends keyof never>(
  this: T[],
  getKey: (item: T) => K
): Record<K, T[]> {
  return this.reduce((previous, currentItem) => {
    const group = getKey(currentItem);
    if (!previous[group]) previous[group] = [];
    previous[group].push(currentItem);
    return previous;
  }, {} as Record<K, T[]>);
};

export {};
