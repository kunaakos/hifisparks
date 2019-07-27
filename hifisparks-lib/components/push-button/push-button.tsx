import React, { useEffect, useState } from "react"

import { PushButtonProps } from "./"

import { hapticFeedback  } from "hifisparks-lib/utils/misc"

const onContextMenu = (event: React.SyntheticEvent) => {
	event.preventDefault()
	event.stopPropagation()
	return false
}

export const PushButton = (props: PushButtonProps) => {

	const {
		wrapper: Wrapper,
		children,
		onPushed: onPushedCb,
		onReleased: onReleasedCb,
		whilePushed,
		delay,
		hapticFeedbackPattern,
	} = props

	const [intervalHandle, setIntervalHandle] = useState(0)

	const intervalClear = () => {
		intervalHandle && clearInterval(intervalHandle)
		setIntervalHandle(0)
	}

	const intervalSet = () => {
		const handle = whilePushed
			? setInterval(whilePushed, delay)
			: 0
		setIntervalHandle(handle)
	}

	useEffect(() => intervalClear, [])

	const onPressed = () => {
		intervalSet()
		hapticFeedbackPattern && hapticFeedback(hapticFeedbackPattern)
		onPushedCb && onPushedCb()
	}

	const onReleased = () => {
		intervalClear()
		hapticFeedbackPattern && hapticFeedback(hapticFeedbackPattern)
		onReleasedCb && onReleasedCb()
	}

	return (
		<Wrapper
			/**
			 * This control is active while it's calling whilePushed.
			 */
			active={Boolean(intervalHandle)}

			onPointerDown={onPressed}

			onPointerUp={onReleased}
			onPointerCancel={onReleased}
			onPointerLeave={onReleased}
			onLostPointerCapture={onReleased}
			onPointerOut={onReleased}

			/**
			 * It's important to disable the context menu,
			 * because we must make sure onRelease gets called on touch devices.
			 */
			onContextMenu={onContextMenu}
		>
			{children}
		</Wrapper>
	)
}
