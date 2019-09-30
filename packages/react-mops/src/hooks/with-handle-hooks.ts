import React from "react";
import {withAlt, withAspectRatio, withRotation} from "../utils";
import {useHandle} from "./handle-hooks";

export const useWithHandle = (
	{
		setInitialPosition,
		setInitialSize,
		setPosition,
		setSize,
		currentPosition,
		currentRotation,
		initialPosition,
		initialSize,
		scale,
		contentRef,
		isResizable,
		minHeight,
		minWidth
	},
	deps = []
) =>
	React.useCallback(
		({handleSize, handlePosition}) => {
			return useHandle({
				handlePosition: ({x, y}, altKey, shiftKey) => state => {
					if (!isResizable) {
						return state;
					}
					const positionState = handlePosition({x, y}, altKey, shiftKey);
					const {limit, ...nextPosition} =
						typeof positionState === "function" ? positionState(state) : positionState;
					return nextPosition;
					// return {
					// 	x: limit.x(nextPosition.x),
					// 	y: limit.y(nextPosition.y)
					// };
				},
				handleSize: ({x, y}, altKey, shiftKey) => state => {
					if (!isResizable) {
						return state;
					}
					const sizeState = handleSize({x, y}, altKey, shiftKey);
					const nextSize = typeof sizeState === "function" ? sizeState(state) : sizeState;
					const absSize = {
						height: Math.abs(nextSize.height),
						width: Math.abs(nextSize.width)
					};
					return absSize;
					// return {
					// 	height: Math.max(minHeight, absSize.height),
					// 	width: Math.max(minWidth, absSize.width)
					// };
				},
				rotation: currentRotation,
				scale,
				setInitialPosition,
				setInitialSize,
				setPosition,
				setSize
			});
		},
		[
			setInitialPosition,
			setInitialSize,
			setPosition,
			setSize,
			currentPosition,
			currentRotation,
			initialPosition,
			initialSize,
			scale,
			contentRef,
			isResizable,
			minHeight,
			minWidth,
			...deps
		]
	);
export const useWithCornerHandle = ({withHandle, currentRotation, initialPosition, initialSize}) =>
	React.useCallback(
		({getPositionDiff, getSizeDiff, limit}) =>
			withHandle({
				handlePosition: ({x, y}, altKey, shiftKey) => state => {
					if (altKey) {
						return {limit, ...state};
					}
					const dX = getPositionDiff(x);
					const e = withRotation(x, 0, currentRotation.z);
					const d = withRotation(
						0,
						shiftKey
							? initialSize.height -
									withAspectRatio(initialSize.width + dX, initialSize, true)
							: y,
						currentRotation.z
					);
					return {
						limit,
						x: initialPosition.x - d.x / 2 + e.x / 2,
						y: initialPosition.y + d.y / 2 - e.y / 2
					};
				},
				handleSize: ({x, y}, altKey, shiftKey) => {
					const d = getSizeDiff({x, y});
					return {
						height: shiftKey
							? withAspectRatio(
									initialSize.width + withAlt(d.x, altKey),
									initialSize,
									true
							  )
							: initialSize.height + withAlt(d.y, altKey),
						width: initialSize.width + withAlt(d.x, altKey)
					};
				}
			}),
		[withHandle, currentRotation, initialPosition, initialSize]
	);
export const useHandlesDown = ({
	currentRotation,
	initialPosition,
	initialSize,
	// limitLeft,
	// limitRight,
	// limitTop,
	// limitTopLeft,
	// limitBottom,
	withCornerHandle,
	withHandle
}) => {
	const [isTopDown, setTopDown] = withHandle({
		handlePosition: ({x, y}, altKey) => {
			const d = withRotation(0, y, currentRotation.z);
			return {
				// limit: limitTop,
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
				// limit: limitRight,
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
				// limit: limitBottom,
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
				// limit: limitLeft,
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
		getPositionDiff: x => -x,
		getSizeDiff: ({x, y}) => ({x: -x, y: -y})
		// limit: limitTopLeft
	});

	const [isTopRightDown, setTopRightDown] = withCornerHandle({
		getPositionDiff: x => x,
		getSizeDiff: ({x, y}) => ({x, y: -y})
		// limit: {
		// 	x: limitLeft.x,
		// 	y: limitTop.y
		// }
	});

	const [isBottomLeftDown, setBottomLeftDown] = withCornerHandle({
		getPositionDiff: x => x,
		getSizeDiff: ({x, y}) => ({x: -x, y})
		// limit: {
		// 	x: limitLeft.x,
		// 	y: limitBottom.y
		// }
	});

	const [isBottomRightDown, setBottomRightDown] = withCornerHandle({
		getPositionDiff: x => -x,
		getSizeDiff: ({x, y}) => ({x, y})
		// limit: {
		// 	x: limitRight.x,
		// 	y: limitBottom.y
		// }
	});

	return {
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
	};
};
