import React from "react";
import {withAlt, withAspectRatio, withRotation} from "../utils";
import {useHandle} from "./handle-hooks";

export const useWithHandle = (
	{
		setInitialPosition,
		setInitialSize,
		setPosition,
		setSize,
		currentRotation,
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
				contentRef: contentRef as React.RefObject<HTMLElement>,
				handlePosition: ({x, y}, altKey, shiftKey) => state => {
					if (!isResizable) {
						return state;
					}
					// const sizeState = handleSize({x, y}, altKey, shiftKey);
					// const nextSize = typeof sizeState === "function" ? sizeState(state) : sizeState;
					// const finalSize = {
					// 	height: Math.max(minHeight, nextSize.height),
					// 	width: Math.max(minWidth, nextSize.width)
					// }
					// const stopY = finalSize.height === minHeight;
					// const stopX = finalSize.width === minWidth;
					const positionState = handlePosition({x, y}, altKey, shiftKey);
					const nextPosition =
						typeof positionState === "function" ? positionState(state) : positionState;
					return nextPosition;
					// return {
					// 	x: stopY ? state.x : nextPosition.x,
					// 	y: stopX ? state.y : nextPosition.y
					// };
				},
				handleSize: ({x, y}, altKey, shiftKey) => state => {
					if (!isResizable) {
						return state;
					}
					const sizeState = handleSize({x, y}, altKey, shiftKey);
					const nextSize = typeof sizeState === "function" ? sizeState(state) : sizeState;
					return {
						height: Math.max(minHeight, nextSize.height),
						width: Math.max(minWidth, nextSize.width)
					};
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
			currentRotation,
			scale,
			contentRef,
			isResizable,
			...deps
		]
	);
export const useWithCornerHandle = ({withHandle, currentRotation, initialPosition, initialSize}) =>
	React.useCallback(
		({getPositionDiff, getSizeDiff}) =>
			withHandle({
				handlePosition: ({x, y}, altKey, shiftKey) => state => {
					if (altKey) {
						return state;
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
	withCornerHandle,
	withHandle
}) => {
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
		getPositionDiff: x => -x,
		getSizeDiff: ({x, y}) => ({x: -x, y: -y})
	});

	const [isTopRightDown, setTopRightDown] = withCornerHandle({
		getPositionDiff: x => x,
		getSizeDiff: ({x, y}) => ({x, y: -y})
	});

	const [isBottomLeftDown, setBottomLeftDown] = withCornerHandle({
		getPositionDiff: x => x,
		getSizeDiff: ({x, y}) => ({x: -x, y})
	});

	const [isBottomRightDown, setBottomRightDown] = withCornerHandle({
		getPositionDiff: x => -x,
		getSizeDiff: ({x, y}) => ({x, y})
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
