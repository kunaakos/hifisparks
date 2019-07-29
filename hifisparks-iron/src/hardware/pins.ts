import { EventEmitter } from "events"
import {
	Button,
	Led,
	Pin,
} from "johnny-five"
import debounce from "lodash/debounce"

import {
	DigitalInputPinConfig,
	IDigitalInputPin,
	IDigitalOutputPin,
	IPwmPin,
	OutputPinConfig,
} from "hifisparks-lib/types/hardware"

export const createDigitalOutputPin = ({ pinNr }: OutputPinConfig): IDigitalOutputPin => {
	const pin = new Pin({
		pin: pinNr,
		type: "digital",
	})

	return {
		off: () => pin.low(),
		on: () => pin.high(),
	}
}

export const createPwmPin = ({ pinNr }: OutputPinConfig): IPwmPin => {

	// johnny-five Pin doesn't do pwm, so we're going with Led 😒
	const led = new Led(pinNr)

	return {
		on: (value: number) => led.brightness(value),
		off: () => led.off(),
	}
}

export const createDigitalInputPin = ({
	pinNr,
	internalResistor,
	debounceMs,
}: DigitalInputPinConfig): IDigitalInputPin => {

	const resistorOptions: { isPullup?: boolean, isPulldown?: boolean } =
		internalResistor
			? internalResistor === "pullUp"
				? { isPullup: true }
				: { isPulldown: true }
			: {}

	// again, johnny-five API being the johnny-five API 🤷‍
	// we're looking for state changes, so we'll go with Button for a pin
	const button = new Button({
		pin: pinNr,
		...resistorOptions,
	})

	const emitter: IDigitalInputPin = new EventEmitter()

	const maybeDebounce = debounceMs
		? debounce
		: (cb: any) => cb

	button.on(
		"press",
		maybeDebounce(() => {
			emitter.emit("rise")
			emitter.emit("change", true)
		}),
	)

	button.on(
		"release",
		maybeDebounce(() => {
			emitter.emit("fall")
			emitter.emit("change", false)
		}),
	)

	return emitter
}
