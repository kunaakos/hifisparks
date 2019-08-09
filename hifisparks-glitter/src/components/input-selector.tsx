import React, { useEffect, useRef } from "react"

import {
	Subtitle,
	VerticalButtonsContainer,
} from "./elements"

import { SimpleButton } from "hifisparks-lib/components/static-buttons"
import { InputState } from "hifisparks-lib/types/controls"
import { withHapticFeedback } from "hifisparks-lib/utils/misc"

type InputSelectorProps = {
	inputs: Array<InputState>,
	active: string,
	dispatchSetActiveInput: (id: string) => void,
}

export const InputSelector = ({
	inputs,
	active,
	dispatchSetActiveInput,
}: InputSelectorProps) => {

	const setActiveInputWithBuzz = useRef((id: string) => undefined)

	useEffect(() => {
		setActiveInputWithBuzz.current = withHapticFeedback([30], dispatchSetActiveInput)
	}, [])
	return (
		<VerticalButtonsContainer>
			<Subtitle>INPUTS</Subtitle>
			{
				inputs.map(({ id, label }: any) => {
					const isSelected = active === id
					return (
						<SimpleButton
							key={id}
							onPointerDown={isSelected ? null : () => { setActiveInputWithBuzz.current(id) }}
							className={isSelected ? "active" : null}
						>
							{label}
						</SimpleButton>
					)
				})
			}
		</VerticalButtonsContainer>
	)
}
