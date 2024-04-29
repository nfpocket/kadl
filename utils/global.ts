/**
 * Creates a debounced function that delays invoking the provided function until after wait milliseconds have elapsed since the last time the debounced function was invoked.
 *
 * @param {F} fn - The function to debounce.
 * @param {number} delay - The number of milliseconds to delay.
 * @returns {F} The debounced function.
 */
export function debounce<F extends (...params: any[]) => void>(fn: F, delay = 500) {
  let timeoutID: number;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutID);
    timeoutID = window.setTimeout(() => fn.apply(this, args), delay);
  } as F;
}

/**
 * Throttles the execution of a function, ensuring it's called at most once within a specified interval.
 * @param {Function} fn - The function to be throttled.
 * @param {number} [wait=1000] - The interval in milliseconds during which the function can only be called once.
 * @returns {Function} - The throttled function.
 */
export const throttle = <F extends (...params: any[]) => void>(fn: F, wait: number = 1000) => {
  let inThrottle: boolean, lastFn: ReturnType<typeof setTimeout>, lastTime: number;
  return function (this: any, ...args: any[]) {
    const context = this;
    if (!inThrottle) {
      fn.apply(context, args);
      lastTime = Date.now();
      inThrottle = true;
    } else {
      clearTimeout(lastFn);
      lastFn = setTimeout(() => {
        if (Date.now() - lastTime >= wait) {
          fn.apply(context, args);
          lastTime = Date.now();
        }
      }, Math.max(wait - (Date.now() - lastTime), 0));
    }
  };
};
