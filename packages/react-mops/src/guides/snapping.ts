import {Mops} from "../types";
import {inRange} from "../utils";

export const toBounds = ({top, right, bottom, left}) => (
	{position, size},
	{},
	model = position
) => {
	const boundaries = {
		bottom: bottom - size.height / 2,
		left: left + size.width / 2,
		right: right - size.width / 2,
		top: top + size.height / 2
	};
	const snap: Mops.PositionModel = {
		x: Math.max(boundaries.left, Math.min(boundaries.right, model.x)),
		y: Math.max(boundaries.top, Math.min(boundaries.bottom, model.y))
	};
	return snap;
};

export const toGrid = ({x = 1, y = 1}) => ({position, size}, {}, model = position) => {
	const half = {
		x: size.width / 2,
		y: size.height / 2
	};
	const snap = {
		b: Math.round((model.y + half.y) / y) * y - half.y,
		l: Math.round((model.x - half.x) / x) * x + half.x,
		r: Math.round((model.x + half.x) / x) * x - half.x,
		t: Math.round((model.y - half.y) / y) * y + half.y
	};
	const diff = {
		b: Math.abs(model.y - snap.b),
		l: Math.abs(model.x - snap.l),
		r: Math.abs(model.x - snap.r),
		t: Math.abs(model.y - snap.t)
	};
	return {
		x: diff.l < diff.r ? snap.l : snap.r,
		y: diff.t < diff.b ? snap.t : snap.b
	};
};

const GUIDE_THRESHOLD = 10;
export const toGuides = ({
	threshold: {x: thresholdX = GUIDE_THRESHOLD, y: thresholdY = GUIDE_THRESHOLD} = {
		x: GUIDE_THRESHOLD,
		y: GUIDE_THRESHOLD
	}
}): Mops.SnapHandler => (
	{position, size},
	{guideRequests, guides, showGuides, hideGuides},
	model = position
) => {
	const tX = Math.max(GUIDE_THRESHOLD, thresholdX);
	const tY = Math.max(GUIDE_THRESHOLD, thresholdY);
	const withGuides = guideRequests.map(({uuid, x, y}) => {
		const xMin = x - tX;
		const xMax = x + tX;
		const yMin = y - tY;
		const yMax = y + tY;
		const snapX = inRange(position.x, xMin, xMax);
		const snapY = inRange(position.y, yMin, yMax);
		const snap: Partial<Mops.GuideRequest> = {uuid, x: snapX && x, y: snapY && y};
		return snap;
	});

	const withSnap = withGuides.reduce((previousValue, {uuid, x, y}) => {
		const snap = previousValue;
		if (typeof x === "number") {
			snap.x = x;
			showGuides([uuid]);
		} else if (typeof y === "number") {
			snap.y = y;
			showGuides([uuid]);
		} else {
			hideGuides([uuid]);
		}
		return snap;
	}, {});
	return {...model, ...withSnap};
};
