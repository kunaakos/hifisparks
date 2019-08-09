import styled from "styled-components"

import { SimpleButton } from "hifisparks-lib/components/static-buttons"

export const MainContainer = styled.div`
	width: 100vw;
	max-height: 100vh;
	@media only screen and (max-width: 599px) {
		padding: 1rem 0 1rem 3rem;
	}
	@media only screen and (min-width: 600px) {
		padding: 6rem 0 2rem 2rem;
	}
	max-width: 800px;
	margin: auto 0 0 auto;
`

export const ScrollContainer = styled.div`
	height: 100%;
	overflow-y: auto;
`

export const Title = styled.div`
	text-transform: uppercase;
	color: ${({ theme }) => theme.color.primary};
	font-size: ${({ theme }) => theme.fontSize.title};
	font-weight: bold;
	border-bottom: 0.2rem solid ${({ theme }) => theme.color.secondary};
	margin-bottom: 0.3rem;
	user-select: none;
`

export const Subtitle = styled.div`
	text-transform: uppercase;
	color: ${({ theme }) => theme.color.primary};
	font-size: ${({ theme }) => theme.fontSize.primary};
	font-weight: bold;
	margin-bottom: 0.3rem;
`

export const Paragraph = styled.p`
	color: ${({ theme }) => theme.color.primary};
	font-size: ${({ theme }) => theme.fontSize.body};
	margin: 0;
`

const ButtonContainer = styled.div`
	max-width: 480px;
	@media only screen and (max-width: 599px) {
		margin-right: 2rem;
	}
	@media only screen and (min-width: 600px) {
		margin-right: 15vw;
	}
	display: flex;
`

export const VerticalButtonsContainer = styled(ButtonContainer)`
	flex-direction: column;
	margin-top: 1rem;
	margin-bottom: 1rem;
`

export const HorizontalButtonsContainer = styled(ButtonContainer)`
	flex-direction: row;
	justify-content: space-between;
	/* margin-top: 1rem; */
	margin-bottom: 1rem;
	${SimpleButton} {
		padding-top: 1.5rem;
		flex-grow: 1;
		flex-shrink: 1;
		flex-basis: 0;
		text-align: right;
	}

	${SimpleButton} + ${SimpleButton} {
		margin-left: 1rem;
	}

`
