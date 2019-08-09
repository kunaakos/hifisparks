import * as React from "react"
import { createGlobalStyle, ThemeProvider } from "styled-components"

import { defaultTheme } from "../../themes"

const GlobalStyles = createGlobalStyle`
  * {
    font-family: 'Poppins', sans-serif;
    box-sizing: border-box;
	user-select: none;
  }
  h1, h2, h3, h4, h5 {
	color: ${({ theme }) =>
		// @ts-ignore
		theme.color.secondary
	};
  }
  p {
	color: ${({ theme }) =>
		// @ts-ignore
		theme.color.primary
	};
  }
  body, html {
	min-width: 320px;
	background: ${({ theme }) =>
		// @ts-ignore
		theme.color.background
	};
  }
`

export const StoryWrapper: React.SFC<{}> = ({ children }) => {

	return (
		<ThemeProvider theme={defaultTheme}>
			<>
				<GlobalStyles/>
				{children}
			</>
		</ThemeProvider>
	)
}
