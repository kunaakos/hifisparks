import cloneDeep from "lodash/cloneDeep"

import { EventEmitter } from "events"

import {
	IInputSelector,
	InputSelectorState,
	InputState,
} from "hifisparks-lib/types/controls"
import { IDigitalOutputPin } from "hifisparks-lib/types/hardware"

import { createDigitalOutputPin } from "../hardware/pins"

type InputSelectorPins = {
	[pinNr: number]: IDigitalOutputPin,
}
export const createInputSelector = (initialState: InputSelectorState): IInputSelector => {

	const pins = initialState.inputs.reduce<InputSelectorPins>(( pinsAcc, { pinNr }) => {
		pinsAcc[pinNr] = createDigitalOutputPin({ pinNr })
		return pinsAcc
	}, {})

	const emitter = new EventEmitter()

	const state = cloneDeep(initialState)
	const getState = (): InputSelectorState => cloneDeep(state)

	const set = (selectedId: string): void => {

		const currentInput: InputState | void = state.inputs.find(input => input.id === state.active)
		const selectedInput: InputState | void = state.inputs.find(input => input.id === selectedId)

		if (!selectedInput || !currentInput) { return } // TODO: error handling, logging

		pins[currentInput.pinNr].off()
		pins[selectedInput.pinNr].on()
		state.active = selectedId

		emitter.emit("stateChange", getState())
	}

	const step = (val: number) => () => {
		const currentInputIndex: number = state.inputs.findIndex(input => input.id === state.active)

		if (currentInputIndex === -1) { return } // TODO: error handling, logging

		const nextInputIndex = currentInputIndex + val
		const lastInputIndex = state.inputs.length - 1

		if (nextInputIndex < 0) {
			set(state.inputs[lastInputIndex].id)
		} else if (nextInputIndex > lastInputIndex) {
			set(state.inputs[0].id)
		} else {
			set(state.inputs[nextInputIndex].id)
		}
	}

	return {
		type: "InputSelector",
		id: state.id,
		label: state.label,
		getState,
		set,
		prev: step(-1),
		next: step(1),
		events: emitter,
	}
}
