import { Pin } from "johnny-five"

type InputState = {
	name: string,
	pin: any,
	isSelected: boolean,
}

type InputStates = { [name: string]: InputState }

type InputConfig = {
	name: string,
	pin: number,
}

type InputSelectorConfig = {
	inputConfigs: Array<InputConfig>,
}

export const initInputSelector = (params: InputSelectorConfig) => {

	const { inputConfigs } = params

	const inputStates = // MUTABLE
		inputConfigs
			.reduce<InputStates>((inputStatesAcc, inputConfig, index) => {
				inputStatesAcc[inputConfig.name] = {
					name: inputConfig.name,
					pin: new Pin({
						pin: inputConfig.pin,
						type: "digital",
					}),
					isSelected: index === 0,
				}
				return inputStatesAcc
			}, {})

	// tslint:disable-next-line:no-shadowed-variable
	const setActiveInput = (params: any): void => {

		const { name: nextInputName } = params

		/*
			TypeScript weirdness: Object.prototype.find() can return undefined, and
			the below code is not typesafe as a result
		*/
		const currentInputName = Object.values(inputStates)
			.find(inputState => inputState.isSelected === true)
			.name

		if (!inputStates[nextInputName]) {
			return
		} else {
			/*
				WARNING:
				These are async operations and should be implemented as such
				to avoid having multiple inputs active at the same time,
				BECAUSE THAT COULD BLOW YOUR SPEAKERS, for example...
				And don't forget that this is messy side effect-ey code,
				so TREAD LIGHTLY.

				TODO: that^
			*/

			inputStates[currentInputName].isSelected = false
			inputStates[currentInputName].pin.low()
			inputStates[nextInputName].isSelected = true
			inputStates[nextInputName].pin.high()
		}
	}

	const getInputStates = (): any => {
		return Object.values(inputStates)
			.map(({name, isSelected }) => ({ name, isSelected }))
	}

	return {
		setActiveInput,
		getInputStates,
	}
}
