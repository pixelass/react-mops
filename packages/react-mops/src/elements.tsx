import styled, {css} from "styled-components";
import React from "react";
import {resizeCursors, rotationCursors} from "./cursors";

const HandleBase: React.ForwardRefExoticComponent<{
	metaKey?: boolean;
	cursorSlice: number;
	style?: React.CSSProperties;
}> = React.forwardRef(({children, style, ...props}, ref: React.Ref<HTMLAnchorElement>) => {
	const rotationSlice = rotationCursors[props.cursorSlice];
	const resizeSlice = resizeCursors[props.cursorSlice % resizeCursors.length];
	const componentStyle: React.CSSProperties = {
		...style,
		position: "absolute",
		zIndex: 2,
		cursor: props.metaKey
			? `-webkit-image-set(url("${rotationSlice["1x"]}") 1x, url("${rotationSlice["2x"]}") 2x) 9 9, default;`
			: resizeSlice
	};
	return (
		<a {...props} href="#" ref={ref} style={componentStyle}>
			{children}
		</a>
	);
});

const Handle = styled.a.attrs(() => ({
	href: "#",
	onClick: (e: React.MouseEvent<HTMLAnchorElement>) => {
		e.preventDefault();
	}
}))<{metaKey?: boolean; cursorSlice: number; isResizable?: boolean; isRotatable?: boolean;}>`
	position: absolute;
	z-index: 2;
	cursor: ${props => {
		const rotationSlice = rotationCursors[props.cursorSlice];
		const resizeSlice = resizeCursors[props.cursorSlice % resizeCursors.length];
		return props.metaKey
			? props.isRotatable ? `-webkit-image-set(url("${rotationSlice["1x"]}") 1x, url("${rotationSlice["2x"]}") 2x) 9 9, default;` : "default"
			: props.isResizable ? resizeSlice : "default";
	}};
	&::before {
		content: "";
		position: absolute;
		top: 50%;
		left: 50%;
		height: 5px;
		width: 5px;
		transform: translate(-50%, -50%);
		background: white;
		box-shadow: 0 0 0 1px black;
		pointer-events: none;
	}
`;
export const HandleTop = styled(Handle)`
	top: -10px;
	left: 50%;
	margin-left: -10px;
	width: 20px;
	height: 20px;
`;
export const HandleRight = styled(Handle)`
	right: -10px;
	top: 50%;
	margin-top: -10px;
	width: 20px;
	height: 20px;
`;
export const HandleLeft = styled(Handle)`
	left: -10px;
	top: 50%;
	margin-top: -10px;
	width: 20px;
	height: 20px;
`;
export const HandleBottom = styled(Handle)`
	bottom: -10px;
	left: 50%;
	margin-left: -10px;
	width: 20px;
	height: 20px;
`;
export const HandleTopLeft = styled(Handle)`
	top: -10px;
	left: -10px;
	height: 20px;
	width: 20px;
`;
export const HandleTopRight = styled(Handle)`
	top: -10px;
	right: -10px;
	height: 20px;
	width: 20px;
`;
export const HandleBottomLeft = styled(Handle)`
	bottom: -10px;
	left: -10px;
	height: 20px;
	width: 20px;
`;
export const HandleBottomRight = styled(Handle)`
	bottom: -10px;
	right: -10px;
	height: 20px;
	width: 20px;
`;
export const Handles = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	${Handle} {
		visibility: visible;
	}
`;
export const Wrapper = styled.div<{draggable?: boolean; resizable?: boolean; isDown?: boolean}>`
	z-index: ${({isDown}) => (isDown ? 1 : "initial")};
	position: absolute;
	top: 0;
	left: 0;
	display: inline-flex;
	vertical-align: top;
	box-shadow: 0 0 0 1px hsla(200, 100%, 25%, 0.75);
`;
export const Content = styled.div`
	flex: 1;
	z-index: 1;
	overflow: hidden;
	max-width: 100%;
	max-height: 100%;
	${props =>
		props.onMouseDown &&
		css`
			cursor: move;
		`};
`;
