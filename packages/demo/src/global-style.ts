import {createGlobalStyle} from "styled-components";

export const GlobalStyle = createGlobalStyle`
	body {
		margin: 0;
		font-family: sans-serif;
		background: #eee;
		color: hsla(0, 0%, 0%, 0.8);
	}
	*,
	*::before,
	*::after {
		box-sizing: border-box;
	}
`;
