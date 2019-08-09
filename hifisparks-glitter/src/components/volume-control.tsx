import React, { Fragment, useEffect, useRef } from "react"

import {
	HorizontalButtonsContainer,
	Subtitle,
} from "./elements"

import { PushButton } from "hifisparks-lib/components/push-button"
import { SimpleButton } from "hifisparks-lib/components/static-buttons"
import { hapticFeedback, withHapticFeedback } from "hifisparks-lib/utils/misc"

type VolumeControlProps = {
	dispatchVolumeUp: () => void,
	dispatchVolumeDown: () => void,
}

export const VolumeControl = ({
	dispatchVolumeUp,
	dispatchVolumeDown,
}: VolumeControlProps) => {

	const volumeUp = useRef(() => undefined)
	const volumeUpUpWithBuzz = useRef(() => undefined)
	const volumeDown = useRef(() => undefined)
	const volumeDownWithBuzz = useRef(() => undefined)
	const shortBuzz = useRef(() => undefined)

	useEffect(() => {
		volumeDown.current = dispatchVolumeDown
		volumeUp.current = dispatchVolumeUp
		volumeUpUpWithBuzz.current = withHapticFeedback([30], dispatchVolumeUp)
		volumeDownWithBuzz.current = withHapticFeedback([30], dispatchVolumeDown)
		shortBuzz.current = () => hapticFeedback([30])
	}, [])

	return (
		<Fragment>
			<Subtitle>Volume</Subtitle>
			<HorizontalButtonsContainer>

				<PushButton
					wrapper={SimpleButton}
					onPushed={volumeUpUpWithBuzz.current}
					onReleased={shortBuzz.current}
					whilePushed={volumeUp.current}
					delay={90}
				>Up</PushButton>

				<PushButton
					wrapper={SimpleButton}
					onPushed={volumeDownWithBuzz.current}
					onReleased={shortBuzz.current}
					whilePushed={volumeDown.current}
					delay={90}
				>Down</PushButton>

			</HorizontalButtonsContainer>
		</Fragment>
	)
}
