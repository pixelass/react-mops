import React from "react";
import {Mops} from "./types";
import {coordinatesToDeg, to360, withAlt, withAspectRatio, withRotation} from "./utils";
import {rotationClasses, rotationCursors} from "./cursors";
import {useHandle, useMeta, useMouseMove, useMouseMoveEvent} from "./hooks";
import {
	Content,
	HandleBottom,
	HandleBottomLeft,
	HandleBottomRight,
	HandleLeft,
	HandleRight,
	Handles,
	HandleTop,
	HandleTopLeft,
	HandleTopRight,
	Wrapper
} from "./elements";

export const Box: React.ForwardRefExoticComponent<Mops.BoxProps> = React.forwardRef(
	(
		{
			onDrag,
			onDragStart,
			onDragEnd,
			onResize,
			onResizeStart,
			onResizeEnd,
			onRotate,
			onRotateStart,
			onRotateEnd,
			...props
		},
		ref
	) => {
		const contentRef = ref || React.useRef<HTMLElement>();
		const [loaded, setLoaded] = React.useState(false);
		const [initialSize, setInitialSize] = React.useState<Mops.SizeModel>(
			props.size as Mops.SizeModel
		);
		const [currentSize, setSize] = React.useState<Mops.SizeModel>(initialSize);
		const [initialPosition, setInitialPosition] = React.useState<Mops.PositionModel>(
			props.position
		);
		const [currentPosition, setPosition] = React.useState<Mops.PositionModel>(initialPosition);
		const [initialRotation, setInitialRotation] = React.useState<Mops.RotationModel>(
			props.rotation
		);
		const [additionalAngle, setAdditionalAngle] = React.useState<Mops.RotationModel>(
			props.rotation
		);
		const [currentRotation, setRotation] = React.useState<Mops.RotationModel>(initialRotation);
		const metaKey = useMeta();

		const handleDrag = React.useCallback(() => {
			onDrag &&
				onDrag({position: currentPosition, rotation: currentRotation, size: currentSize});
		}, [onDrag, currentSize, currentPosition, currentRotation]);
		const handleDragStart = React.useCallback(() => {
			onDragStart &&
				onDragStart({
					position: currentPosition,
					rotation: currentRotation,
					size: currentSize
				});
		}, [onDragStart, currentSize, currentPosition, currentRotation]);
		const handleDragEnd = React.useCallback(() => {
			onDragEnd &&
				onDragEnd({
					position: currentPosition,
					rotation: currentRotation,
					size: currentSize
				});
		}, [onDragEnd, currentSize, currentPosition, currentRotation]);

		const handleResize = React.useCallback(() => {
			onResize &&
				onResize({position: currentPosition, rotation: currentRotation, size: currentSize});
		}, [onResize, currentSize, currentPosition, currentRotation]);
		const handleResizeStart = React.useCallback(() => {
			onResizeStart &&
				onResizeStart({
					position: currentPosition,
					rotation: currentRotation,
					size: currentSize
				});
		}, [onResizeStart, currentSize, currentPosition, currentRotation]);
		const handleResizeEnd = React.useCallback(() => {
			onResizeEnd &&
				onResizeEnd({
					position: currentPosition,
					rotation: currentRotation,
					size: currentSize
				});
		}, [onResizeEnd, currentSize, currentPosition, currentRotation]);

		const handleRotate = React.useCallback(() => {
			onRotate &&
				onRotate({position: currentPosition, rotation: currentRotation, size: currentSize});
		}, [onRotate, currentSize, currentPosition, currentRotation]);
		const handleRotateStart = React.useCallback(() => {
			onRotateStart &&
				onRotateStart({
					position: currentPosition,
					rotation: currentRotation,
					size: currentSize
				});
		}, [onRotateStart, currentSize, currentPosition, currentRotation]);
		const handleRotateEnd = React.useCallback(() => {
			onRotateEnd &&
				onRotateEnd({
					position: currentPosition,
					rotation: currentRotation,
					size: currentSize
				});
		}, [onRotateEnd, currentSize, currentPosition, currentRotation]);

		const [isTopDown, setTopDown] = useHandle({
			setSize,
			setInitialSize,
			setPosition,
			setInitialPosition,
			scale: props.scale as number,
			rotation: currentRotation,
			contentRef: contentRef as React.RefObject<HTMLElement>,
			handleSize: ({x, y}, altKey, shiftKey) => state =>
				!props.isResizable
					? state
					: {
							height: initialSize.height - withAlt(y, altKey),
							width: shiftKey
								? withAspectRatio(
										initialSize.height - withAlt(y, altKey),
										initialSize
								  )
								: state.width
					  },
			handlePosition: ({x, y}, altKey) => state => {
				if (!props.isResizable) {
					return state;
				}
				const d = withRotation(0, y, currentRotation.z);
				return {
					x: initialPosition.x - (altKey ? 0 : d.x / 2),
					y: initialPosition.y + (altKey ? 0 : d.y / 2)
				};
			}
		});

		const [isRightDown, setRightDown] = useHandle({
			setSize,
			setInitialSize,
			setPosition,
			setInitialPosition,
			scale: props.scale as number,
			rotation: currentRotation,
			contentRef: contentRef as React.RefObject<HTMLElement>,
			handleSize: ({x, y}, altKey, shiftKey) => state =>
				!props.isResizable
					? state
					: {
							width: initialSize.width + withAlt(x, altKey),
							height: shiftKey
								? withAspectRatio(
										initialSize.width + withAlt(x, altKey),
										initialSize,
										true
								  )
								: state.height
					  },
			handlePosition: ({x, y}, altKey) => state => {
				if (!props.isResizable) {
					return state;
				}
				const d = withRotation(x, 0, currentRotation.z);
				return {
					x: initialPosition.x + (altKey ? 0 : d.x / 2),
					y: initialPosition.y - (altKey ? 0 : d.y / 2)
				};
			}
		});

		const [isBottomDown, setBottomDown] = useHandle({
			setSize,
			setInitialSize,
			setPosition,
			setInitialPosition,
			scale: props.scale as number,
			rotation: currentRotation,
			contentRef: contentRef as React.RefObject<HTMLElement>,
			handleSize: ({x, y}, altKey, shiftKey) => state =>
				!props.isResizable
					? state
					: {
							height: initialSize.height + withAlt(y, altKey),
							width: shiftKey
								? withAspectRatio(
										initialSize.height + withAlt(y, altKey),
										initialSize
								  )
								: state.width
					  },
			handlePosition: ({x, y}, altKey) => state => {
				if (!props.isResizable) {
					return state;
				}
				const d = withRotation(0, y, currentRotation.z);
				return {
					x: initialPosition.x - (altKey ? 0 : d.x / 2),
					y: initialPosition.y + (altKey ? 0 : d.y / 2)
				};
			}
		});

		const [isLeftDown, setLeftDown] = useHandle({
			setSize,
			setInitialSize,
			setPosition,
			setInitialPosition,
			scale: props.scale as number,
			rotation: currentRotation,
			contentRef: contentRef as React.RefObject<HTMLElement>,
			handleSize: ({x, y}, altKey, shiftKey) => state =>
				!props.isResizable
					? state
					: {
							width: initialSize.width - withAlt(x, altKey),
							height: shiftKey
								? withAspectRatio(
										initialSize.width - withAlt(x, altKey),
										initialSize,
										true
								  )
								: state.height
					  },
			handlePosition: ({x, y}, altKey) => state => {
				if (!props.isResizable) {
					return state;
				}
				const d = withRotation(x, 0, currentRotation.z);
				return {
					x: initialPosition.x + (altKey ? 0 : d.x / 2),
					y: initialPosition.y - (altKey ? 0 : d.y / 2)
				};
			}
		});

		const [isTopLeftDown, setTopLeftDown] = useHandle({
			setSize,
			setInitialSize,
			setPosition,
			setInitialPosition,
			scale: props.scale as number,
			rotation: currentRotation,
			contentRef: contentRef as React.RefObject<HTMLElement>,
			handleSize: ({x, y}, altKey, shiftKey) => state =>
				!props.isResizable
					? state
					: {
							width: initialSize.width - withAlt(x, altKey),
							height: shiftKey
								? withAspectRatio(
										initialSize.width - withAlt(x, altKey),
										initialSize,
										true
								  )
								: initialSize.height - withAlt(y, altKey)
					  },
			handlePosition: ({x, y}, altKey, shiftKey) => state => {
				if (altKey || !props.isResizable) {
					return state;
				}
				const d = withRotation(
					0,
					shiftKey
						? initialSize.height -
								withAspectRatio(initialSize.width - x, initialSize, true)
						: y,
					currentRotation.z
				);
				const e = withRotation(x, 0, currentRotation.z);
				return {
					x: initialPosition.x - d.x / 2 + e.x / 2,
					y: initialPosition.y + d.y / 2 - e.y / 2
				};
			}
		});

		const [isTopRightDown, setTopRightDown] = useHandle({
			setSize,
			setInitialSize,
			setPosition,
			setInitialPosition,
			scale: props.scale as number,
			rotation: currentRotation,
			contentRef: contentRef as React.RefObject<HTMLElement>,
			handleSize: ({x, y}, altKey, shiftKey) => state =>
				!props.isResizable
					? state
					: {
							width: initialSize.width + withAlt(x, altKey),
							height: shiftKey
								? withAspectRatio(
										initialSize.width + withAlt(x, altKey),
										initialSize,
										true
								  )
								: initialSize.height - withAlt(y, altKey)
					  },
			handlePosition: ({x, y}, altKey, shiftKey) => state => {
				if (altKey || !props.isResizable) {
					return state;
				}
				const d = withRotation(
					0,
					shiftKey
						? initialSize.height -
								withAspectRatio(initialSize.width + x, initialSize, true)
						: y,
					currentRotation.z
				);
				const e = withRotation(x, 0, currentRotation.z);
				return {
					x: initialPosition.x - d.x / 2 + e.x / 2,
					y: initialPosition.y + d.y / 2 - e.y / 2
				};
			}
		});

		const [isBottomLeftDown, setBottomLeftDown] = useHandle({
			setSize,
			setInitialSize,
			setPosition,
			setInitialPosition,
			scale: props.scale as number,
			rotation: currentRotation,
			contentRef: contentRef as React.RefObject<HTMLElement>,
			handleSize: ({x, y}, altKey, shiftKey) => state =>
				!props.isResizable
					? state
					: {
							width: initialSize.width - withAlt(x, altKey),
							height: shiftKey
								? withAspectRatio(
										initialSize.width - withAlt(x, altKey),
										initialSize,
										true
								  )
								: initialSize.height + withAlt(y, altKey)
					  },
			handlePosition: ({x, y}, altKey, shiftKey) => state => {
				if (altKey || !props.isResizable) {
					return state;
				}
				const d = withRotation(
					0,
					shiftKey
						? initialSize.height -
								withAspectRatio(initialSize.width + x, initialSize, true)
						: y,
					currentRotation.z
				);
				const e = withRotation(x, 0, currentRotation.z);
				return {
					x: initialPosition.x - d.x / 2 + e.x / 2,
					y: initialPosition.y + d.y / 2 - e.y / 2
				};
			}
		});

		const [isBottomRightDown, setBottomRightDown] = useHandle({
			setSize,
			setInitialSize,
			setPosition,
			setInitialPosition,
			scale: props.scale as number,
			rotation: currentRotation,
			contentRef: contentRef as React.RefObject<HTMLElement>,
			handleSize: ({x, y}, altKey, shiftKey) => state =>
				!props.isResizable
					? state
					: {
							width: initialSize.width + withAlt(x, altKey),
							height: shiftKey
								? withAspectRatio(
										initialSize.width + withAlt(x, altKey),
										initialSize,
										true
								  )
								: initialSize.height + withAlt(y, altKey)
					  },
			handlePosition: ({x, y}, altKey, shiftKey) => state => {
				if (altKey || !props.isResizable) {
					return state;
				}
				const d = withRotation(
					0,
					shiftKey
						? initialSize.height -
								withAspectRatio(initialSize.width - x, initialSize, true)
						: y,
					currentRotation.z
				);
				const e = withRotation(x, 0, currentRotation.z);
				return {
					x: initialPosition.x - d.x / 2 + e.x / 2,
					y: initialPosition.y + d.y / 2 - e.y / 2
				};
			}
		});
		const [isDown, setDown] = useMouseMove(
			({x, y}) => {
				const newPosition = {
					x: initialPosition.x + x,
					y: initialPosition.y + y
				};
				const withSnapLogic = props.shouldSnap.reduce(
					(model, fn) => ({
						...fn(
							{position: newPosition, size: currentSize, rotation: currentRotation},
							model
						)
					}),
					newPosition
				) as Mops.PositionModel;
				setPosition(withSnapLogic);
				setInitialPosition(withSnapLogic);
			},
			({x, y}) => {
				const newPosition = {
					x: initialPosition.x + x,
					y: initialPosition.y + y
				};
				const withSnapLogic = props.shouldSnap.reduce(
					(model, fn) => ({
						...fn(
							{position: newPosition, size: currentSize, rotation: currentRotation},
							model
						)
					}),
					newPosition
				) as Mops.PositionModel;
				setPosition(withSnapLogic);
			},
			props.scale as number
		);
		const [isRotationDown, handleRotationDown] = useMouseMoveEvent(
			(event: MouseEvent) => {
				if (!props.isRotatable) {
					return;
				}
				if (contentRef && (contentRef as React.RefObject<HTMLElement>).current) {
					const {left, top, width, height} = (contentRef as React.RefObject<
						HTMLElement
					>).current.getBoundingClientRect();
					const pointer = {x: event.clientX - left, y: event.clientY - top};
					const center = {x: width / 2, y: height / 2};
					const deg = coordinatesToDeg(pointer, center);
					const newRotationZ = to360(initialRotation.z + (deg - additionalAngle.z));
					const newRotation = state => ({
						x: state.x,
						y: state.y,
						z: event.shiftKey ? Math.round(newRotationZ / 15) * 15 : newRotationZ
					});
					setRotation(newRotation);
					setInitialRotation(newRotation);
				}
			},
			(event: MouseEvent) => {
				if (!props.isRotatable) {
					return;
				}
				if (contentRef && (contentRef as React.RefObject<HTMLElement>).current) {
					const {clientX, clientY} = event;
					const {left, top, width, height} = (contentRef as React.RefObject<
						HTMLElement
					>).current.getBoundingClientRect();
					const pointer = {x: clientX - left, y: clientY - top};
					const center = {x: width / 2, y: height / 2};
					const deg = coordinatesToDeg(pointer, center);
					const newRotationZ = to360(initialRotation.z + (deg - additionalAngle.z));
					const newRotation = (state: Mops.RotationModel) => ({
						x: state.x,
						y: state.y,
						z: event.shiftKey ? Math.round(newRotationZ / 15) * 15 : newRotationZ
					});
					setRotation(newRotation);
				}
			},
			(event: React.MouseEvent<HTMLElement>) => {
				if (!props.isRotatable) {
					return;
				}
				if (contentRef && (contentRef as React.RefObject<HTMLElement>).current) {
					const {clientX, clientY} = event;
					const {left, top, width, height} = (contentRef as React.RefObject<
						HTMLElement
					>).current.getBoundingClientRect();
					const pointer = {x: clientX - left, y: clientY - top};
					const center = {x: width / 2, y: height / 2};
					const deg = coordinatesToDeg(pointer, center);
					const newRotation = (state: Mops.RotationModel) => ({
						x: state.x,
						y: state.y,
						z: to360(initialRotation.z)
					});
					setRotation(newRotation);
					setInitialRotation(newRotation);
					setAdditionalAngle({x: 0, y: 0, z: deg});
				}
			}
		);
		React.useEffect(() => {
			if (contentRef && (contentRef as React.RefObject<HTMLElement>).current) {
				setSize({
					height: (contentRef as React.RefObject<HTMLElement>).current.clientHeight,
					width: (contentRef as React.RefObject<HTMLElement>).current.clientWidth
				});
				setInitialSize({
					height: (contentRef as React.RefObject<HTMLElement>).current.clientHeight,
					width: (contentRef as React.RefObject<HTMLElement>).current.clientWidth
				});
			}
		}, [setSize, setInitialSize]);

		React.useEffect(() => {
			if (loaded) {
				if (isDown) {
					handleDrag();
				} else if (
					[
						isTopDown,
						isRightDown,
						isBottomDown,
						isLeftDown,
						isTopLeftDown,
						isTopRightDown,
						isBottomLeftDown,
						isBottomRightDown
					].filter(Boolean).length
				) {
					handleResize();
				} else if (isRotationDown) {
					handleRotate();
				}
			}
		}, [currentSize, currentPosition, currentRotation]);

		React.useEffect(() => {
			if (loaded) {
				if (isDown) {
					handleDragStart();
				} else {
					handleDragEnd();
				}
			}
		}, [isDown]);
		React.useEffect(() => {
			if (loaded) {
				if (
					[
						isTopDown,
						isRightDown,
						isBottomDown,
						isLeftDown,
						isTopLeftDown,
						isTopRightDown,
						isBottomLeftDown,
						isBottomRightDown
					].filter(Boolean).length
				) {
					handleResizeStart();
				} else if (isRotationDown) {
					handleRotateStart();
				} else if (metaKey) {
					handleRotateEnd();
				} else {
					handleResizeEnd();
				}
			}
		}, [
			isRotationDown,
			isTopDown,
			isRightDown,
			isBottomDown,
			isLeftDown,
			isTopLeftDown,
			isTopRightDown,
			isBottomLeftDown,
			isBottomRightDown
		]);

		React.useEffect(() => {
			setLoaded(true);
		}, [setLoaded]);

		const handleMouseDown = React.useCallback(
			e => {
				handleRotationDown(e);
			},
			[handleRotationDown]
		);

		const getCursorSlice = React.useCallback(n => {
			return (Math.round(to360(currentRotation.z) / 45) + n) % rotationCursors.length;
		}, []);

		const style = {
			...currentSize,
			transform: `translate3d(${currentPosition.x}px, ${currentPosition.y}px, 0) translate3d(-50%, -50%, 0) rotate3d(0, 0, 1, ${currentRotation.z}deg)`
		};
		return (
			<Wrapper
				ref={contentRef as React.RefObject<HTMLDivElement>}
				as={props.as}
				style={style}
				isDown={isDown}>
				{props.isDraggable ? (
					<Content onMouseDown={!metaKey ? setDown : undefined}>{props.children}</Content>
				) : (
					props.children
				)}
				{(props.isResizable || props.isRotatable) && (
					<Handles>
						<HandleTop
							onMouseDown={metaKey ? handleMouseDown : setTopDown}
							isRotatable={props.isRotatable}
							isResizable={props.isResizable}
							metaKey={metaKey}
							cursorSlice={getCursorSlice(
								(Math.round(currentRotation.z / 45) + rotationClasses.length + 6) %
									rotationClasses.length
							)}
						/>
						<HandleRight
							onMouseDown={metaKey ? handleMouseDown : setRightDown}
							isRotatable={props.isRotatable}
							isResizable={props.isResizable}
							metaKey={metaKey}
							cursorSlice={getCursorSlice(
								(Math.round(currentRotation.z / 45) + rotationClasses.length) %
									rotationClasses.length
							)}
						/>
						<HandleBottom
							onMouseDown={metaKey ? handleMouseDown : setBottomDown}
							isRotatable={props.isRotatable}
							isResizable={props.isResizable}
							metaKey={metaKey}
							cursorSlice={getCursorSlice(
								(Math.round(currentRotation.z / 45) + rotationClasses.length + 2) %
									rotationClasses.length
							)}
						/>
						<HandleLeft
							onMouseDown={metaKey ? handleMouseDown : setLeftDown}
							isRotatable={props.isRotatable}
							isResizable={props.isResizable}
							metaKey={metaKey}
							cursorSlice={getCursorSlice(
								(Math.round(currentRotation.z / 45) + rotationClasses.length + 4) %
									rotationClasses.length
							)}
						/>
						<HandleTopRight
							onMouseDown={metaKey ? handleMouseDown : setTopRightDown}
							isRotatable={props.isRotatable}
							isResizable={props.isResizable}
							metaKey={metaKey}
							cursorSlice={getCursorSlice(
								(Math.round(currentRotation.z / 45) + rotationClasses.length + 7) %
									rotationClasses.length
							)}
						/>
						<HandleBottomRight
							onMouseDown={metaKey ? handleMouseDown : setBottomRightDown}
							isRotatable={props.isRotatable}
							isResizable={props.isResizable}
							metaKey={metaKey}
							cursorSlice={getCursorSlice(
								(Math.round(currentRotation.z / 45) + rotationClasses.length + 1) %
									rotationClasses.length
							)}
						/>
						<HandleBottomLeft
							onMouseDown={metaKey ? handleMouseDown : setBottomLeftDown}
							isRotatable={props.isRotatable}
							isResizable={props.isResizable}
							metaKey={metaKey}
							cursorSlice={getCursorSlice(
								(Math.round(currentRotation.z / 45) + rotationClasses.length + 3) %
									rotationClasses.length
							)}
						/>
						<HandleTopLeft
							onMouseDown={metaKey ? handleMouseDown : setTopLeftDown}
							isRotatable={props.isRotatable}
							isResizable={props.isResizable}
							metaKey={metaKey}
							cursorSlice={getCursorSlice(
								(Math.round(currentRotation.z / 45) + rotationClasses.length + 5) %
									rotationClasses.length
							)}
						/>
					</Handles>
				)}
			</Wrapper>
		);
	}
);

Box.defaultProps = {
	as: "div",
	shouldSnap: [],
	position: {
		x: 0,
		y: 0
	},
	rotation: {
		x: 0,
		y: 0,
		z: 0
	},
	size: {
		height: "auto",
		width: "auto"
	},
	scale: 1
};
