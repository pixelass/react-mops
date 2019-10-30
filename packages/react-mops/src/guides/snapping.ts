import {v4 as uuidV4} from "uuid";
import {Mops} from "../types";
import {getBoundingBox, getInnerBox, inRange} from "../utils";

export const toBounds = ({top, right, bottom, left}): Mops.SnapHandler => (
	{position, size, rotation},
	{},
	model = {position, size}
) => {
	const boundingBox = getBoundingBox({...size, angle: rotation.z});
	const boundaries = {
		bottom: bottom - boundingBox.height / 2,
		left: left + boundingBox.width / 2,
		right: right - boundingBox.width / 2,
		top: top + boundingBox.height / 2
	};
	return {
		...model,
		position: {
			x: Math.max(boundaries.left, Math.min(boundaries.right, model.position.x)),
			y: Math.max(boundaries.top, Math.min(boundaries.bottom, model.position.y))
		}
	};
};

export const toGrid = ({x = 1, y = 1}): Mops.SnapHandler => (
	{position, size, rotation},
	{},
	model = {position, size}
) => {
	const boundingBox = getBoundingBox({...size, angle: rotation.z});
	const half = {
		x: boundingBox.width / 2,
		y: boundingBox.height / 2
	};
	const snap = {
		b: Math.round((model.position.y + half.y) / y) * y - half.y,
		l: Math.round((model.position.x - half.x) / x) * x + half.x,
		r: Math.round((model.position.x + half.x) / x) * x - half.x,
		t: Math.round((model.position.y - half.y) / y) * y + half.y
	};
	const diff = {
		b: Math.abs(model.position.y - snap.b),
		l: Math.abs(model.position.x - snap.l),
		r: Math.abs(model.position.x - snap.r),
		t: Math.abs(model.position.y - snap.t)
	};
	return {
		...model,
		position: {
			x: diff.l < diff.r ? snap.l : snap.r,
			y: diff.t < diff.b ? snap.t : snap.b
		}
	};
};

const GUIDE_THRESHOLD = 10;
export const toGuides = ({
	threshold: {x: thresholdX = GUIDE_THRESHOLD, y: thresholdY = GUIDE_THRESHOLD} = {
		x: GUIDE_THRESHOLD,
		y: GUIDE_THRESHOLD
	}
}): Mops.SnapHandler => (
	{position, size, rotation},
	{guideRequests, guides, showGuides, hideGuides},
	model = {position, size}
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
	return {...model, position: {...model.position, ...withSnap}};
};

const SIBLING_X = uuidV4();
const SIBLING_Y = uuidV4();

export const toSiblings = (
	siblings: Mops.Sibling[],
	{x: thresholdX = GUIDE_THRESHOLD, y: thresholdY = GUIDE_THRESHOLD}: Mops.PositionModel = {
		x: GUIDE_THRESHOLD,
		y: GUIDE_THRESHOLD
	}
): Mops.SnapHandler => (
	{position, size, rotation},
	{addGuides, removeGuides, updateGuide, guides, guideRequests, hideGuides},
	model = {position, size}
) => {
	const boundingBox = getBoundingBox({...model.size, angle: rotation.z});
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
			x: inRange(model.position.x, item.position.x - thresholdX, item.position.x + thresholdX)
				? item.position.x
				: undefined,
			y: inRange(model.position.y, item.position.y - thresholdY, item.position.y + thresholdY)
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
									.position.y - model.position.y
						  ) >
						  Math.abs(
								withBoundingBox.find(item => item.uuid === uuid).position.y -
									model.position.y
						  )
						: true;
				const smallerY =
					hasY && hadY
						? Math.abs(
								withBoundingBox.find(item => item.uuid === previousValue.y.uuid)
									.position.x - model.position.x
						  ) >
						  Math.abs(
								withBoundingBox.find(item => item.uuid === uuid).position.x -
									model.position.x
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
		const dir = snaplings.x.position.y > model.position.y ? -1 : 1;
		const [y1, y2] = [
			snaplings.x.position.y - (snaplings.x.boundingBox.height / 2) * dir,
			(hasSnap.y ? snaplings.y.position.y : model.position.y) + (boundingBox.height / 2) * dir
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
		const dir = snaplings.y.position.x > model.position.x ? -1 : 1;
		const [x1, x2] = [
			snaplings.y.position.x - (snaplings.y.boundingBox.width / 2) * dir,
			(hasSnap.x ? snaplings.x.position.x : model.position.x) + (boundingBox.width / 2) * dir
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
	return {
		...model,
		position: {
			x: hasSnap.x ? withSnap.x.value : model.position.x,
			y: hasSnap.y ? withSnap.y.value : model.position.y
		}
	};
};
