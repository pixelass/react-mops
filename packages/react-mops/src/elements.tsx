import React from "react";
import {resizeCursors, rotationCursors} from "./cursors";
import {Mops} from "./types";
export const {Provider: PropProvider, Consumer: PropConsumer} = React.createContext<
	Mops.ProviderProps
>({
	getCursorSlice: n => n,
	handleRotationDown: () => undefined,
	isDraggable: false,
	isResizable: false,
	isRotatable: false,
	metaKey: false
});

const HandleBase: React.RefForwardingComponent<
	HTMLAnchorElement,
	Mops.HandleProps
> = React.forwardRef(
	(
		{children, style, onClick, onMouseDown, variation, ...props},
		ref: React.Ref<HTMLAnchorElement>
	) => {
		const handleClick = React.useCallback(
			(e: React.MouseEvent<HTMLAnchorElement>) => {
				e.preventDefault();
				if (typeof onClick === "function") {
					onClick(e);
				}
			},
			[onClick]
		);
		return (
			<PropConsumer>
				{({handleRotationDown, isResizable, isRotatable, getCursorSlice, metaKey}) => {
					const cursorSlice = getCursorSlice(Mops.HandleVariations[variation]);
					const rotationSlice = rotationCursors[cursorSlice];
					const resizeSlice = resizeCursors[cursorSlice % resizeCursors.length];
					const componentStyle: React.CSSProperties = {
						height: 20,
						width: 20,
						...style,
						cursor: metaKey
							? isRotatable
								? `
								-webkit-image-set(url("${rotationSlice["1x"]}") 1x,
								url("${rotationSlice["2x"]}") 2x) 9 9, default
							`
								: "default"
							: isResizable
							? resizeSlice
							: "default",
						pointerEvents: "all",
						position: "absolute",
						visibility: "visible",
						zIndex: 2
					};

					return (
						<a
							{...props}
							href="#"
							ref={ref}
							style={componentStyle}
							onClick={handleClick}
							onMouseDown={metaKey ? handleRotationDown : onMouseDown}>
							{children}
						</a>
					);
				}}
			</PropConsumer>
		);
	}
);

const HandleMarker: React.FunctionComponent<{style?: React.CSSProperties}> = ({
	children,
	style
}) => (
	<span
		style={{
			background: "white",
			boxShadow: "0 0 0 1px black",
			height: "5px",
			left: "50%",
			position: "absolute",
			top: "50%",
			transform: "translate(-50%, -50%)",
			width: "5px",
			...(style || {})
		}}>
		{children}
	</span>
);

const variations = {
	e: {
		right: -10,
		top: "50%",
		transform: "translateY(-50%)",
		width: 20
	},
	n: {
		height: 20,
		left: "50%",
		top: -10,
		transform: "translateX(-50%)"
	},
	ne: {
		height: 20,
		right: -10,
		top: -10,
		width: 20
	},
	nw: {
		height: 20,
		left: -10,
		top: -10,
		width: 20
	},
	s: {
		bottom: -10,
		height: 20,
		left: "50%",
		transform: "translateX(-50%)"
	},
	se: {
		bottom: -10,
		height: 20,
		right: -10,
		width: 20
	},
	sw: {
		bottom: -10,
		height: 20,
		left: -10,
		width: 20
	},
	w: {
		left: -10,
		top: "50%",
		transform: "translateY(-50%)",
		width: 20
	}
};

export const Handle: React.RefForwardingComponent<
	HTMLAnchorElement,
	Mops.HandleProps & {variation: Mops.HandleVariation; full?: boolean}
> = React.forwardRef(({variation, style, marker: Marker, full, ...props}, ref) => {
	return (
		<HandleBase
			{...props}
			variation={variation}
			style={{
				...(style || {}),
				...(full ? {height: "100%", width: "100%"} : {}),
				...variations[variation]
			}}
			ref={ref}>
			<Marker
				style={{
					pointerEvents: "none"
				}}
			/>
		</HandleBase>
	);
});

Handle.defaultProps = {
	marker: HandleMarker
};

export const Handles: React.FunctionComponent<{style?: React.CSSProperties; draw?: boolean}> = ({
	children,
	style,
	draw,
	...props
}) => (
	<div
		{...props}
		style={{
			...(style || {}),
			bottom: 0,
			boxShadow: draw ? "0 0 0 1px hsla(200, 100%, 25%, 0.75)" : undefined,
			left: 0,
			pointerEvents: "none",
			position: "absolute",
			right: 0,
			top: 0,
			zIndex: 2
		}}>
		{children}
	</div>
);

export const Wrapper: React.RefForwardingComponent<
	HTMLElement,
	Mops.WrapperProps
> = React.forwardRef(({children, isDown, style, as: As, ...props}, ref: React.Ref<HTMLElement>) => (
	<As
		{...props}
		ref={ref as React.Ref<HTMLElement>}
		style={{
			...(style || {}),
			alignContent: "center",
			alignItems: "center",
			display: "flex",
			justifyContent: "center",
			left: 0,
			pointerEvents: "none",
			position: "absolute",
			top: 0,
			zIndex: isDown ? 1 : "initial"
		}}>
		{children}
	</As>
));

export const Content: React.RefForwardingComponent<
	HTMLDivElement,
	Mops.ContentProps
> = React.forwardRef(({children, onMouseDown, style, ...props}, ref: React.Ref<HTMLDivElement>) => (
	<div
		{...props}
		onMouseDown={onMouseDown}
		ref={ref as React.Ref<HTMLDivElement>}
		style={{
			...(style || {}),
			cursor: onMouseDown && "move",
			maxHeight: "100%",
			maxWidth: "100%",
			pointerEvents: "all",
			zIndex: 1
		}}>
		{children}
	</div>
));

export const BoundingBox: React.RefForwardingComponent<
	HTMLDivElement,
	{style?: React.CSSProperties; draw?: boolean}
> = React.forwardRef(({children, style, draw, ...props}, ref: React.Ref<HTMLDivElement>) => (
	<div
		{...props}
		ref={ref as React.Ref<HTMLDivElement>}
		style={{
			boxShadow: draw ? "0 0 0 1px hsla(200, 100%, 25%, 0.75)" : undefined,
			height: "100%",
			pointerEvents: "none",
			position: "absolute",
			width: "100%",
			...(style || {})
		}}>
		{children}
	</div>
));
