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
 * @param options.contentRef
 */
export const useHandle = ({
	setSize,
	setInitialSize,
	setPosition,
	setInitialPosition,
	handleSize,
	handlePosition,
	scale,
	rotation,
	contentRef
}: Mops.UseHandleProps) => {
	const [isDown, setDown] = useMouseMove(
		(position: Mops.PositionModel, altKey: boolean, shiftKey: boolean) => {
			setSize(handleSize(position, altKey, shiftKey));
			setInitialSize(handleSize(position, altKey, shiftKey));
			const nextPosition = handlePosition(position, altKey, shiftKey);
			setPosition(nextPosition);
			setInitialPosition(nextPosition);
		},
		(position: Mops.PositionModel, altKey: boolean, shiftKey: boolean) => {
			setSize(handleSize(position, altKey, shiftKey));
			const nextPosition = handlePosition(position, altKey, shiftKey);
			setPosition(nextPosition);
		},
		scale,
		contentRef,
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
	React.useMemo(
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
