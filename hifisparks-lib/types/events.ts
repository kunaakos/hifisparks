import StrictEventEmitter from "strict-event-emitter-types"

import { InputSelectorState } from "./controls"

interface IClientEvents {
	setInput: (id: string) => void,
	volumeUp: () => void,
	volumeDown: () => void,
}

interface IServerEvents {
	inputSelectorStateChanged: (newState: InputSelectorState) => void,
}

export type ClientSocket = StrictEventEmitter<SocketIOClient.Socket, IServerEvents, IClientEvents>
export type ServerSocket = StrictEventEmitter<SocketIO.Socket, IClientEvents, IServerEvents>
