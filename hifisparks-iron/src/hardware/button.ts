import { EventEmitter } from "events"
import { Button } from "johnny-five"
import debounce from "lodash/debounce"

import { ButtonConfig, IButton } from "hifisparks-lib/types/hardware"

export const createButton = ({ pinNr, internalResistor, debounceMs }: ButtonConfig): IButton => {

	const resistorOptions: { isPullup?: boolean, isPulldown?: boolean } =
		internalResistor
			? internalResistor === "pullUp"
				? { isPullup: true }
				: { isPulldown: true }
			: {}

	const button = new Button({
		pin: pinNr,
		...resistorOptions,
	})

	const emitter: IButton = new EventEmitter()

	button.on("press", debounce(() => emitter.emit("pressed"), debounceMs))

	return emitter
}
