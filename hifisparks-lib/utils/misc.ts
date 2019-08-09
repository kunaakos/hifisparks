/**
 * A wrapper around setTimeout that return a function that resets
 * the timer to zero each time it's called.
 */
export const resettableTimeout = (callback: () => void, delay: number) => {

	let handle: number = 0

	const stop = () => {
		handle = 0
		callback()
	}

	return () => {
		handle && clearTimeout(handle)
		handle = setTimeout(stop, delay)
	}

}

/**
 * A safe wrapper around Navigator.vibrate.
 */
export const hapticFeedback = (pattern: Array<number>): void => {
	// @ts-ignore - tsconfig incorrect? investigate!
	navigator.vibrate && navigator.vibrate(pattern)
}

/**
 * A HOF that can be used to wrap a function and provide
 * haptic feedback (if available) when called.
 */
export const withHapticFeedback =
	<A extends Array<any>, R>(pattern: Array<number>, callback: (...args: A) => R) => {
		return (...args: A): R => {
			hapticFeedback(pattern)
			return callback(...args)
		}
	}
