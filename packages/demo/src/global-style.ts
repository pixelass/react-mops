import {resizeClasses, resizeCursors, rotationClasses, rotationCursors} from "react-mops";
import {createGlobalStyle, css} from "styled-components";

export const GlobalStyle = createGlobalStyle`
	body {
		margin: 0;
		font-family: sans-serif;
		background: #eee;
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
