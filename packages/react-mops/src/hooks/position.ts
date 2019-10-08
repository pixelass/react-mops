import React from "react";
import {useOffset} from "./offset";

interface Position {
	x: number;
	y: number;
}

interface PositionProps {
	initialPosition: Position;
	setInitialPosition: React.Dispatch<React.SetStateAction<Position>>;
	setPosition: React.Dispatch<React.SetStateAction<Position>>;
	onMouseDown?: (event: React.MouseEvent) => void;
	onTouchStart?: (event: React.TouchEvent) => void;
}

interface Props {
	onDragStart?: (o: any) => void;
	onDragEnd?: (o: any) => void;
	onDrag?: (o: any) => void;
}

export const usePosition = (
	initialState: Position = {x: 0, y: 0},
	{ onDragEnd, onDragStart, onDrag}: Props
) => {
	const [initialPosition, setInitialPosition] = React.useState<Position>(initialState);
	const [position, setPosition] = React.useState<Position>(initialPosition);
	const handleDrag = React.useCallback(
		o => {
			const newPosition = {
				x: initialPosition.x + o.x,
				y: initialPosition.y + o.y
			};
			setPosition(newPosition);
			if (onDrag) {
				onDrag({position: newPosition});
			}
		},
		[setPosition, initialPosition, onDrag]
	);
	const handleDragEnd = React.useCallback(
		o => {
			const newPosition = {
				x: initialPosition.x + o.x,
				y: initialPosition.y + o.y
			};
			setPosition(newPosition);
			setInitialPosition(newPosition);
			if (onDragEnd) {
				onDragEnd({position: newPosition});
			}
		},
		[setPosition, setInitialPosition, initialPosition, onDragEnd]
	);
	const handleDragStart = React.useCallback(() => {
		if (onDragStart) {
			onDragStart({position: initialPosition});
		}
	}, [onDragStart]);
	const [, methods] = useOffset({
		onDrag: handleDrag,
		onDragEnd: handleDragEnd,
		onDragStart: handleDragStart
	});
	return [position, {...methods, initialPosition, setInitialPosition, setPosition}] as [
		Position,
		PositionProps
	];
};
