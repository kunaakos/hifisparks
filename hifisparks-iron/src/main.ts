import http from "http"
import five from "johnny-five"
import socketio from "socket.io"

import {
	IInputSelector,
	IMotorizedPotentiometer,
	InputSelectorState,
} from "hifisparks-lib/types/controls"

import { ServerSocket } from "hifisparks-lib/types/events"

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
}) => (socket: ServerSocket) => {

	// tslint:disable-next-line:no-console
	console.log("A user connected.")
	// @ts-ignore
	// tslint:disable-next-line:no-console
	socket.on("disconnect", () => { console.log("a user disconnected.") })

	const [inputSelector, volumeControl] = controls

	const broadcastInputStates = (state: InputSelectorState) => {
		io.emit("inputSelectorStateChanged", state)
	}

	inputSelector.events.on("stateChange", broadcastInputStates)

	socket.on("setInput", inputSelector.set)
	socket.on("volumeUp", volumeControl.up)
	socket.on("volumeDown", volumeControl.down)

	broadcastInputStates(inputSelector.getState())
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

	const rotaryDial = createRotaryEncoder({
		pins: {
			a: { pinNr: 14, internalResistor: "pullUp" },
			b: { pinNr: 15, internalResistor: "pullUp" },
		},
	})

	rotaryDial.on("clockwiseClick", inputSelector.next)
	rotaryDial.on("counterclockwiseClick", inputSelector.prev)

	const rotaryDialButton = createButton({pinNr: 16, internalResistor: "pullUp", debounceMs: 100 })
	// tslint:disable-next-line:no-console
	rotaryDialButton.on("pressed", () => { console.log("rotary dial pressed")})

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
