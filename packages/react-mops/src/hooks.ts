import {Mops} from "./types";
import React from "react";
import {coordinatesToDeg, withRotation} from "./utils";
import {resizeClasses, rotationClasses} from "./cursors";

/**
 * Mousemove hook
 * @param {Mops.MouseHandler} onMouseUp
 * @param {Mops.MouseHandler} onMouseMove
 * @param {number} scale
 * @param {React.RefObject<HTMLElement>} [contentRef]
 * @param {Mops.RotationModel} [rotation]
 */
export const useMouseMove = (
	onMouseUp: Mops.MouseHandler,
	onMouseMove: Mops.MouseHandler,
	scale: number,
	contentRef?: React.RefObject<HTMLElement>,
	rotation?: Mops.RotationModel
) => {
	const [isDown, setDown] = React.useState(false);
	const [initialPosition, setInitialPosition] = React.useState<Mops.PositionModel>({
		x: 0,
		y: 0
	});

	const handleMouseUp = React.useCallback(
		(event: MouseEvent) => {
			if (isDown) {
				event.preventDefault();
				const newPosition = {
					x: (event.clientX - initialPosition.x) / scale,
					y: (event.clientY - initialPosition.y) / scale
				};
				const rotatedPosition = rotation
					? withRotation(newPosition.x, newPosition.y, rotation.z)
					: newPosition;
				setDown(false);
				onMouseUp(rotatedPosition, event.altKey, event.shiftKey, event);
			}
		},
		[setDown, onMouseUp]
	);

	const handleMouseMove = React.useCallback(
		(event: MouseEvent) => {
			if (isDown) {
				event.preventDefault();
				const newPosition = {
					x: (event.clientX - initialPosition.x) / scale,
					y: (event.clientY - initialPosition.y) / scale
				};
				const rotatedPosition = rotation
					? withRotation(newPosition.x, newPosition.y, rotation.z)
					: newPosition;
				onMouseMove(rotatedPosition, event.altKey, event.shiftKey, event);
			}
		},
		[onMouseMove]
	);

	React.useEffect(() => {
		document.addEventListener("mouseleave", handleMouseUp);
		window.addEventListener("mouseup", handleMouseUp);
		return () => {
			document.removeEventListener("mouseleave", handleMouseUp);
			window.removeEventListener("mouseup", handleMouseUp);
		};
	}, [handleMouseUp]);

	React.useEffect(() => {
		window.addEventListener("mousemove", handleMouseMove);
		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
		};
	}, [handleMouseMove]);

	const handleDown = React.useCallback(
		(event: React.MouseEvent<HTMLElement>) => {
			if ((event.target as HTMLElement).tagName !== "INPUT" && event.button !== 2) {
				event.preventDefault();
				setDown(true);
				setInitialPosition({x: event.clientX, y: event.clientY});
			}
		},
		[contentRef, setInitialPosition, setDown]
	);

	return [isDown, handleDown] as [boolean, (e: React.MouseEvent<HTMLElement>) => void];
};

export interface UseHandleProps {
	setSize: (s: Mops.SizeModel | ((state: Mops.SizeModel) => Mops.SizeModel)) => void;
	setInitialSize: (s: Mops.SizeModel | ((state: Mops.SizeModel) => Mops.SizeModel)) => void;
	setPosition: (
		p: Mops.PositionModel | ((state: Mops.PositionModel) => Mops.PositionModel)
	) => void;
	setInitialPosition: (
		p: Mops.PositionModel | ((state: Mops.PositionModel) => Mops.PositionModel)
	) => void;
	handleSize: (
		p: Mops.PositionModel,
		altKey: boolean,
		shiftKey: boolean
	) => (s: Mops.SizeModel) => Mops.SizeModel;
	handlePosition: (
		p: Mops.PositionModel,
		altKey: boolean,
		shiftKey: boolean
	) => (p: Mops.PositionModel) => Mops.PositionModel;
	scale: number;
	rotation?: Mops.RotationModel;
	contentRef?: React.RefObject<HTMLElement>;
}

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
}: UseHandleProps) => {
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

/**
 *
 * @param onMouseUp
 * @param onMouseMove
 * @param onMouseDown
 */
export const useMouseMoveEvent = (
	onMouseUp: (event: MouseEvent) => void,
	onMouseMove: (event: MouseEvent) => void,
	onMouseDown: (event: React.MouseEvent<HTMLElement>) => void
) => {
	const [isDown, setDown] = React.useState(false);
	const handleMouseUp = React.useCallback(
		(event: MouseEvent) => {
			if (isDown) {
				event.preventDefault();
				setDown(false);
				onMouseUp(event);
			}
		},
		[onMouseUp, setDown]
	);
	const handleFocus = React.useCallback(() => {
		setDown(false);
	}, [setDown]);
	const handleMouseMove = React.useCallback(
		(event: MouseEvent) => {
			if (isDown) {
				event.preventDefault();
				onMouseMove(event);
			}
		},
		[onMouseMove]
	);

	React.useEffect(() => {
		window.addEventListener("focus", handleFocus);
		window.addEventListener("blur", handleFocus);
		return () => {
			document.removeEventListener("focus", handleFocus);
			document.removeEventListener("blur", handleFocus);
		};
	}, [handleFocus]);

	React.useEffect(() => {
		document.addEventListener("mouseleave", handleMouseUp);
		document.addEventListener("mouseup", handleMouseUp);
		return () => {
			document.removeEventListener("mouseleave", handleMouseUp);
			document.removeEventListener("mouseup", handleMouseUp);
		};
	}, [handleMouseUp]);

	React.useEffect(() => {
		document.addEventListener("mousemove", handleMouseMove);
		return () => {
			document.removeEventListener("mousemove", handleMouseMove);
		};
	}, [handleMouseMove]);

	const handleDown = React.useCallback(
		(event: React.MouseEvent<HTMLElement>) => {
			if ((event.target as HTMLElement).tagName !== "INPUT" && event.button !== 2) {
				event.preventDefault();
				setDown(true);
				onMouseDown(event);
			}
		},
		[onMouseDown, setDown]
	);

	return [isDown, handleDown] as [boolean, (e: React.MouseEvent<HTMLElement>) => void];
};

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
