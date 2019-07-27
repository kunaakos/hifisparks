export interface IDigitalPin {
	on: () => void,
	off: () => void,
}

export interface IPwmPin {
	on: (value: number) => void,
	off: () => void,
}

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
