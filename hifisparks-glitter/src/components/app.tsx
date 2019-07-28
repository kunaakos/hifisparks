import React, { useEffect, useRef, useState } from "react"
import styled from "styled-components"

import { InputSelectorState } from "hifisparks-lib/types/controls"

import socketIoClient from "socket.io-client"

import { ClientSocket } from "hifisparks-lib/types/events"

import { PushButton } from "hifisparks-lib/components/push-button"
import { SimpleButton } from "hifisparks-lib/components/static-buttons"
import { withHapticFeedback } from "hifisparks-lib/utils/misc"

const ButtonsContainer = styled.div`
	display: flex;
	flex-direction: column;
	max-width: 320px;
	margin: auto;
	margin-top: 10px;
	margin-bottom: 10px;
`

export const App = () => {

	const [inputSelectorState, setInputSelectorState]: [
		InputSelectorState | void,
		(newState: InputSelectorState | void) => void
	] = useState(null)

	const socket: { current: ClientSocket | null } = useRef(null)

	const dispatchSetActiveInput = withHapticFeedback(
		[20, 20, 20],
		(id: string) => socket.current && socket.current.emit("setInput", id),
	)
	const dispatchVolumeUp = () => socket.current && socket.current.emit("volumeUp")
	const volumeDown = () => socket.current && socket.current.emit("volumeDown")

	const disconnectHandler = () => { setInputSelectorState(null) }

	useEffect(() => {

		// @ts-ignore
		socket.current = socketIoClient("http://localhost:9999", { transports: ["websocket"] })
		socket.current.on("inputSelectorStateChanged", setInputSelectorState)
		// @ts-ignore
		socket.current.on("connect_error", disconnectHandler)
		// @ts-ignore
		socket.current.on("error", disconnectHandler)
		// @ts-ignore
		socket.current.on("disconnected", disconnectHandler)
		// TODO: destroy socket when cleaning up
	}, [])

	return inputSelectorState
		? <div>
			<ButtonsContainer>
			{
				inputSelectorState.inputs.map(({id, label}: any) => {
					const isSelected = inputSelectorState.active === id
					return (
						<SimpleButton
							key={id}
							onClick={() => !isSelected && dispatchSetActiveInput(id)}
							active={isSelected}
						>
							{label}
						</SimpleButton>
					)
				})
			}
			</ButtonsContainer>
			<ButtonsContainer>

				<PushButton
					wrapper={SimpleButton}
					onPushed={dispatchVolumeUp}
					whilePushed={dispatchVolumeUp}
					delay={90}
					hapticFeedbackPattern={[30]}
				>
					Volume Up
				</PushButton>

				<PushButton
					wrapper={SimpleButton}
					onPushed={volumeDown}
					whilePushed={volumeDown}
					delay={90}
					hapticFeedbackPattern={[30]}
				>
					Volume Down
				</PushButton>

			</ButtonsContainer>
		</div>
		: <div>not connected</div>
}
