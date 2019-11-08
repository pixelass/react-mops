import React from "react";
import {
	Axis,
	BoundingBox,
	Content,
	Handle,
	handleDirs,
	Handles,
	handleVariations,
	Wrapper
} from "./elements";
import {GuidesConsumer} from "./guides";
import {
	useAlt,
	useBoundingBox,
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

const Box: React.FunctionComponent<Mops.BoxProps & Mops.GuidesContext> = ({
	as,
	children,
	drawBoundingBox,
	drawBox,
	fullHandles,
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
	marker,
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
	const [isActive, setActive] = React.useState<boolean>(false);
	const [dir, setDir] = React.useState<Mops.Dir>({x: 0, y: 0});
	const metaKey = useMeta();
	const controlKey = useControl();
	const altKey = useAlt();
	const shiftKey = useShift();
	const [rotate, rotateProps] = useRotate(initialRotation.z, {
		onRotate,
		onRotateEnd: b => {
			const update = onEnd();
			if (onRotateEnd) {
				onRotateEnd({...b, ...update});
			}
		},
		onRotateStart: b => {
			if (onRotateStart) {
				onRotateStart(b);
			}
		},
		step: 15,
		steps: shiftKey
	});
	const [position, positionProps] = usePosition(initialPosition, {
		onDrag,
		onDragEnd: o => {
			setActive(false);
			const update = onEnd();
			if (onDragEnd) {
				onDragEnd({...o, ...update});
			}
		},
		onDragStart: b => {
			setActive(true);
			if (onDragStart) {
				onDragStart(b);
			}
		}
	});
	const [size, sizeProps] = useSize(initialSize, {
		centered: altKey,
		deg: rotate,
		dir,
		initialPosition: positionProps.initialPosition,
		onResize,
		onResizeEnd: b => {
			const update = onEnd();
			if (onResizeEnd) {
				onResizeEnd({...b, ...update});
			}
		},
		onResizeStart: b => {
			if (onResizeStart) {
				onResizeStart(b);
			}
		},
		setInitialPosition: positionProps.setInitialPosition,
		setPosition: positionProps.setPosition
	});

	const snap = useSnap(
		isActive ? shouldSnap : [],
		{size, position, rotation: {...initialRotation, z: rotate}},
		{addGuides, guideRequests, guides, hideGuides, removeGuides, showGuides, updateGuide}
	);

	const onEnd = React.useCallback(
		() => {
			const newPosition = snap.position as Mops.PositionModel;
			const newSize = snap.size as Mops.SizeModel;
			positionProps.setPosition(newPosition);
			positionProps.setInitialPosition(newPosition);
			sizeProps.setSize(newSize);
			sizeProps.setInitialSize(newSize);
			hideGuides();
			return {
				position: newPosition,
				size: newSize
			};
		},
		[hideGuides, sizeProps, positionProps]
	);

	const boundingBox = useBoundingBox(snap.size, rotate);

	return (
		<Wrapper
			as={as}
			style={{
				transform: `translate3d(${snap.position.x}px,${snap.position.y}px,0) translate3d(-50%,-50%, 0)`
			}}>
			<BoundingBox
				drawOutline={drawBoundingBox}
				style={boundingBox}
				ref={rotateProps.ref as React.Ref<HTMLDivElement>}>
				<Axis
					style={{
						transform: `translate3d(-50%,-50%, 0) rotate3d(0,0,1,${rotate}deg)`
					}}>
					{isResizable || isRotatable ? (
						<Handles drawOutline={drawBox}>
							{handleVariations.map(key => (
								<Handle
									key={key}
									variation={key}
									marker={marker}
									fullSize={fullHandles}
									onMouseDown={event => {
										setDir(handleDirs[key]);
										if ((isOSX() ? metaKey : controlKey) && isRotatable) {
											rotateProps.onMouseDown(event);
										} else if (isResizable) {
											sizeProps.onMouseDown(event);
										}
									}}
									onTouchStart={event => {
										setDir(handleDirs[key]);
										if (isResizable) {
											sizeProps.onTouchStart(event);
										}
									}}
								/>
							))}
						</Handles>
					) : null}
					<Content
						style={{
							...snap.size
						}}
						onMouseDown={isDraggable ? positionProps.onMouseDown : undefined}
						onTouchStart={event => {
							if (event.touches.length > 1) {
								if (isRotatable) {
									rotateProps.onTouchStart(event);
								}
							} else if (isDraggable) {
								positionProps.onTouchStart(event);
							}
						}}>
						{children}
					</Content>
				</Axis>
			</BoundingBox>
		</Wrapper>
	);
};

Box.defaultProps = {
	as: "div",
	marker: null
};

export const GuidedBox: React.FunctionComponent<Mops.BoxProps> = ({children, ...props}) => {
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
