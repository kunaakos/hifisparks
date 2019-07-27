import { Event } from "hifisparks-lib/config/events"

import http from "http"
import five from "johnny-five"
import socketio from "socket.io"

import { initInputSelector } from "./input-selector"
import { initVolumeControl } from "./volume-control"

const HTTP_PORT = 9999

const VOLUME_CONTROL_PINS = {
	standby: 8,
	dir: 10,
	cdir: 9,
	pwm: 11,
}

const INPUT_CONFIGS = [
	{ name: "TV", pin: 2 },
	{ name: "Bluetooth", pin: 3 },
	{ name: "Stream", pin: 4 },
	{ name: "AUX", pin: 5 },
]

const connectionHandler = (params: any) => (socket: socketio.Socket) => {

	// tslint:disable-next-line:no-console
	console.log("a user connected, instantiating connection handler")

	const {
		io,
		functions: {
			goUp,
			goDown,
			setActiveInput,
			getInputStates,
		},
	} = params

	const broadcastInputStates = (inputStates: any) => {
		// tslint:disable-next-line:no-console
		console.log(`broadcasting input states: ${JSON.stringify(inputStates)}`)
		io.emit(Event.inputsChanged, { inputStates })
	}

	broadcastInputStates(getInputStates())

	socket.on(Event.setActiveInput, ({ name }: any) => {
		// tslint:disable-next-line:no-console
		console.log(`setting active input to ${name}`)
		setActiveInput({ name })
		broadcastInputStates(getInputStates())
	})

	socket.on(Event.volumeUp, () => {
		// tslint:disable-next-line:no-console
		console.log(`turning volume up...`)
		goUp()
	})

	socket.on(Event.volumeDown, () => {
		// tslint:disable-next-line:no-console
		console.log(`turning volume down...`)
		goDown()
	})

	// tslint:disable-next-line:no-console
	socket.on("disconnect", () => console.log("a user disconnected."))

}

const initApplication = () => {

	const io = socketio(
		http
			.createServer()
			.listen(
				HTTP_PORT,
				// tslint:disable-next-line:no-console
				() => console.log(`App listening on port ${HTTP_PORT}!`),
			),
	)

	// tslint:disable-next-line:no-console
	console.log("initializing volume control")
	const volumeControlFunctions = initVolumeControl({
		pins: VOLUME_CONTROL_PINS,
	})

	// tslint:disable-next-line:no-console
	console.log("initializing input selector")
	const inputSelectorFunctions = initInputSelector({
		inputConfigs: INPUT_CONFIGS,
	})

	// tslint:disable-next-line:no-console
	console.log("initializing socket.io connection handler")
	const connectionHandlerInstance = connectionHandler({
		io,
		functions: {
			...volumeControlFunctions,
			...inputSelectorFunctions,
		},
	})

	io.on("connection", connectionHandlerInstance)
}

const board = new five.Board({ repl: false })

// @ts-ignore - typedefs need to be updated
// tslint:disable-next-line:no-console
board.on("error", (error: any) => console.log(error))
board.on(
	"ready",
	initApplication,
)
