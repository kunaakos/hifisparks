import React, { useEffect, useRef, useState } from "react"
import styled from "styled-components"

import { InputSelectorState } from "hifisparks-lib/types/controls"

import socketIoClient from "socket.io-client"

import { Event } from "hifisparks-lib/config/events"

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
	const socket = useRef(null)

	const dispatchSetActiveInput = withHapticFeedback(
		[20, 20, 20],
		(id: string) => socket.current && socket.current.emit(Event.setActiveInput, { id }),
	)
	const dispatchVolumeUp = () => socket.current && socket.current.emit(Event.volumeUp)
	const volumeDown = () => socket.current && socket.current.emit(Event.volumeDown)

	const disconnectHandler = (err: any) => {
		// tslint:disable-next-line:no-console
		err && console.error(err)
		setInputSelectorState(null)
	}

	useEffect(() => {
		socket.current = socketIoClient("http://localhost:9999", {
			transports: ["websocket"],
		})
		socket.current.on(
			Event.inputsChanged ,
			({ state }: { state: InputSelectorState }) => setInputSelectorState(state))
		socket.current.on("connect_error", disconnectHandler)
		socket.current.on("error", disconnectHandler)
		socket.current.on("disconnect", disconnectHandler)
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
