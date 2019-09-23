import {resizeClasses, resizeCursors, rotationClasses, rotationCursors} from "react-mops";
import {createGlobalStyle, css} from "styled-components";

export const GlobalStyle = createGlobalStyle`
	body {
		margin: 0;
		font-family: sans-serif;
		background-image: 
			linear-gradient(-45deg, hsla(200, 100%, 30%, 0.5), hsla(50, 100%, 70%, 0.5)),
			linear-gradient(45deg, hsla(0, 100%, 30%, 0.5), hsla(150, 100%, 70%, 0.5)),
			linear-gradient(90deg, hsla(100, 100%, 30%), hsla(250, 100%, 70%));
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
