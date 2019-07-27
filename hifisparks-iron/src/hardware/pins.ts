import { IDigitalPin, IPwmPin } from "hifisparks-lib/types/hardware"
import { Led, Pin } from "johnny-five"

type PinParams = {
	pinNr: number,
}

export const createDigitalPin = ({ pinNr }: PinParams): IDigitalPin => {
	const pin = new Pin({
		pin: pinNr,
		type: "digital",
	})

	return {
		off: () => pin.low(),
		on: () => pin.high(),
	}
}

export const createPwmPin = ({ pinNr }: PinParams): IPwmPin => {

	// johnny-five Pin doesn't do pwm, so we're going with Led 😒
	const led = new Led(pinNr)

	return {
		on: (value: number) => led.brightness(value),
		off: () => led.off(),
	}
}
