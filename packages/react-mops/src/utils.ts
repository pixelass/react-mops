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
export const withRotation = (dX: number, dY: number, deg: number) => {
	const hypotenuse = getHypotenuse(dX, dY);
	const beta = atan2(dY, dX);
	const y = hypotenuse * sin(beta - deg);
	const x = hypotenuse * cos(beta - deg);
	return {x, y};
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
