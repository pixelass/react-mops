import React from "react";
import {Mops} from "../types";
import {useMouseMove} from "./mouse-event-hooks";

/**
 *
 * @param options
 * @param options.setSize
 * @param options.setInitialSize
 * @param options.setPosition
 * @param options.setInitialPosition
 * @param options.handleSize
 * @param options.handlePosition
 * @param options.scale
 * @param options.rotation
 */
export const useHandle = ({
	setSize,
	setInitialSize,
	setPosition,
	setInitialPosition,
	handleSize,
	handlePosition,
	scale,
	rotation
}: Mops.UseHandleProps) => {
	const [isDown, setDown] = useMouseMove(
		(position: Mops.PositionModel, altKey: boolean, shiftKey: boolean) => {
			const nextSize = handleSize(position, altKey, shiftKey);
			setSize(nextSize);
			setInitialSize(nextSize);
			const nextPosition = handlePosition(position, altKey, shiftKey);
			setPosition(nextPosition);
			setInitialPosition(nextPosition);
		},
		(position: Mops.PositionModel, altKey: boolean, shiftKey: boolean) => {
			const nextSize = handleSize(position, altKey, shiftKey);
			setSize(nextSize);
			const nextPosition = handlePosition(position, altKey, shiftKey);
			setPosition(nextPosition);
		},
		scale,
		rotation
	);
	return [isDown, setDown] as [boolean, (e: React.MouseEvent<HTMLElement>) => void];
};
export const useHandles = ({
	setBottomRightDown,
	setTopLeftDown,
	setBottomLeftDown,
	setTopRightDown,
	setLeftDown,
	setBottomDown,
	setRightDown,
	setTopDown
}): Mops.HandleProps[] =>
	React.useMemo(() => {
		return [
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
		];
	}, [
		setBottomRightDown,
		setTopLeftDown,
		setBottomLeftDown,
		setTopRightDown,
		setLeftDown,
		setBottomDown,
		setRightDown,
		setTopDown
	]);
