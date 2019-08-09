
import React from "react"

export type PushButtonProps = {
	wrapper: React.ElementType
	children: React.ReactNode
	onPushed?: () => void,
	onReleased?: () => void
	whilePushed?: () => void,
	delay: number,
}

export { PushButton } from "./push-button"
