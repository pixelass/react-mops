import React from "react";
import {GuidesConsumer} from "./guides";
import {
	Dir,
	useAlt,
	useControl,
	useMeta,
	usePosition,
	useRotate,
	useShift,
	useSize,
	useSnap
} from "./hooks";
import {isOSX} from "./os";
import {Mops} from "./types";

const handleVariations = {
	e: {
		left: "100%",
		top: "50%"
	},
	n: {
		left: "50%",
		top: 0
	},
	ne: {
		left: "100%",
		top: 0
	},
	nw: {
		left: 0,
		top: 0
	},
	s: {
		left: "50%",
		top: "100%"
	},
	se: {
		left: "100%",
		top: "100%"
	},
	sw: {
		left: 0,
		top: "100%"
	},
	w: {
		left: 0,
		top: "50%"
	}
};

const handleDirs = {
	e: {
		x: 1,
		y: 0
	},
	n: {
		x: 0,
		y: -1
	},
	ne: {
		x: 1,
		y: -1
	},
	nw: {
		x: -1,
		y: -1
	},
	s: {
		x: 0,
		y: 1
	},
	se: {
		x: 1,
		y: 1
	},
	sw: {
		x: -1,
		y: 1
	},
	w: {
		x: -1,
		y: 0
	}
};
const Handle: React.FunctionComponent<{
	marker?: React.ClassicElement<unknown>;
	onMouseDown?: React.MouseEventHandler;
	onTouchStart?: React.TouchEventHandler;
	position: "outside" | "inside";
	variation: string;
}> = ({marker, onMouseDown, onTouchStart, position, variation}) => (
	<div
		onMouseDown={onMouseDown}
		onTouchStart={onTouchStart}
		style={{
			height: position === "outside" ? 60 : 20,
			margin: position === "outside" ? -30 : -10,
			pointerEvents: "all",
			position: "absolute",
			touchAction: "none",
			width: position === "outside" ? 60 : 20,
			...handleVariations[variation]
		}}>
		{marker}
	</div>
);

const Marker = () => (
	<div
		style={{
			background: "#fff",
			border: "1px solid #000",
			height: 10,
			left: "50%",
			position: "absolute",
			top: "50%",
			touchAction: "none",
			transform: "translate(-50%,-50%)",
			width: 10,
			zIndex: 2
		}}
	/>
);

interface BoxProps {
	shouldSnap?: Mops.SnapHandler[];
	marker?: React.ComponentType;
	style?: React.CSSProperties;
	className?: string;
	ref?: React.Ref<HTMLElement>;
	onResize?: Mops.EventHandler;
	onResizeStart?: Mops.EventHandler;
	onResizeEnd?: Mops.EventHandler;
	onRotate?: Mops.EventHandler;
	onRotateStart?: Mops.EventHandler;
	onRotateEnd?: Mops.EventHandler;
	onDrag?: Mops.EventHandler;
	onDragStart?: Mops.EventHandler;
	onDragEnd?: Mops.EventHandler;
	position?: Mops.PositionModel;
	rotation?: Mops.RotationModel;
	size?: Mops.SizeModel;
	fullHandles?: boolean;
	drawBox?: boolean;
	minHeight?: number;
	minWidth?: number;
	drawBoundingBox?: boolean;
	isDraggable?: boolean;
	isResizable?: boolean;
	isRotatable?: boolean;
	scale?: number;
	as?: keyof JSX.IntrinsicElements | React.ComponentType;
}
const Box: React.FunctionComponent<BoxProps & Mops.GuidesContext> = ({
	as: As,
	children,
	size: initialSize,
	position: initialPosition,
	rotation: initialRotation,
	onRotateEnd,
	onDragEnd,
	onResizeEnd,
	onRotateStart,
	onDragStart,
	onResizeStart,
	onRotate,
	onDrag,
	onResize,
	isResizable,
	isDraggable,
	isRotatable,
	shouldSnap = [],
	addGuides,
	guideRequests,
	guides,
	hideGuides,
	removeGuides,
	showGuides,
	updateGuide
}) => {
	const [isActive, setActive] = React.useState(false);
	const [dir, setDir] = React.useState<Dir>({x: 0, y: 0});
	const metaKey = useMeta();
	const controlKey = useControl();
	const altKey = useAlt();
	const shiftKey = useShift();
	const [rotate, rotateProps] = useRotate(initialRotation.z, {
		onRotate,
		onRotateEnd: o => {
			setActive(false);
			const newPosition = snap as Mops.PositionModel;
			positionProps.setPosition(newPosition);
			positionProps.setInitialPosition(newPosition);
			hideGuides();
			if (onRotateEnd) {
				onRotateEnd({...o, position: newPosition});
			}
		},
		onRotateStart: o => {
			setActive(true);
			if (onRotateStart) {
				onRotateStart(o);
			}
		},
		step: 15,
		steps: shiftKey
	});
	const [position, positionProps] = usePosition(initialPosition, {
		onDrag,
		onDragEnd: o => {
			setActive(false);
			const newPosition = snap as Mops.PositionModel;
			positionProps.setPosition(newPosition);
			positionProps.setInitialPosition(newPosition);
			hideGuides();
			if (onDragEnd) {
				onDragEnd({...o, position: newPosition});
			}
		},
		onDragStart: o => {
			setActive(true);
			if (onDragStart) {
				onDragStart(o);
			}
		}
	});
	const [size, sizeProps] = useSize(initialSize, {
		centered: altKey,
		deg: rotate,
		dir,
		initialPosition: positionProps.initialPosition,
		onResize,
		onResizeEnd: o => {
			setActive(false);
			const newPosition = snap as Mops.PositionModel;
			positionProps.setPosition(newPosition);
			positionProps.setInitialPosition(newPosition);
			hideGuides();
			if (onResizeEnd) {
				onResizeEnd({...o, position: newPosition});
			}
		},
		onResizeStart: o => {
			setActive(true);
			if (onResizeStart) {
				onResizeStart(o);
			}
		},
		setInitialPosition: positionProps.setInitialPosition,
		setPosition: positionProps.setPosition
	});
	const snap = useSnap(
		isActive ? shouldSnap : undefined,
		{size, position, rotation: {...initialRotation, z: rotate}},
		{addGuides, guideRequests, guides, hideGuides, removeGuides, showGuides, updateGuide}
	);

	return (
		<As
			style={{
				left: 0,
				position: "absolute",
				top: 0,
				transform: `translate3d(${snap.x}px,${snap.y}px,0) translate3d(-50%,-50%, 0) rotate3d(0,0,1,${rotate}deg)`
			}}>
			{isResizable || isRotatable ? (
				<div
					ref={rotateProps.ref as React.Ref<HTMLDivElement>}
					style={{
						bottom: 0,
						boxShadow: "0 0 0 1px black",
						left: 0,
						pointerEvents: "none",
						position: "absolute",
						right: 0,
						top: 0
					}}>
					{Object.keys(handleVariations).map(key => (
						<Handle
							key={key}
							position="inside"
							variation={key}
							marker={<Marker />}
							onMouseDown={event => {
								setDir(handleDirs[key]);
								if (metaKey && isRotatable) {
									rotateProps.onMouseDown(event);
								} else if (isResizable) {
									sizeProps.onMouseDown(event);
								}
							}}
							onTouchStart={event => {
								setDir(handleDirs[key]);
								if ((isOSX() ? metaKey : controlKey) && isRotatable) {
									rotateProps.onTouchStart(event);
								} else if (isResizable) {
									sizeProps.onTouchStart(event);
								}
							}}
						/>
					))}
				</div>
			) : null}
			<div
				style={{
					position: "relative",
					touchAction: "none",
					...size
				}}
				onMouseDown={isDraggable ? positionProps.onMouseDown : undefined}
				onTouchStart={isDraggable ? positionProps.onTouchStart : undefined}>
				{children}
			</div>
		</As>
	);
};

Box.defaultProps = {as: "div"}

export const GuidedBox: React.FunctionComponent<BoxProps> = ({children, ...props}) => {
	return (
		<GuidesConsumer>
			{context => (
				<Box {...props} {...context}>
					{children}
				</Box>
			)}
		</GuidesConsumer>
	);
};
