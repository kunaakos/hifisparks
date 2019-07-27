import cloneDeep from "lodash/cloneDeep"

import {
	IInputSelector,
	InputSelectorState,
	InputState,
} from "hifisparks-lib/types/controls"
import { IDigitalPin } from "hifisparks-lib/types/hardware"

import { createDigitalPin } from "../hardware/pins"

type InputSelectorPins = {
	[pinNr: number]: IDigitalPin,
}
export const createInputSelector = (initialState: InputSelectorState): IInputSelector => {

	const pins = initialState.inputs.reduce<InputSelectorPins>(( pinsAcc, { pinNr }) => {
		pinsAcc[pinNr] = createDigitalPin({ pinNr })
		return pinsAcc
	}, {})

	const state = cloneDeep(initialState)

	const setActive = (selectedId: string): void => {

		const currentInput: InputState | void = state.inputs.find(input => input.id === state.active)
		const selectedInput: InputState | void = state.inputs.find(input => input.id === selectedId)

		if (!selectedInput || !currentInput) { return } // TODO: error handling, logging

		pins[currentInput.pinNr].off()
		pins[selectedInput.pinNr].on()
		state.active = selectedId
	}

	const getState = (): InputSelectorState => cloneDeep(state)

	return {
		type: "InputSelector",
		id: state.id,
		label: state.label,
		setActive,
		getState,
	}
}
