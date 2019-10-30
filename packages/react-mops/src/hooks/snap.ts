import React from "react";
import {Mops} from "../types";

export const useSnap = (
	shouldSnap: Mops.SnapHandler[],
	{position, rotation, size}: Mops.BoundingBox,
	guidesContext: Mops.GuidesContext
) =>
	React.useMemo(
		() =>
			shouldSnap.reduce(
				(model, fn) => {
					const update = fn(
						{
							position,
							rotation,
							size
						},
						guidesContext,
						model
					);
					return {
						position: {
							...model.position,
							...update.position
						},
						rotation,
						size: {
							...model.size,
							...update.size
						}
					};
				},
				{position, rotation, size}
			),
		[position, rotation, shouldSnap, size, guidesContext]
	);
