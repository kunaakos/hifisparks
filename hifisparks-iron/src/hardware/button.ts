import { EventEmitter } from "events"

import {
	ButtonConfig,
	IButton,
} from "hifisparks-lib/types/hardware"

import { createDigitalInputPin } from "./pins"

export const createButton = (config: ButtonConfig): IButton => {

	const pin = createDigitalInputPin(config)
	const emitter: IButton = new EventEmitter()

	// NOTE: this exists because it will implement functions
	// like detecting long presses, double clicks etc.

	pin.on("rise", () => emitter.emit("pressed"))

	return emitter
}
