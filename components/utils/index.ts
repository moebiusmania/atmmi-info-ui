export const loadingClass = (): string => {
  const value: number = Math.ceil(Math.random() * 4);
  return `h-4 bg-gray-400 rounded w-${value}/4`;
};
