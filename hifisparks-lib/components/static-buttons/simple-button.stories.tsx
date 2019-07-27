import * as React from "react"

import { action } from "@storybook/addon-actions"
import { boolean, select, text, withKnobs } from "@storybook/addon-knobs/react"
import { storiesOf } from "@storybook/react"

import { SimpleButton } from "./"

storiesOf("components/static-buttons", module)
	.addDecorator(withKnobs)
	.add(
		"SimpleButton",
		() => (
			<SimpleButton
				active={boolean("active", false)}
				onClick={action("Button Clicked")}
			>
				{text("label", "Such Button")}
			</SimpleButton>
		),
	)
