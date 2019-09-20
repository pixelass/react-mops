import React from "react";
import {rotationClasses, rotationCursors} from "./cursors";
import {Content, Handle, Handles, PropProvider, Wrapper} from "./elements";
import {useHandle, useMeta, useMouseMove, useMouseMoveEvent} from "./hooks";
import {Mops} from "./types";
import {coordinatesToDeg, to360, withAlt, withAspectRatio, withRotation} from "./utils";

export const Box: React.ForwardRefExoticComponent<Mops.BoxProps> = React.forwardRef(
	(
		{
			as,
			children,
			isResizable,
			isRotatable,
			isDraggable,
			onDrag,
			onDragStart,
			onDragEnd,
			onResize,
			onResizeStart,
			onResizeEnd,
			onRotate,
			onRotateStart,
			onRotateEnd,
			position,
			rotation,
			scale,
			shouldSnap,
			size,
			...props
		},
		ref
	) => {
		const contentRef = React.useRef<HTMLDivElement>();
		const [loaded, setLoaded] = React.useState(false);
		const [initialSize, setInitialSize] = React.useState<Mops.SizeModel>(
			size as Mops.SizeModel
		);
		const [currentSize, setSize] = React.useState<Mops.SizeModel>(initialSize);
		const [initialPosition, setInitialPosition] = React.useState<Mops.PositionModel>(position);
		const [currentPosition, setPosition] = React.useState<Mops.PositionModel>(initialPosition);
		const [initialRotation, setInitialRotation] = React.useState<Mops.RotationModel>(rotation);
		const [additionalAngle, setAdditionalAngle] = React.useState<Mops.RotationModel>(rotation);
		const [currentRotation, setRotation] = React.useState<Mops.RotationModel>(initialRotation);
		const metaKey = useMeta();

		const handleDrag = React.useCallback(
			() =>
				onDrag &&
				onDrag({position: currentPosition, rotation: currentRotation, size: currentSize}),
			[onDrag, currentSize, currentPosition, currentRotation]
		);

		const handleDragStart = React.useCallback(
			() =>
				onDragStart &&
				onDragStart({
					position: currentPosition,
					rotation: currentRotation,
					size: currentSize
				}),
			[onDragStart, currentSize, currentPosition, currentRotation]
		);

		const handleDragEnd = React.useCallback(
			() =>
				onDragEnd &&
				onDragEnd({
					position: currentPosition,
					rotation: currentRotation,
					size: currentSize
				}),
			[onDragEnd, currentSize, currentPosition, currentRotation]
		);

		const handleResize = React.useCallback(
			() =>
				onResize &&
				onResize({position: currentPosition, rotation: currentRotation, size: currentSize}),
			[onResize, currentSize, currentPosition, currentRotation]
		);

		const handleResizeStart = React.useCallback(
			() =>
				onResizeStart &&
				onResizeStart({
					position: currentPosition,
					rotation: currentRotation,
					size: currentSize
				}),
			[onResizeStart, currentSize, currentPosition, currentRotation]
		);

		const handleResizeEnd = React.useCallback(
			() =>
				onResizeEnd &&
				onResizeEnd({
					position: currentPosition,
					rotation: currentRotation,
					size: currentSize
				}),
			[onResizeEnd, currentSize, currentPosition, currentRotation]
		);

		const handleRotate = React.useCallback(
			() =>
				onRotate &&
				onRotate({position: currentPosition, rotation: currentRotation, size: currentSize}),
			[onRotate, currentSize, currentPosition, currentRotation]
		);

		const handleRotateStart = React.useCallback(
			() =>
				onRotateStart &&
				onRotateStart({
					position: currentPosition,
					rotation: currentRotation,
					size: currentSize
				}),
			[onRotateStart, currentSize, currentPosition, currentRotation]
		);

		const handleRotateEnd = React.useCallback(
			() =>
				onRotateEnd &&
				onRotateEnd({
					position: currentPosition,
					rotation: currentRotation,
					size: currentSize
				}),
			[onRotateEnd, currentSize, currentPosition, currentRotation]
		);

		const withHandle = React.useCallback(
			({handleSize, handlePosition}) => {
				return useHandle({
					contentRef: contentRef as React.RefObject<HTMLElement>,
					handlePosition: ({x, y}, altKey) => state => {
						if (!isResizable) {
							return state;
						}
						const positionState = handlePosition({x, y}, altKey);
						return typeof positionState === "function" ? positionState(state) : positionState;
					},
					handleSize: ({x, y}, altKey, shiftKey) => state => {
						if (!isResizable) {
							return state;
						}
						const sizeState = handleSize({x, y}, altKey, shiftKey);
						return typeof sizeState === "function" ? sizeState(state) : sizeState;
					},
					rotation: currentRotation,
					scale,
					setInitialPosition,
					setInitialSize,
					setPosition,
					setSize
				});
			},
			[setInitialPosition, setInitialSize, setPosition, setSize, currentRotation, scale, contentRef]
		);

		const withCornerHandle = React.useCallback(
			({getPositionDiff, handleSize}) =>
				withHandle({
					handlePosition: ({x, y}, altKey, shiftKey) => state => {
						if (altKey) {
							return state;
						}
						const e = withRotation(x, 0, currentRotation.z);
						const d = getPositionDiff({x, y}, e, altKey, shiftKey);
						return {
							x: initialPosition.x - d.x / 2 + e.x / 2,
							y: initialPosition.y + d.y / 2 - e.y / 2
						};
					},
					handleSize
				}),
			[withHandle, currentRotation, initialPosition]
		);

		const [isTopDown, setTopDown] = withHandle({
			handlePosition: ({x, y}, altKey) => {
				const d = withRotation(0, y, currentRotation.z);
				return {
					x: initialPosition.x - (altKey ? 0 : d.x / 2),
					y: initialPosition.y + (altKey ? 0 : d.y / 2)
				};
			},
			handleSize: ({x, y}, altKey, shiftKey) => state => ({
				height: initialSize.height - withAlt(y, altKey),
				width: shiftKey
					? withAspectRatio(initialSize.height - withAlt(y, altKey), initialSize)
					: state.width
			})
		});

		const [isRightDown, setRightDown] = withHandle({
			handlePosition: ({x, y}, altKey) => {
				const d = withRotation(x, 0, currentRotation.z);
				return {
					x: initialPosition.x + (altKey ? 0 : d.x / 2),
					y: initialPosition.y - (altKey ? 0 : d.y / 2)
				};
			},
			handleSize: ({x, y}, altKey, shiftKey) => state => ({
				height: shiftKey
					? withAspectRatio(initialSize.width + withAlt(x, altKey), initialSize, true)
					: state.height,
				width: initialSize.width + withAlt(x, altKey)
			})
		});

		const [isBottomDown, setBottomDown] = withHandle({
			handlePosition: ({x, y}, altKey) => {
				const d = withRotation(0, y, currentRotation.z);
				return {
					x: initialPosition.x - (altKey ? 0 : d.x / 2),
					y: initialPosition.y + (altKey ? 0 : d.y / 2)
				};
			},
			handleSize: ({x, y}, altKey, shiftKey) => state => ({
				height: initialSize.height + withAlt(y, altKey),
				width: shiftKey
					? withAspectRatio(initialSize.height + withAlt(y, altKey), initialSize)
					: state.width
			})
		});

		const [isLeftDown, setLeftDown] = withHandle({
			handlePosition: ({x, y}, altKey) => {
				const d = withRotation(x, 0, currentRotation.z);
				return {
					x: initialPosition.x + (altKey ? 0 : d.x / 2),
					y: initialPosition.y - (altKey ? 0 : d.y / 2)
				};
			},
			handleSize: ({x, y}, altKey, shiftKey) => state => ({
				height: shiftKey
					? withAspectRatio(initialSize.width - withAlt(x, altKey), initialSize, true)
					: state.height,
				width: initialSize.width - withAlt(x, altKey)
			})
		});

		const [isTopLeftDown, setTopLeftDown] = withCornerHandle({
			getPositionDiff: ({x, y}, e, altKey, shiftKey) =>
				withRotation(
					0,
					shiftKey
						? initialSize.height -
								withAspectRatio(initialSize.width - x, initialSize, true)
						: y,
					currentRotation.z
				),
			handleSize: ({x, y}, altKey, shiftKey) => ({
				height: shiftKey
					? withAspectRatio(initialSize.width - withAlt(x, altKey), initialSize, true)
					: initialSize.height - withAlt(y, altKey),
				width: initialSize.width - withAlt(x, altKey)
			})
		});

		const [isTopRightDown, setTopRightDown] = withCornerHandle({
			getPositionDiff: ({x, y}, altKey, shiftKey) =>
				withRotation(
					0,
					shiftKey
						? initialSize.height -
								withAspectRatio(initialSize.width + x, initialSize, true)
						: y,
					currentRotation.z
				),
			handleSize: ({x, y}, altKey, shiftKey) => ({
				height: shiftKey
					? withAspectRatio(initialSize.width + withAlt(x, altKey), initialSize, true)
					: initialSize.height - withAlt(y, altKey),
				width: initialSize.width + withAlt(x, altKey)
			})
		});

		const [isBottomLeftDown, setBottomLeftDown] = withCornerHandle({
			getPositionDiff: ({x, y}, altKey, shiftKey) =>
				withRotation(
					0,
					shiftKey
						? initialSize.height -
								withAspectRatio(initialSize.width + x, initialSize, true)
						: y,
					currentRotation.z
				),
			handleSize: ({x, y}, altKey, shiftKey) => ({
				height: shiftKey
					? withAspectRatio(initialSize.width - withAlt(x, altKey), initialSize, true)
					: initialSize.height + withAlt(y, altKey),
				width: initialSize.width - withAlt(x, altKey)
			})
		});

		const [isBottomRightDown, setBottomRightDown] = withCornerHandle({
			getPositionDiff: ({x, y}, altKey, shiftKey) =>
				withRotation(
					0,
					shiftKey
						? initialSize.height -
								withAspectRatio(initialSize.width - x, initialSize, true)
						: y,
					currentRotation.z
				),
			handleSize: ({x, y}, altKey, shiftKey) => ({
				height: shiftKey
					? withAspectRatio(initialSize.width + withAlt(x, altKey), initialSize, true)
					: initialSize.height + withAlt(y, altKey),
				width: initialSize.width + withAlt(x, altKey)
			})
		});
		const [isDown, setDown] = useMouseMove(
			({x, y}) => {
				const newPosition = {
					x: initialPosition.x + x,
					y: initialPosition.y + y
				};
				const withSnapLogic = shouldSnap.reduce(
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
				const withSnapLogic = shouldSnap.reduce(
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
			scale as number
		);
		const [isRotationDown, handleRotationDown] = useMouseMoveEvent(
			(event: MouseEvent) => {
				if (!isRotatable) {
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
				if (!isRotatable) {
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
				if (!isRotatable) {
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

		const getCursorSlice = React.useCallback(
			n => {
				return (
					(Math.round(to360(currentRotation.z) / 45) +
						n) %
					rotationCursors.length
				);
			},
			[currentRotation]
		);

		const style = React.useMemo(
			() => ({
				...currentSize,
				transform: `
				translate3d(${currentPosition.x}px, ${currentPosition.y}px, 0)
				translate3d(-50%, -50%, 0) rotate3d(0, 0, 1, ${currentRotation.z}deg)
			`
			}),
			[currentPosition, currentRotation, currentSize]
		);

		const handles: Mops.HandleProps[] = React.useMemo(
			() => [
				{
					onMouseDown: setTopDown,
					variation: "n"
				},
				{
					onMouseDown: setRightDown,
					variation: "e"
				},
				{
					onMouseDown: setBottomDown,
					variation: "s"
				},
				{
					onMouseDown: setLeftDown,
					variation: "w"
				},
				{
					onMouseDown: setTopRightDown,
					variation: "ne"
				},
				{
					onMouseDown: setBottomRightDown,
					variation: "se"
				},
				{
					onMouseDown: setBottomLeftDown,
					variation: "sw"
				},
				{
					onMouseDown: setTopLeftDown,
					variation: "nw"
				}
			],
			[
				setBottomRightDown,
				setTopLeftDown,
				setBottomLeftDown,
				setTopRightDown,
				setLeftDown,
				setBottomDown,
				setRightDown,
				setTopDown
			]
		);

		return (
			<Wrapper ref={ref as React.Ref<HTMLElement>} as={as} style={style} isDown={isDown}>
				<Content
					ref={contentRef as React.Ref<HTMLDivElement>}
					onMouseDown={!metaKey && isDraggable ? setDown : undefined}>
					{children}
				</Content>
				{(isResizable || isRotatable) && (
					<PropProvider
						value={{
							getCursorSlice,
							handleRotationDown,
							isDraggable,
							isResizable,
							isRotatable,
							metaKey
						}}>
						<Handles>
							{handles.map(handle => (
								<Handle key={handle.variation} {...handle} />
							))}
						</Handles>
					</PropProvider>
				)}
			</Wrapper>
		);
	}
);

Box.defaultProps = {
	as: "div",
	position: {
		x: 0,
		y: 0
	},
	rotation: {
		x: 0,
		y: 0,
		z: 0
	},
	scale: 1,
	shouldSnap: [],
	size: {
		height: "auto",
		width: "auto"
	}
};
