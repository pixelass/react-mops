import React from "react";
import {BoundingBox, Content, Handle, Handles, PropProvider, Wrapper} from "./elements";
import {
	listenRR,
	useCursorSlice,
	useDown,
	useDrag,
	useHandleMouse,
	useHandleMouseEvent,
	useHandlers,
	useHandles,
	useHandlesDown,
	useInitialSize,
	useLoaded,
	useMeta,
	useWithCornerHandle,
	useWithDown,
	useWithHandle
} from "./hooks";
import {Mops} from "./types";
import {getBoundingBox} from "./utils";

export const Box: React.RefForwardingComponent<
	HTMLElement,
	Mops.BoxProps & Mops.GuidesContext
> = React.forwardRef(
	(
		{
			as,
			children,
			className,
			drawBoundingBox,
			drawBox,
			isResizable,
			isRotatable,
			isDraggable,
			fullHandles,
			marker,
			minHeight,
			minWidth,
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
			showGuides,
			hideGuides,
			updateGuide,
			addGuides,
			removeGuides,
			guides,
			guideRequests,
			shouldSnap,
			size,
			style,
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
		const [currentRotation, setRotation] = React.useState<Mops.RotationModel>(initialRotation);
		const [additionalAngle, setAdditionalAngle] = React.useState<Mops.RotationModel>(rotation);
		const metaKey = useMeta();
		const {
			handleDrag,
			handleDragEnd,
			handleDragStart,
			handleResize,
			handleResizeEnd,
			handleResizeStart,
			handleRotate,
			handleRotateEnd,
			handleRotateStart
		} = useHandlers({
			currentPosition,
			currentRotation,
			currentSize,
			onDrag,
			onDragEnd,
			onDragStart,
			onResize,
			onResizeEnd,
			onResizeStart,
			onRotate,
			onRotateEnd,
			onRotateStart
		});
		const withHandle = useWithHandle({
			contentRef,
			currentPosition,
			currentRotation,
			initialPosition,
			initialSize,
			isResizable,
			minHeight,
			minWidth,
			scale,
			setInitialPosition,
			setInitialSize,
			setPosition,
			setSize
		});

		// const getLimit = React.useCallback(
		// 	(radius, angle) => {
		// 		const {x, y} = polarToCartesian(angle + initialRotation.z);
		// 		return {
		// 			x: (n: number) => chooseFn(x)(initialPosition.x + x * radius, n),
		// 			y: (n: number) => chooseFn(y)( initialPosition.y + y * radius, n)
		// 		};
		// 	},
		// 	[initialPosition, initialRotation]
		// );
		// const diff = React.useMemo(
		// 	() => ({
		// 		x: (initialSize.width - minWidth) / 2,
		// 		y: (initialSize.height - minHeight) / 2
		// 	}),
		// 	[initialSize, minHeight, minWidth]
		// );
		// const limitLeft = React.useMemo(() => getLimit(diff.x, 0), [diff, getLimit]);
		// const limitTop = React.useMemo(() => getLimit(diff.y, 90), [diff, getLimit]);
		// const limitRight = React.useMemo(() => getLimit(diff.x, 180), [diff, getLimit]);
		// const limitBottom = React.useMemo(() => getLimit(diff.y, 270), [diff, getLimit]);
		// const limitTopLeft = React.useMemo(() => {
		// 	const distance = getHypotenuse(diff.y, diff.x);
		// 	const angle = atan2(diff.y, diff.x);
		// 	return getLimit(distance, angle);
		// }, [diff, getLimit]);

		const withCornerHandle = useWithCornerHandle({
			currentRotation,
			initialPosition,
			initialSize,
			withHandle
		});

		const {
			isBottomDown,
			isBottomLeftDown,
			isBottomRightDown,
			isLeftDown,
			isRightDown,
			isTopDown,
			isTopLeftDown,
			isTopRightDown,
			setBottomDown,
			setBottomLeftDown,
			setBottomRightDown,
			setLeftDown,
			setRightDown,
			setTopDown,
			setTopLeftDown,
			setTopRightDown
		} = useHandlesDown({
			currentRotation,
			initialPosition,
			initialSize,
			// limitBottom,
			// limitLeft,
			// limitRight,
			// limitTop,
			// limitTopLeft,
			withCornerHandle,
			withHandle
		});
		const handleMouse = useHandleMouse({
			addGuides,
			currentRotation,
			currentSize,
			guideRequests,
			guides,
			hideGuides,
			initialPosition,
			removeGuides,
			shouldSnap,
			showGuides,
			updateGuide
		});
		const handleMouseEvent = useHandleMouseEvent({
			additionalAngle,
			contentRef,
			initialRotation,
			isRotatable
		});
		const {handleRotationDown, isDown, isRotationDown, setDown} = useWithDown({
			handleMouse,
			handleMouseEvent,
			hideGuides,
			scale,
			setAdditionalAngle,
			setInitialPosition,
			setInitialRotation,
			setPosition,
			setRotation
		});
		const getCursorSlice = useCursorSlice(currentRotation);
		const handles = useHandles({
			setBottomDown,
			setBottomLeftDown,
			setBottomRightDown,
			setLeftDown,
			setRightDown,
			setTopDown,
			setTopLeftDown,
			setTopRightDown
		});
		const wrapperStyle = {
			...currentSize,
			transform: `translate3d(${currentPosition.x}px, ${currentPosition.y}px, 0) translate3d(-50%, -50%, 0)`
		};
		const boxStyle = {
			...getBoundingBox({
				...currentSize,
				angle: currentRotation.z
			})
		};
		const contentStyle = {
			...currentSize,
			transform: `rotate3d(0, 0, 1, ${currentRotation.z}deg)`
		};
		useInitialSize({contentRef, setInitialSize, setSize});
		listenRR({
			currentPosition,
			currentRotation,
			currentSize,
			handleDrag,
			handleResize,
			handleRotate,
			isBottomDown,
			isBottomLeftDown,
			isBottomRightDown,
			isDown,
			isLeftDown,
			isRightDown,
			isRotationDown,
			isTopDown,
			isTopLeftDown,
			isTopRightDown,
			loaded
		});
		useDown({
			handleDragEnd,
			handleDragStart,
			handleResizeEnd,
			handleResizeStart,
			handleRotateEnd,
			handleRotateStart,
			isBottomDown,
			isBottomLeftDown,
			isBottomRightDown,
			isDown,
			isLeftDown,
			isRightDown,
			isRotationDown,
			isTopDown,
			isTopLeftDown,
			isTopRightDown,
			loaded,
			metaKey
		});
		useDrag({loaded, isDown, handleDragEnd, handleDragStart});
		useLoaded(setLoaded);
		return (
			<Wrapper
				ref={ref as React.Ref<HTMLElement>}
				as={as}
				style={{...(style || {}), ...wrapperStyle}}
				isDown={isDown}
				className={className}>
				<BoundingBox style={boxStyle} draw={drawBoundingBox} />
				<Content
					ref={contentRef as React.Ref<HTMLDivElement>}
					style={contentStyle}
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
						<Handles style={contentStyle} draw={drawBox}>
							{handles.map(handle => (
								<Handle
									key={handle.variation}
									{...handle}
									marker={marker}
									full={fullHandles}
								/>
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
	drawBoundingBox: false,
	drawBox: true,
	minHeight: 40,
	minWidth: 40,
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
