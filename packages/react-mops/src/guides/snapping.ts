import {v4 as uuidV4} from "uuid";
import {Mops} from "../types";
import {degToRad, getBoundingBox, inRange} from "../utils";

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

const SIBLING_X = uuidV4();
const SIBLING_Y = uuidV4();

export const toSiblings = (siblings: Mops.Sibling[]): Mops.SnapHandler => (
	{position, size, rotation},
	{addGuides, removeGuides, updateGuide, guides},
	model = position
) => {
	const withBoundingBox = siblings.map(sibling => ({
		...sibling,
		boundingBox: getBoundingBox({
			angle: sibling.rotation.z,
			height: sibling.size.height,
			width: sibling.size.width
		})
	}));

	const initialValue: {
		x: {uuid?: string; value?: number};
		y: {uuid?: string; value?: number};
	} = {x: {}, y: {}};

	const withSnap = withBoundingBox
		.map(({uuid, ...item}): Partial<Mops.PositionModel> & {uuid: string} => ({
			uuid,
			x: inRange(model.x, item.position.x - 10, item.position.x + 10)
				? item.position.x
				: undefined,
			y: inRange(model.y, item.position.y - 10, item.position.y + 10)
				? item.position.y
				: undefined
		}))
		.reduce(
			(
				previousValue: {
					x: {uuid?: string; value?: number};
					y: {uuid?: string; value?: number};
				},
				{uuid, x, y}
			) => {
				const hadX = typeof previousValue.x.value === "number";
				const hadY = typeof previousValue.y.value === "number";
				const hasX = typeof x === "number";
				const hasY = typeof y === "number";
				const smallerX =
					hasX && hadX
						? Math.abs(
								withBoundingBox.find(item => item.uuid === previousValue.x.uuid)
									.position.y - model.y
						  ) >
						  Math.abs(
								withBoundingBox.find(item => item.uuid === uuid).position.y -
									model.y
						  )
						: true;
				const smallerY =
					hasY && hadY
						? Math.abs(
								withBoundingBox.find(item => item.uuid === previousValue.y.uuid)
									.position.x - model.x
						  ) >
						  Math.abs(
								withBoundingBox.find(item => item.uuid === uuid).position.x -
									model.x
						  )
						: true;
				return {
					x: {
						uuid: hasX && smallerX ? uuid : previousValue.x.uuid,
						value: hasX && smallerX ? x : previousValue.x.value
					},
					y: {
						uuid: hasY && smallerY ? uuid : previousValue.y.uuid,
						value: hasY && smallerY ? y : previousValue.y.value
					}
				};
			},
			initialValue
		);
	const hasSnap = {
		x: typeof withSnap.x.value === "number",
		y: typeof withSnap.y.value === "number"
	};
	const snaplings = {
		x: hasSnap.x ? withBoundingBox.find(({uuid}) => uuid === withSnap.x.uuid) : undefined,
		y: hasSnap.y ? withBoundingBox.find(({uuid}) => uuid === withSnap.y.uuid) : undefined
	};
	if (hasSnap.x) {
		const dir = snaplings.x.position.y > model.y ? -1 : 1;
		const [y1, y2] = [
			snaplings.x.position.y - (snaplings.x.boundingBox.height / 2) * dir,
			(hasSnap.y ? snaplings.y.position.y : model.y) + (size.height / 2) * dir
		];
		const guide = {
			uuid: SIBLING_X,
			visible: true,
			x1: withSnap.x.value,
			x2: withSnap.x.value,
			y1,
			y2
		};
		if (guides.find(({uuid}) => uuid === SIBLING_X)) {
			updateGuide(guide);
		} else {
			addGuides([guide]);
		}
	} else {
		removeGuides([SIBLING_X]);
	}
	if (hasSnap.y) {
		const dir = snaplings.y.position.x > model.x ? -1 : 1;
		const [x1, x2] = [
			snaplings.y.position.x - (snaplings.y.boundingBox.width / 2) * dir,
			(hasSnap.x ? snaplings.x.position.x : model.x) + (size.width / 2) * dir
		];
		const guide = {
			uuid: SIBLING_Y,
			visible: true,
			x1,
			x2,
			y1: withSnap.y.value,
			y2: withSnap.y.value
		};
		if (guides.find(({uuid}) => uuid === SIBLING_Y)) {
			updateGuide(guide);
		} else {
			addGuides([guide]);
		}
	} else {
		removeGuides([SIBLING_Y]);
	}
	const snap: Mops.PositionModel = {
		x: hasSnap.x ? withSnap.x.value : model.x,
		y: hasSnap.y ? withSnap.y.value : model.y
	};
	return snap;
};
