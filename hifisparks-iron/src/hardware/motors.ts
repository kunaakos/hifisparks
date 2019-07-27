import {
	IMotor,
	MotorConfig,
	Tb6612fngMotorDriverConfig,
} from "hifisparks-lib/types/hardware"

import {
	createDigitalPin,
	createPwmPin,
} from "./pins"

const createTb6612fngMotor = (driver: Tb6612fngMotorDriverConfig): IMotor => {

	const standbyPin = createDigitalPin({ pinNr: driver.pins.standby })
	const dirPin = createDigitalPin({ pinNr: driver.pins.dir })
	const cdirPin = createDigitalPin({ pinNr: driver.pins.cdir })
	const pwmPin = createPwmPin({ pinNr: driver.pins.pwm })

	let motorIsOn: boolean = false

	const startMotor = (forward: boolean) => (speed: number = 255) => {
		motorIsOn = true
		pwmPin.on(speed)
		forward
			? dirPin.on()
			: dirPin.off()
		forward
			? cdirPin.off()
			: cdirPin.on()
		standbyPin.on()
	}

	const stopMotor = (): void => {
		standbyPin.off()
		pwmPin.off()
		dirPin.off()
		cdirPin.off()
		motorIsOn = false
	}

	return {
		forward: startMotor(true),
		reverse: startMotor(false),
		stop: () => stopMotor(),
		isOn: () => motorIsOn,
	}
}

export const createMotor = (config: MotorConfig): IMotor => {
	switch (config.driver.type) {
		case "TB6612FNG":
			return createTb6612fngMotor(config.driver)
		default:
			throw new Error("Unsupported motor driver.")
	}
}
