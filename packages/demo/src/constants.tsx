import {v4 as uuidV4} from "uuid";

export const containerSize = {
	height: 900,
	width: 1600
};
export const gridSize = {x: 25, y: 25};
export const fixedGuides = [
	{uuid: uuidV4(), x: containerSize.width / 4},
	{uuid: uuidV4(), x: (containerSize.width / 4) * 3},
	{uuid: uuidV4(), x: containerSize.width / 2},
	{uuid: uuidV4(), y: containerSize.height / 2}
];
