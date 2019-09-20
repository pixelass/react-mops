import React from "react";

export const useDrag = ({loaded, isDown, handleDragStart, handleDragEnd}) =>
	React.useEffect(() => {
		if (loaded) {
			if (isDown) {
				handleDragStart();
			} else {
				handleDragEnd();
			}
		}
	}, [isDown]);
export const useDown = ({
	isRotationDown,
	isTopDown,
	isRightDown,
	isBottomDown,
	isLeftDown,
	isTopLeftDown,
	isTopRightDown,
	isBottomLeftDown,
	isBottomRightDown,
	loaded,
	isDown,
	handleDragStart,
	handleDragEnd,
	handleResizeStart,
	handleRotateStart,
	handleRotateEnd,
	handleResizeEnd,
	metaKey
}) => {
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
};
