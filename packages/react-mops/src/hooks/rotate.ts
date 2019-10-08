import React from "react";
import {Mops} from "../types";
import {steps as toStep, to360} from "../utils";
import {useRotation} from "./rotation";

interface Props {
	steps?: boolean;
	step: number;
	deg?: number;
	onRotateEnd?: (o: Partial<Mops.BoundingBox>) => void;
	onRotateStart?: (o: Partial<Mops.BoundingBox>) => void;
	onRotate?: (o: Partial<Mops.BoundingBox>) => void;
}

export const useRotate = (
	initialState: number = 0,
	{ steps, step = 15, onRotateEnd, onRotate, onRotateStart}: Props
) => {
	const ref = React.useRef();
	const [initialAngle, setInitialAngle] = React.useState(initialState);
	const [angle, setAngle] = React.useState(initialAngle);
	const handleRotate = React.useCallback(
		d => {
			const newAngle = to360(toStep(initialAngle + d, step && steps ? step : 1));
			setAngle(newAngle);
			if (onRotate) {
				onRotate({rotation: {x: 0, y: 0, z: newAngle}});
			}
		},
		[step, steps, setAngle, initialAngle]
	);
	const handleRotateEnd = React.useCallback(
		d => {
			const newAngle = to360(toStep(initialAngle + d, step && steps ? step : 1));
			setAngle(newAngle);
			setInitialAngle(newAngle);
			if (onRotateEnd) {
				onRotateEnd({rotation: {x: 0, y: 0, z: newAngle}});
			}
		},
		[step, steps, setAngle, initialAngle, setInitialAngle, onRotateEnd]
	);
	const handleRotateStart = React.useCallback(() => {
		if (onRotateStart) {
			onRotateStart({rotation: {x: 0, y: 0, z: initialAngle}});
		}
	}, [onRotateStart]);
	const [, methods] = useRotation(ref.current, {
		onRotate: handleRotate,
		onRotateEnd: handleRotateEnd,
		onRotateStart: handleRotateStart
	});
	return [angle, {...methods, ref}] as [
		number,
		{
			ref: React.Ref<HTMLElement>;
			onMouseDown: (event: React.MouseEvent) => void;
			onTouchStart: (event: React.TouchEvent) => void;
		}
	];
};
