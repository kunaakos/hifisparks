import {
	createMotor,
} from "../hardware/motors"

import {
	IMotorizedPotentiometer,
	MotorizedPotentiometerConfig,
} from "hifisparks-lib/types/controls"

import { resettableTimeout } from "hifisparks-lib/utils/misc"

export const createMotorizedPotentiometer = (config: MotorizedPotentiometerConfig): IMotorizedPotentiometer => {

	const motor = createMotor({ driver: config.driver })
	const resetStopTimer = resettableTimeout(motor.stop, 100)

	const up = (speed: number): void => {
		!motor.isOn() && motor.forward(speed)
		resetStopTimer()
	}

	const down = (speed: number): void => {
		!motor.isOn() && motor.reverse(speed)
		resetStopTimer()
	}

	return {
		type: "MotorizedPotentiometer",
		id: config.id,
		label: config.label,
		up,
		down,
		stop: motor.stop,
	}

}
