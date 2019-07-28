import { MotorDriverConfig } from "./hardware"

/**
 * Input selector
 */

export type InputState = {
	id: string,
	label: string,
	pinNr: number,
}

export type InputSelectorState = {
	type: "InputSelector",
	id: string,
	label: string,
	inputs: Array<InputState>,
	active: string,
}

export interface IInputSelector {
	type: "InputSelector",
	id: string,
	label: string,
	getState: () => InputSelectorState,
	setActive: (id: string) => void,
}

/**
 * Motorized potentiometer
 */

export type MotorizedPotentiometerConfig = {
	type: "MotorizedPotentiometer",
	id: string,
	label: string,
	driver: MotorDriverConfig,
}

export interface IMotorizedPotentiometer {
	type: "MotorizedPotentiometer"
	id: string,
	label: string,
	up: (speed?: number) => void,
	down: (speed?: number) => void,
	stop: () => void,
}

export type Control =
	IInputSelector |
	IMotorizedPotentiometer
