import React from "react";

export const listenRR = ({
	currentSize,
	currentPosition,
	currentRotation,
	loaded,
	isDown,
	isTopDown,
	isRightDown,
	isBottomDown,
	isLeftDown,
	isTopLeftDown,
	isTopRightDown,
	isBottomLeftDown,
	isBottomRightDown,
	handleDrag,
	handleResize,
	isRotationDown,
	handleRotate
}) =>
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
