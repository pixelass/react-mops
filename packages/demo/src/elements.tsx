import styled, {css} from "styled-components";
import {containerSize} from "./constants";

export const Wrapper = styled.div`
	position: relative;
	margin: 10px auto;
	padding: 10px;
	border-radius: 2px;
	box-shadow: 0 0 0 1px hsla(0, 0%, 0%, 0.5);;
	width: ${containerSize.width + 40}px;

`;
export const Examples = styled.div`
	position: relative;
	display: flex;
	flex-wrap: wrap;
`;
export const Example = styled.div`
	position: relative;
	margin: auto;
`;
export const Headline = styled.h2`
	margin: 0;
	font-size: 2em;
	font-weight: lighter;
		color:  hsla(0, 0%, 0%, 0.5);
	&:first-letter {
		font-weight: bolder;
		color:  hsla(0, 0%, 0%, 0.8);
	}
`;

export const SubHeadline = styled.h3`
	margin: 0;
	font-size: 1.5em;
	font-weight: lighter;
		color:  hsla(0, 0%, 0%, 0.8);
`;

export const Title = styled.h1`
	margin: 0;
	font-size: 3em;
	font-weight: bolder;
		color:  hsla(0, 0%, 0%, 0.8);
`;
export const Container = styled.div<{ withGrid?: { x: number; y: number }; hasBounds?: boolean }>`
	--line-width: 1px;
	--line-color: rgba(0, 0, 0, 0.2);
	margin: 50px 20px;
	position: relative;
	height: ${containerSize.height}px;
	width: ${containerSize.width}px;
	background: white;
	box-shadow: 0 3px 5px rgba(0, 0, 0, 0.2), 0 7px 14px rgba(0, 0, 0, 0.5);
	border-radius: 3px;
	${({withGrid}) =>
	withGrid &&
	css`
			&::before {
				content: "";
				position: absolute;
				top: 0;
				right: 0;
				bottom: 0;
				left: 0;
				background-image: linear-gradient(
						0deg,
						var(--line-color) var(--line-width),
						transparent var(--line-width)
					),
					linear-gradient(
						90deg,
						var(--line-color) var(--line-width),
						transparent var(--line-width)
					);
				background-repeat: repeat;
				background-position: calc(var(--line-width) / -2) calc(var(--line-width) / 2);
				background-size: ${withGrid.x}px ${withGrid.y}px;
			}
		`}
`;
export const Inner = styled.div`
	background: hsl(340, 100%, 60%);
	height: 100%;
	width: 100%;
	border-radius: 2px;
	// border: 1px solid hsl(340, 100%, 30%);
`;
export const StyledMarker = styled.span`
	position: absolute;
	top: 50%;
	left: 50%;
	height: 80%;
	width: 80%;
	transform: translate(-50%, -50%);
	border: 3px solid white;
	background: hsl(180, 100%, 20%);
	pointer-events: none;
`;
export const InvisibleMarker = styled.span`
	position: absolute;
	pointer-events: none;
	top: 0;
	left: 0;
	height: 0;
	width: 0;
`;
export const StyledBox = styled.div`
	filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.7));
`;
export const StyledImage = styled.img`
	height: 100%;
	width: 100%;
`;
export const Button = styled.button<{ isActive?: boolean }>`
	position: relative;
	padding: 0.25rem 1rem;
	border: 0;
	border-radius: 3px;
	margin: 0.25rem;
	color: black;
	font-size: 1em;
	font-weight: lighter;
	${({isActive}) => css`
		background: ${isActive ? "hsl(220, 80%, 40%)" : "#fff"};
		color:  ${isActive ? "#fff" : "#000"};
		&:hover {
			background: ${isActive ? "hsl(220, 80%, 20%)" : "#ddd"};
		}
	`}
	&:focus {
		z-index: 1;
	}
`;

export const ButtonWrapper = styled.div`
	display: flex;
	margin: 0.25rem;
	
	${Button} {
		border-radius: 0;
		margin: 0;
		box-shadow: inset 1px 0 0 rgba(0,0,0,0.5);
		
		&:first-child {
			border-radius: 3px 0 0 3px;
			box-shadow: none;
		}
		&:last-child {
			border-radius: 0 3px 3px 0;
		}
	}
`;
