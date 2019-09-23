import {resizeClasses, resizeCursors, rotationClasses, rotationCursors} from "react-mops";
import {createGlobalStyle, css} from "styled-components";

export const GlobalStyle = createGlobalStyle`
	body {
		margin: 0;
		font-family: sans-serif;
		background-image: 
			linear-gradient(-65deg, hsla(200, 100%, 70%, 0.75), hsla(50, 100%, 90%, 0.25)),
			linear-gradient(65deg, hsla(0, 100%, 70%, 0.75), hsla(150, 100%, 90%, 0.25)),
			linear-gradient(45deg, hsla(100, 100%, 50%), hsla(250, 100%, 50%));
		background-attachment: fixed;
		background-size: 100vw 100vh;
		color:  hsla(0, 0%, 0%, 0.8);

		${rotationClasses.map(
			(c, i) => css`
				&.${c} * {
					cursor: -webkit-image-set(
								url(${rotationCursors[i]["1x"]}) 1x,
								url(${rotationCursors[i]["2x"]}) 2x
							)
							9 9,
						auto !important;
				}
			`
		)}

		${resizeClasses.map(
			(c, i) => css`
				&.${c} * {
					cursor: ${resizeCursors[i]} !important;
				}
			`
		)}
	}

	*,
	*::before,
	*::after {
		box-sizing: border-box;
	}

`;
