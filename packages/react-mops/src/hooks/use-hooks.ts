import React from "react";
import {rotationCursors} from "../cursors";
import {to360} from "../utils";

/**
 *
 */
export const useMeta = () => {
	const [metaKey, setMetaKey] = React.useState(false);
	const handleKeyDown = React.useCallback(
		(e: KeyboardEvent) => {
			if (e.key === "Meta") {
				setMetaKey(true);
			}
		},
		[setMetaKey]
	);

	const handleKeyUp = React.useCallback(
		(e: KeyboardEvent) => {
			if (e.key === "Meta") {
				setMetaKey(false);
			}
		},
		[setMetaKey]
	);

	const handleFocus = React.useCallback(() => {
		setMetaKey(false);
	}, [setMetaKey]);

	React.useEffect(() => {
		window.addEventListener("focus", handleFocus);
		window.addEventListener("blur", handleFocus);
		return () => {
			window.removeEventListener("focus", handleFocus);
			window.removeEventListener("blur", handleFocus);
		};
	}, [handleFocus]);

	React.useEffect(() => {
		window.addEventListener("keydown", handleKeyDown);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [handleKeyDown]);

	React.useEffect(() => {
		window.addEventListener("keyup", handleKeyUp);
		return () => {
			window.removeEventListener("keyup", handleKeyUp);
		};
	}, [handleKeyUp]);
	return metaKey;
};
export const useCursorSlice = currentRotation =>
	React.useCallback(
		n => {
			return (Math.round(to360(currentRotation.z) / 45) + n) % rotationCursors.length;
		},
		[currentRotation]
	);
export const useHandler = (handler, {currentSize, currentPosition, currentRotation}) =>
	React.useCallback(
		() =>
			handler &&
			handler({position: currentPosition, rotation: currentRotation, size: currentSize}),
		[handler, currentSize, currentPosition, currentRotation]
	);
export const useBoxStyle = (currentPosition, currentRotation, currentSize) =>
	React.useMemo(
		() => ({
			...currentSize,
			transform: `
				translate3d(${currentPosition.x}px, ${currentPosition.y}px, 0)
				translate3d(-50%, -50%, 0) rotate3d(0, 0, 1, ${currentRotation.z}deg)
			`
		}),
		[currentPosition, currentRotation, currentSize]
	);
export const useLoaded = setLoaded =>
	React.useEffect(() => {
		setLoaded(true);
	}, [setLoaded]);
export const useInitialSize = ({contentRef, setInitialSize, setSize}) =>
	React.useEffect(() => {
		if (contentRef && contentRef.current) {
			const {clientHeight: height, clientWidth: width} = contentRef.current;
			setSize({
				height,
				width
			});
			setInitialSize({
				height,
				width
			});
		}
	}, [setSize, setInitialSize]);
export const useHandlers = ({
	currentPosition,
	currentRotation,
	currentSize,
	onDrag,
	onDragStart,
	onDragEnd,
	onResize,
	onResizeStart,
	onResizeEnd,
	onRotate,
	onRotateStart,
	onRotateEnd
}) => {
	const handleDrag = useHandler(onDrag, {currentPosition, currentRotation, currentSize});
	const handleDragStart = useHandler(onDragStart, {
		currentPosition,
		currentRotation,
		currentSize
	});
	const handleDragEnd = useHandler(onDragEnd, {
		currentPosition,
		currentRotation,
		currentSize
	});

	const handleResize = useHandler(onResize, {currentPosition, currentRotation, currentSize});
	const handleResizeStart = useHandler(onResizeStart, {
		currentPosition,
		currentRotation,
		currentSize
	});
	const handleResizeEnd = useHandler(onResizeEnd, {
		currentPosition,
		currentRotation,
		currentSize
	});

	const handleRotate = useHandler(onRotate, {currentPosition, currentRotation, currentSize});
	const handleRotateStart = useHandler(onRotateStart, {
		currentPosition,
		currentRotation,
		currentSize
	});
	const handleRotateEnd = useHandler(onRotateEnd, {
		currentPosition,
		currentRotation,
		currentSize
	});

	return {
		handleDrag,
		handleDragEnd,
		handleDragStart,
		handleResize,
		handleResizeEnd,
		handleResizeStart,
		handleRotate,
		handleRotateEnd,
		handleRotateStart
	};
};
