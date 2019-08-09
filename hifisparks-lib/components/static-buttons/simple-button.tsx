import React from "react"
import styled from "styled-components"

import { SimpleButtonProps } from "./"

export const SimpleButton = styled.div<SimpleButtonProps>`
	text-transform: lowercase;
	font-size: ${({ theme }) => theme.fontSize.primary};
	padding: 0.4rem 1rem 0 3rem;
	margin-bottom: 0.7rem;
	margin-right: 0.4rem;
	transform: translate3d(0, 0, 0);
	background-color: ${({ theme }) => theme.color.secondary};
	color: ${({ theme }) => theme.color.primary};
	transition: all 50ms linear;

	&.active {
		box-shadow: 0 0 0 0;
		transform: translate3d(5px, 5px, 0);
	}
	&:not(.active) {
		box-shadow: 5px 5px 0 0;
		transform: translate3d(0, 0, 0);
	}
`
