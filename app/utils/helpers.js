export const coinFlip = () => Math.random() < 0.5;
export const half = num => num/2;
export const invert = num => num * -1;
export const between = (min, max) => num => (num >= min) && (num <= max);