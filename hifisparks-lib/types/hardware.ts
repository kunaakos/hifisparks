import EventEmitter from "events"
import StrictEventEmitter from "strict-event-emitter-types"

export type OutputPinConfig = {
	pinNr: number,
}

export interface IDigitalOutputPin {
	on: () => void,
	off: () => void,
}

export interface IPwmPin {
	on: (value: number) => void,
	off: () => void,
}

export type DigitalInputPinConfig = {
	pinNr: number,
	internalResistor?: "pullUp" | "pullDown",
	debounceMs?: number,
}

export type IDigitalInputPin = StrictEventEmitter<
	EventEmitter,
	{
		rise: void,
		fall: void,
		change: (state: boolean) => void,
	}
>

export type Tb6612fngMotorDriverConfig = {
	type: "TB6612FNG",
	pins: {
		standby: number,
		dir: number,
		cdir: number,
		pwm: number,
	},
}

export type MotorDriverConfig = Tb6612fngMotorDriverConfig

export type MotorConfig = {
	driver: MotorDriverConfig,
}

export interface IMotor {
	forward: (speed: number) => void,
	reverse: (speed: number) => void,
	stop: () => void,
	isOn: () => boolean,
}

export type ButtonConfig = {
	pinNr: number,
	internalResistor?: "pullUp" | "pullDown",
	debounceMs?: number,
}

export type IButton = StrictEventEmitter<
	EventEmitter,
	{
		pressed: void,
	}
>

export type RotaryEncoderConfig = {
	pins: {
		a: DigitalInputPinConfig,
		b: DigitalInputPinConfig,
	},
}

export type IRotaryEncoder = StrictEventEmitter<
	EventEmitter,
	{
		clockwiseClick: () => void,
		counterclockwiseClick: () => void,
	}
>
