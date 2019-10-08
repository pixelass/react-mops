import React from "react";
import {Mops} from "./types";

/**
 * @param value
 * @param altKey
 */
export const withAlt = (value: number, altKey: boolean) => (altKey ? value * 2 : value);

/**
 * Determine the aspect-ratio from width and height
 * @param {Mops.SizeModel} size
 * @param {number} size.height
 * @param {number} size.width
 */
const getAspectRatio = ({height, width}: Mops.SizeModel): number => width / height;

/**
 * @param {number} value
 * @param {Mops.SizeModel} size
 * @param {boolean} reverse
 */
export const withAspectRatio = (value: number, size: Mops.SizeModel, reverse?: boolean) =>
	reverse ? value / getAspectRatio(size) : value * getAspectRatio(size);

/**
 * Ensure degrees always ranges from 0 to < 360
 * @param deg
 */
export const to360 = (deg: number): number => (deg + 360) % 360;
export const coordinatesToDeg = (
	position: Mops.PositionModel,
	center: Mops.PositionModel
): number => {
	const x = position.x - center.x;
	const y = position.y - center.y;
	return to360((Math.atan2(y, x) * 180) / Math.PI);
};

export const normalize = n => {
	const rounded = Math.round(n * 1000000000) / 1000000000;
	if (rounded === 0 || rounded === -0) {
		return 0;
	}
	return n;
};

export const polarToCartesian = (deg: number, radius: number = 1): Mops.PositionModel => ({
	x: cos(deg) * radius,
	y: sin(deg) * radius
});

export const cartesianToPolar = ({x, y}: Mops.PositionModel) => ({
	deg: to360(atan2(y, x)),
	radius: getHypotenuse(y, x)
});

/**
 * Convert degrees to radians
 * @param {number} deg
 */
export const degToRad = (deg: number): number => (deg * Math.PI) / 180;

/**
 * Convert radians to degrees
 * @param {number} rad
 */
export const radToDeg = (rad: number): number => (rad * 180) / Math.PI;

/**
 * Determine the hypotenuse of a right triangle given the adjacent and opposite.
 * @param {number} opposite
 * @param {number} adjacent
 */
export const getHypotenuse = (opposite: number, adjacent: number): number =>
	Math.sqrt(opposite * opposite + adjacent * adjacent);

/**
 * Math.cos using degrees instead of radians
 * @param {number} deg
 */
export const cos = (deg: number): number => Math.cos(degToRad(deg));

/**
 * Math.sin using degrees instead of radians
 * @param {number} deg
 */
export const sin = (deg: number): number => Math.sin(degToRad(deg));

/**
 * Math.atan2 returning degrees instead of radians
 * @param {number} opposite
 * @param {number} adjacent
 */
export const atan2 = (opposite: number, adjacent: number): number =>
	radToDeg(Math.atan2(opposite, adjacent));

/**
 * Determine the transform values of a point with a rotation
 * @param {number} dX
 * @param {number} dY
 * @param {number} deg
 */
export const withRotation = (dX: number, dY: number, deg: number): Mops.PositionModel => {
	const hypotenuse = getHypotenuse(dX, dY);
	const beta = atan2(dY, dX);
	return polarToCartesian(beta - deg, hypotenuse);
};

/**
 * Get a rotation model from a mouseEvent and node, based on an existing rotation.
 * @param {HTMLElement} node
 * @param { React.MouseEvent} event
 * @param {{rotation:Mops.RotationModel,angle:Mops.RotationModel}} orientation
 */
export const getRotation = (
	node: HTMLElement,
	event: React.MouseEvent,
	orientation: {
		rotation: Mops.RotationModel;
		angle: Mops.RotationModel;
	}
) => {
	const {left, top, width, height} = node.getBoundingClientRect();
	const pointer = {x: event.clientX - left, y: event.clientY - top};
	const center = {x: width / 2, y: height / 2};
	const deg = coordinatesToDeg(pointer, center);
	return {
		deg,
		rotation: (state: Mops.RotationModel) => ({
			x: state.x,
			y: state.y,
			z: to360(orientation.rotation.z + (deg - orientation.angle.z))
		})
	};
};

export const getBounds = ({
	height,
	width,
	angle
}: {
	height: number;
	width: number;
	angle: number;
}) => {
	const rad = degToRad(angle);
	const deg = radToDeg(
		(rad > Math.PI * 0.5 && rad < Math.PI) || (rad > Math.PI * 1.5 && rad < Math.PI * 2)
			? Math.PI - rad
			: rad
	);
	return {
		height: sin(deg) * width + cos(deg) * height,
		width: sin(deg) * height + cos(deg) * width
	};
};

export const getBoundingBox = (m: {height: number; width: number; angle: number}) => {
	const {height, width} = getBounds(m);
	return {
		height: Math.abs(height),
		width: Math.abs(width)
	};
};

export const inRange = (value: number, min: number, max: number) => value >= min && value <= max;

const fallback = (...n: number[]) => n[0];
export const chooseFn = (a: number, b: number = 0): ((...values: number[]) => number) =>
	a > b ? Math.min : b > a ? Math.max : fallback;

export const steps = (value: number, step: number) => Math.round(value / step) * step;
