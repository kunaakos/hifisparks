import React from "react"
import styled, { css } from "styled-components"

import { SimpleButtonProps } from "./"

export const SimpleButton = styled.div<SimpleButtonProps>`
	user-select: none;
	background-color: ${({active}) => active ? "green" : "#777"};
	margin: 5px;
	padding: 10px;
	text-align: center;
	border-radius: 5px;
	color: white;
	font-family: sans-serif;
`
