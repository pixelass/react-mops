import {createGlobalStyle, css} from "styled-components";
import {rotationClasses, rotationCursors, resizeClasses, resizeCursors} from "react-mops";

export const GlobalStyle = createGlobalStyle`
	body {
		margin: 0;
		background: none;
		font-family: sans-serif;

		*,
		*::before,
		*::after {
			box-sizing: border-box;
		}

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
`;
