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

const HandleBase: React.ForwardRefExoticComponent<Mops.HandleProps> = React.forwardRef(
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
						height: 20,
						position: "absolute",
						visibility: "visible",
						width: 20,
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

const HandleMarker: React.FunctionComponent = ({children}) => (
	<span
		style={{
			background: "white",
			boxShadow: "0 0 0 1px black",
			height: "5px",
			left: "50%",
			pointerEvents: "none",
			position: "absolute",
			top: "50%",
			transform: "translate(-50%, -50%)",
			width: "5px"
		}}>
		{children}
	</span>
);

const variations = {
	e: {
		marginTop: -10,
		right: -10,
		top: "50%"
	},
	n: {
		left: "50%",
		marginLeft: -10,
		top: -10
	},
	ne: {
		right: -10,
		top: -10
	},
	nw: {
		left: -10,
		top: -10
	},
	s: {
		bottom: -10,
		left: "50%",
		marginLeft: -10
	},
	se: {
		bottom: -10,
		marginTop: -10,
		right: -10
	},
	sw: {
		bottom: -10,
		left: -10
	},
	w: {
		left: -10,
		marginTop: -10,
		top: "50%"
	}
};

export const Handle: React.ForwardRefExoticComponent<
	Mops.HandleProps & {variation: Mops.HandleVariation}
> = React.forwardRef(({variation, style, ...props}, ref) => {
	return (
		<HandleBase
			{...props}
			variation={variation}
			style={{...(style || {}), ...variations[variation]}}
			ref={ref}>
			<HandleMarker />
		</HandleBase>
	);
});

export const Handles: React.FunctionComponent<{style?: React.CSSProperties}> = ({
	children,
	style,
	...props
}) => (
	<div
		{...props}
		style={{
			...(style || {}),
			bottom: 0,
			left: 0,
			position: "absolute",
			right: 0,
			top: 0,
			visibility: "hidden"
		}}>
		{children}
	</div>
);

export const Wrapper: React.ForwardRefExoticComponent<Mops.WrapperProps> = React.forwardRef(
	({children, isDown, style, as: As, ...props}, ref: React.Ref<HTMLElement>) => (
		<As
			{...props}
			ref={ref as React.Ref<HTMLElement>}
			style={{
				...(style || {}),
				boxShadow: "0 0 0 1px hsla(200, 100%, 25%, 0.75)",
				display: "inline-flex",
				left: 0,
				position: "absolute",
				top: 0,
				zIndex: isDown ? 1 : "initial"
			}}>
			{children}
		</As>
	)
);

export const Content: React.ForwardRefExoticComponent<Mops.ContentProps> = React.forwardRef(
	({children, onMouseDown, style, ...props}, ref: React.Ref<HTMLDivElement>) => (
		<div
			{...props}
			onMouseDown={onMouseDown}
			ref={ref as React.Ref<HTMLDivElement>}
			style={{
				...(style || {}),
				cursor: onMouseDown && "move",
				flex: 1,
				maxHeight: "100%",
				maxWidth: "100%",
				overflow: "hidden",
				zIndex: 1
			}}>
			{children}
		</div>
	)
);
