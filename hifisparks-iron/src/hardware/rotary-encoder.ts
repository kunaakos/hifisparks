
import { EventEmitter } from "events"

import {
	IRotaryEncoder,
	RotaryEncoderConfig,
} from "hifisparks-lib/types/hardware"

import { createDigitalInputPin } from "./pins"

export const createRotaryEncoder = ({ pins }: RotaryEncoderConfig): IRotaryEncoder => {

	const pinA = createDigitalInputPin(pins.a)
	const pinB = createDigitalInputPin(pins.b)

	const prev = {
		a: false,
		b: false, // not used
	}
	const curr = {
		a: false,
		b: false,
	}

	const handler = (pinName: "a" | "b") => (value: boolean) => {
		curr[pinName] = value
		if ((prev.a === false) && (curr.a === true)) {
			if (curr.b === false) {
				emitter.emit("clockwiseClick")
			} else {
				emitter.emit("counterclockwiseClick")
			}
		}
		prev[pinName] = value
	}

	pinA.on("change", handler("a"))
	pinB.on("change", handler("b"))

	const emitter: IRotaryEncoder = new EventEmitter()

	return emitter
}
