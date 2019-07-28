import { Event } from "hifisparks-lib/config/events"

import http from "http"
import five from "johnny-five"
import socketio from "socket.io"

import {
	IInputSelector,
	IMotorizedPotentiometer,
	InputSelectorState,
} from "hifisparks-lib/types/controls"

import { createInputSelector } from "./controls/input-selector"
import { createMotorizedPotentiometer } from "./controls/motorized-potentiometer"
import { createButton } from "./hardware/button"
import { createRotaryEncoder } from "./hardware/rotary-encoder"

const connectionHandler = ({
	io,
	controls,
}: {
	io: socketio.Server,
	controls: [IInputSelector, IMotorizedPotentiometer],
}) => (socket: socketio.Socket) => {

	const [inputSelector, volumeControl] = controls

	// tslint:disable-next-line:no-console
	console.log("a user connected, instantiating connection handler")

	const broadcastInputStates = (state: InputSelectorState) => {
		// tslint:disable-next-line:no-console
		console.log(`broadcasting input states: ${JSON.stringify(state)}`)
		io.emit(Event.inputsChanged, { state })
	}

	broadcastInputStates(inputSelector.getState())
	inputSelector.events.on("stateChange", broadcastInputStates)

	socket.on(Event.setActiveInput, ({ id }: any) => {
		inputSelector.set(id)
	})

	socket.on(Event.volumeUp, () => {
		// tslint:disable-next-line:no-console
		console.log(`turning volume up...`)
		volumeControl.up()
	})

	socket.on(Event.volumeDown, () => {
		// tslint:disable-next-line:no-console
		console.log(`turning volume down...`)
		volumeControl.down()
	})

	// tslint:disable-next-line:no-console
	socket.on("disconnect", () => console.log("a user disconnected."))

}

const initApplication = ({ httpPort }: { httpPort: number }) => () => {

	const io = socketio(
		http
			.createServer()
			.listen(
				httpPort,
				// tslint:disable-next-line:no-console
				() => console.log(`App listening on port ${httpPort}!`),
			),
	)

	// tslint:disable-next-line:no-console
	console.log("initializing input selector")

	const inputSelector = createInputSelector({
		type: "InputSelector",
		id: "IS_MAIN",
		label: "input selector",
		inputs: [
			{ id: "IS_MAIN__INP0", label: "TV", pinNr: 3 },
			{ id: "IS_MAIN__INP1", label: "Bluetooth", pinNr: 4 },
			{ id: "IS_MAIN__INP2", label: "Stream", pinNr: 5 },
			{ id: "IS_MAIN__INP3", label: "AUX", pinNr: 6 },
		],
		active: "IS_MAIN__INP0",
	})

	// tslint:disable-next-line:no-console
	console.log("initializing volume control")

	const volumeControl = createMotorizedPotentiometer({
		type: "MotorizedPotentiometer",
		id: "MP_VOLUME",
		label: "volume control knob",
		driver: {
			type: "TB6612FNG",
			pins: {
				standby: 8,
				dir: 9,
				cdir: 10,
				pwm: 11,
			},
		},
	})

	// tslint:disable-next-line:no-console
	console.log("initializing rotary dial")
	const rotaryDial = createRotaryEncoder({
		pins: {
			a: { pinNr: 14, internalResistor: "pullUp" },
			b: { pinNr: 15, internalResistor: "pullUp" },
		},
	})
	const rotaryDialButton = createButton({pinNr: 16, internalResistor: "pullUp", debounceMs: 100 })

	// tslint:disable-next-line:no-console
	rotaryDial.on("clockwiseClick", inputSelector.next)
	// tslint:disable-next-line:no-console
	rotaryDial.on("counterclockwiseClick", inputSelector.prev)
	// tslint:disable-next-line:no-console
	rotaryDialButton.on("pressed", () => { console.log("rotary dial pressed")})

	// tslint:disable-next-line:no-console
	console.log("initializing socket.io connection handler")
	const connectionHandlerInstance = connectionHandler({
		io,
		controls: [
			inputSelector,
			volumeControl,
		],
	})

	io.on("connection", connectionHandlerInstance)
}

const board = new five.Board({ repl: false })

// @ts-ignore - typedefs need to be updated
// tslint:disable-next-line:no-console
board.on("error", (error: any) => console.log(error))
board.on(
	"ready",
	initApplication({ httpPort: 9999 }),
)
