import { Led, Pin } from "johnny-five"

import { resettableTimeout } from "hifisparks-lib/utils/misc"

type VolumeControlConfig = {
	pins: {
		standby: number,
		dir: number,
		cdir: number,
		pwm: number,
	},
}

type VolumeControlFunctions = {
	goUp: (params: any) => void,
	goDown: (params: any) => void,
	stop: () => void,
}

export const initVolumeControl = (params: VolumeControlConfig): VolumeControlFunctions => {

	const { pins } = params

	const standbyPin = new Pin({
		pin: pins.standby,
		type: "digital",
	})

	// Pin doesn't do pwm 😒
	const pwmPin = new Led(pins.pwm)

	const dirPin = new Pin({
		pin: pins.dir,
		type: "digital",
	})

	const cdirPin = new Pin({
		pin: pins.cdir,
		type: "digital",
	})

	let motorIsOn: boolean = false

	const startMotor = (direction: boolean, speed: number = 255) => {
		// tslint:disable-next-line:no-console
		console.log(`motorized volume control going ${direction ? "up" : "down"}`)
		motorIsOn = true
		pwmPin.brightness(speed)
		direction
			? dirPin.high()
			: dirPin.low()
		direction
			? cdirPin.low()
			: cdirPin.high()
		standbyPin.high()
	}

	const stopMotor = (): void => {
		// tslint:disable-next-line:no-console
		console.log(`motorized volume control stopping`)
		standbyPin.low()
		pwmPin.off()
		dirPin.low()
		cdirPin.low()
		motorIsOn = false
	}

	const resetStopTimer = resettableTimeout(stopMotor, 100)

	const goUp = (): void => {
		!motorIsOn && startMotor(true)
		resetStopTimer()
	}

	const goDown = (): void => {
		!motorIsOn && startMotor(false)
		resetStopTimer()
	}

	return {
		goUp,
		goDown,
		stop: stopMotor,
	}

}
