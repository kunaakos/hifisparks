import * as React from "react"

import { action } from "@storybook/addon-actions"
import { boolean, select, text, withKnobs } from "@storybook/addon-knobs/react"
import { storiesOf } from "@storybook/react"

import { StoryWrapper } from "../storybook"

import { SimpleButton } from "./"

storiesOf("components/static-buttons", module)
	.addDecorator(withKnobs)
	.add(
		"SimpleButton",
		() => (
			<StoryWrapper>
				<h3>The simplest of buttons.</h3>
				<p>It's themed, and active if an '.active' css class is added to it.</p>
				<p>Active/inactive state transitions are animated.</p>
				<p>Styled-component, can be used as a wrapper.</p>
				<SimpleButton
					className={boolean("active", false) ? "active" : null}
					onClick={action("Button Clicked")}
				>
					{text("label", "Such Button")}
				</SimpleButton>
			</StoryWrapper>
		),
	)
