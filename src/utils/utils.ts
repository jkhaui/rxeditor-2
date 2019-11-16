/**
 * Generates a random 5 character string separated by a hyphen.
 */
export const randomId = () => `${
  Math
    .random()
    .toString(36)
    .substring(2, 4)
}-${
  Math
    .random()
    .toString(36)
    .substring(2, 4)
}`;

/**
 * Below are some functional programming utilities, courtesy of
 * https://leanpub.com/composingsoftware
 */

export const ifVal = (x: any, f: any) => x == null ? null : f(x);

/**
 * Higher-order function to combine multiple functions.
 * Note that when `compose` is used, the function application order is from
 * "bottom-to-top" when the function arguments are stacked on top of one
 * another.
 */
export const compose = (
  ...fns: any[]
) => (
  x: any,
) => fns.reduceRight((y, f) => f(y), x);

/**
 * Just like `compose`, but runs function arguments in reverse-order (i.e.
 * from "top-to-bottom" when functions are stacked.
 */
export const pipe = (
  ...fns: any[]
) => (
  x: any,
) => fns.reduce((y, f) => f(y), x);

/**
 * Used to inspect and debug values between functions.
 */
export const trace = (label: any) => (value: any) => {
  console.log(`${label}: ${value} `);
  return value;
};
