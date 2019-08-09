export { defaultTheme } from "./default-theme"

export type Theme = {
	color: {
		background: string,
		primary: string,
		secondary: string,
	},
	fontSize: {
		title: string,
		primary: string,
		secondary: string,
		body: string,
	},
}
