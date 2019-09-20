import React from "react";
import {Content, Handle, Handles, PropProvider, Wrapper} from "./elements";
import {
	listenRR,
	useBoxStyle,
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
			currentRotation,
			isResizable,
			scale,
			setInitialPosition,
			setInitialSize,
			setPosition,
			setSize
		});
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
			withCornerHandle,
			withHandle
		});
		const handleMouse = useHandleMouse({
			currentRotation,
			currentSize,
			initialPosition,
			shouldSnap
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
		const style = useBoxStyle(currentPosition, currentRotation, currentSize);

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
