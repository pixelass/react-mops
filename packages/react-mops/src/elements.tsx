import React from "react";
import {resizeCursors, rotationCursors} from "./cursors";

interface HandleProps {
	cursorSlice: number;
	metaKey?: boolean;
	ref?: React.Ref<HTMLAnchorElement>;
	children?: React.ReactChild | React.ReactChild[];
	style?: React.CSSProperties;
	isResizable?: boolean;
	isRotatable?: boolean;
	onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
	onMouseDown?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
	onMouseUp?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
	onMouseMove?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

const HandleBase: React.ForwardRefExoticComponent<HandleProps> = React.forwardRef(
	(
		{children, style, metaKey, isRotatable, isResizable, onClick, cursorSlice, ...props},
		ref: React.Ref<HTMLAnchorElement>
	) => {
		const rotationSlice = rotationCursors[cursorSlice];
		const resizeSlice = resizeCursors[cursorSlice % resizeCursors.length];
		const componentStyle: React.CSSProperties = {
			...style,
			position: "absolute",
			zIndex: 2,
			visibility: "visible",
			width: 20,
			height: 20,
			cursor: metaKey
				? isRotatable
					? `-webkit-image-set(url("${rotationSlice["1x"]}") 1x, url("${rotationSlice["2x"]}") 2x) 9 9, default`
					: "default"
				: isResizable
				? resizeSlice
				: "default"
		};
		const handleClick = React.useCallback(
			(e: React.MouseEvent<HTMLAnchorElement>) => {
				e.preventDefault();
				onClick && onClick(e);
			},
			[onClick]
		);
		return (
			<a {...props} href="#" ref={ref} style={componentStyle} onClick={handleClick}>
				{children}
			</a>
		);
	}
);

const HandleMarker: React.FunctionComponent = ({children}) => (
	<span
		style={{
			position: "absolute",
			top: "50%",
			left: "50%",
			height: "5px",
			width: "5px",
			transform: "translate(-50%, -50%)",
			background: "white",
			boxShadow: "0 0 0 1px black",
			pointerEvents: "none"
		}}>
		{children}
	</span>
);

export const Handle: React.ForwardRefExoticComponent<HandleProps> = React.forwardRef((props, ref) => (
	<HandleBase {...props} ref={ref}>
		<HandleMarker />
	</HandleBase>
));

//const Handle = styled.a.attrs(() => ({
//	href: "#",
//	onClick: (e: React.MouseEvent<HTMLAnchorElement>) => {
//		e.preventDefault();
//	}
//}))<{metaKey?: boolean; cursorSlice: number; isResizable?: boolean; isRotatable?: boolean}>`
//	position: absolute;
//	z-index: 2;
//	cursor: ${props => {
//		const rotationSlice = rotationCursors[props.cursorSlice];
//		const resizeSlice = resizeCursors[props.cursorSlice % resizeCursors.length];
//		return props.metaKey
//			? props.isRotatable
//				? `-webkit-image-set(url("${rotationSlice["1x"]}") 1x, url("${rotationSlice["2x"]}") 2x) 9 9, default`
//				: "default"
//			: props.isResizable
//			? resizeSlice
//			: "default";
//	}};
//	&::before {
//		content: "";
//		position: absolute;
//		top: 50%;
//		left: 50%;
//		height: 5px;
//		width: 5px;
//		transform: translate(-50%, -50%);
//		background: white;
//		box-shadow: 0 0 0 1px black;
//		pointer-events: none;
//	}
//`;
//export const HandleTop = styled(Handle)`
//	top: -10px;
//	left: 50%;
//	margin-left: -10px;
//	width: 20px;
//	height: 20px;
//`;

export const HandleTop: React.ForwardRefExoticComponent<HandleProps> = React.forwardRef(
	({style, ...props}, ref) => (
		<Handle
			{...props}
			style={{
				...(style || {}),
				top: -10,
				left: "50%",
				marginLeft: -10
			}}
			ref={ref}/>
	)
);

//export const HandleRight = styled(Handle)`
//	right: -10px;
//	top: 50%;
//	margin-top: -10px;
//	width: 20px;
//	height: 20px;
//`;

export const HandleRight: React.ForwardRefExoticComponent<HandleProps> = React.forwardRef(
	({style, ...props}, ref) => (
		<Handle
			{...props}
			style={{
				...(style || {}),
				right: -10,
				top: "50%",
				marginTop: -10
			}}
			ref={ref}/>
	)
);

//export const HandleLeft = styled(Handle)`
//	left: -10px;
//	top: 50%;
//	margin-top: -10px;
//	width: 20px;
//	height: 20px;
//`;

export const HandleLeft: React.ForwardRefExoticComponent<HandleProps> = React.forwardRef(
	({style, ...props}, ref) => (
		<Handle
			{...props}
			style={{
				...(style || {}),
				left: -10,
				top: "50%",
				marginTop: -10
			}}
			ref={ref}/>
	)
);
//export const HandleBottom = styled(Handle)`
//	bottom: -10px;
//	left: 50%;
//	margin-left: -10px;
//	width: 20px;
//	height: 20px;
//`;
export const HandleBottom: React.ForwardRefExoticComponent<HandleProps> = React.forwardRef(
	({style, ...props}, ref) => (
		<Handle
			{...props}
			style={{
				...(style || {}),
				bottom: -10,
				left: "50%",
				marginLeft: -10
			}}
			ref={ref}/>
	)
);
//export const HandleTopLeft = styled(Handle)`
//	top: -10px;
//	left: -10px;
//	height: 20px;
//	width: 20px;
//`;

export const HandleTopLeft: React.ForwardRefExoticComponent<HandleProps> = React.forwardRef(
	({style, ...props}, ref) => (
		<Handle
			{...props}
			style={{
				...(style || {}),
				top: -10,
				left: -10
			}}
			ref={ref}/>
	)
);
//export const HandleTopRight = styled(Handle)`
//	top: -10px;
//	right: -10px;
//	height: 20px;
//	width: 20px;
//`;
export const HandleTopRight: React.ForwardRefExoticComponent<HandleProps> = React.forwardRef(
	({style, ...props}, ref) => (
		<Handle
			{...props}
			style={{
				...(style || {}),
				right: -10,
				top: -10
			}}
			ref={ref}/>
	)
);
//export const HandleBottomLeft = styled(Handle)`
//	bottom: -10px;
//	left: -10px;
//	height: 20px;
//	width: 20px;
//`;
export const HandleBottomLeft: React.ForwardRefExoticComponent<HandleProps> = React.forwardRef(
	({style, ...props}, ref) => (
		<Handle
			{...props}
			style={{
				...(style || {}),
				left: -10,
				bottom: -10
			}}
			ref={ref}/>
	)
);
//export const HandleBottomRight = styled(Handle)`
//	bottom: -10px;
//	right: -10px;
//	height: 20px;
//	width: 20px;
//`;
export const HandleBottomRight: React.ForwardRefExoticComponent<HandleProps> = React.forwardRef(
	({style, ...props}, ref) => (
		<Handle
			{...props}
			style={{
				...(style || {}),
				right: -10,
				bottom: -10,
				marginTop: -10
			}}
			ref={ref}/>
	)
);
//export const Handles = styled.div`
//	position: absolute;
//	top: 0;
//	left: 0;
//	right: 0;
//	bottom: 0;
//`;

export const Handles: React.FunctionComponent<{style?: React.CSSProperties}> = ({children, style, ...props}) => (
	<div
		{...props}
		style={{
			...(style || {}),
			position: "absolute",
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
			visibility: "hidden"
		}}>
		{children}
	</div>
);
//export const Wrapper = styled.div<{isDown?: boolean}>`
//	z-index: ${({isDown}) => (isDown ? 1 : "initial")};
//	position: absolute;
//	top: 0;
//	left: 0;
//	display: inline-flex;
//	vertical-align: top;
//	box-shadow: 0 0 0 1px hsla(200, 100%, 25%, 0.75);
//`;

export const Wrapper: React.ForwardRefExoticComponent<{
	children?: React.ReactNode;
	isDown?: boolean;
	as?: keyof JSX.IntrinsicElements | React.ComponentType<any>;
	style?: React.CSSProperties;
	ref?: React.Ref<HTMLElement>;
}> = React.forwardRef(({children, isDown, style, as: C, ...props}, ref: React.Ref<HTMLElement>) => (
	<C
		{...props}
		ref={ref as React.Ref<HTMLElement>}
		style={{
			...(style ||{}),
			zIndex: isDown ? 1 : "initial",
			position: "absolute",
			top: 0,
			left: 0,
			display: "inline-flex",
			boxShadow: "0 0 0 1px hsla(200, 100%, 25%, 0.75)"
		}}>
		{children}
	</C>
));

//export const Content = styled.div`
//	flex: 1;
//	z-index: 1;
//	overflow: hidden;
//	max-width: 100%;
//	max-height: 100%;
//	${props =>
//		props.onMouseDown &&
//		css`
//			cursor: move;
//		`};
//`;

export const Content: React.ForwardRefExoticComponent<{
	children?: React.ReactNode;
	onMouseDown?: (e: React.MouseEvent) => void;
	style?: React.CSSProperties;
	ref?: React.Ref<HTMLDivElement>;
}> = React.forwardRef(({children, style, ...props}, ref: React.Ref<HTMLDivElement>) => (
	<div
		{...props}
		ref={ref as React.Ref<HTMLDivElement>}
		style={{
			...(style || {}),
			flex: 1,
			zIndex: 1,
			overflow: "hidden",
			maxWidth: "100%",
			maxHeight: "100%",
			cursor: props.onMouseDown && "move"
		}}>
		{children}
	</div>
));
