import { IDigitalOutputPin, IPwmPin } from "hifisparks-lib/types/hardware"
import { Led, Pin } from "johnny-five"

type OutputPinParams = {
	pinNr: number,
}

export const createDigitalOutputPin = ({ pinNr }: OutputPinParams): IDigitalOutputPin => {
	const pin = new Pin({
		pin: pinNr,
		type: "digital",
	})

	return {
		off: () => pin.low(),
		on: () => pin.high(),
	}
}

export const createPwmPin = ({ pinNr }: OutputPinParams): IPwmPin => {

	// johnny-five Pin doesn't do pwm, so we're going with Led 😒
	const led = new Led(pinNr)

	return {
		on: (value: number) => led.brightness(value),
		off: () => led.off(),
	}
}
