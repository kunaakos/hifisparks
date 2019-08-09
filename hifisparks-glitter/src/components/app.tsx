import React, { useEffect, useRef, useState } from "react"
import { createGlobalStyle, ThemeProvider } from "styled-components"

import socketIoClient from "socket.io-client"

import { InputSelectorState } from "hifisparks-lib/types/controls"
import { ClientSocket } from "hifisparks-lib/types/events"

import { defaultTheme } from "hifisparks-lib/themes/"

import {
	MainContainer,
	Paragraph,
	ScrollContainer,
	Title,
} from "./elements"

import { InputSelector } from "./input-selector"
import { VolumeControl } from "./volume-control"

const GlobalStyles = createGlobalStyle`
  * {
    font-family: 'Poppins', sans-serif;
    box-sizing: border-box;
	user-select: none;
  }
  body, html {
	min-width: 320px;
	background: ${({ theme }) =>
		// @ts-ignore
		theme.color.background
	};
    margin: 0;
	@media only screen and (max-width: 600px) {
		font-size: 14px;
	}
  }
`
export const App = () => {

	const [inputSelectorState, setInputSelectorState]: [
		InputSelectorState | void,
		(newState: InputSelectorState | void) => void
	] = useState(null)

	const setActiveInput = useRef((id: string): void => undefined)
	const volumeUp = useRef(() => undefined)
	const volumeDown = useRef(() => undefined)

	const disconnectHandler = () => { setInputSelectorState(null) }

	useEffect(() => {
		// @ts-ignore - TODO: figure out what's up here
		const socket: ClientSocket = socketIoClient("http://localhost:9999", { transports: ["websocket"] })

		setActiveInput.current = (id: string) => { socket.emit("setInput", id) }
		volumeUp.current = () => { socket.emit("volumeUp") }
		volumeDown.current = () => { socket.emit("volumeDown") }

		socket.on("inputSelectorStateChanged", setInputSelectorState)
		// @ts-ignore
		socket.on("connect_error", (disconnectHandler))
		// @ts-ignore
		socket.on("error", disconnectHandler)
		// @ts-ignore
		socket.on("disconnected", disconnectHandler)
		// TODO: destroy socket when cleaning up
	}, [])

	return <ThemeProvider theme={defaultTheme}>
		<React.Fragment>
			<GlobalStyles />
			{inputSelectorState

				? <MainContainer>
					<Title>HIFI ✨</Title>
					<ScrollContainer>
						<InputSelector
							inputs={inputSelectorState.inputs}
							active={inputSelectorState.active}
							dispatchSetActiveInput={setActiveInput.current}
						/>
						<VolumeControl
							dispatchVolumeUp={volumeUp.current}
							dispatchVolumeDown={volumeDown.current}
						/>
					</ScrollContainer>
				</MainContainer>

				: <MainContainer>
					<Title>HIFI ✨</Title>
					<Paragraph>...connecting to iron</Paragraph>
				</MainContainer>

			}
		</React.Fragment>
	</ThemeProvider>
}
