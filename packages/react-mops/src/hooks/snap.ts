import React from "react";
import {Mops} from "../types";
import {getBoundingBox} from "../utils";

export const useSnap = (
	shouldSnap: Mops.SnapHandler[],
	{position, rotation, size}: Mops.BoundingBox,
	guidesContext: Mops.GuidesContext
) =>
	React.useMemo(
		() =>
			shouldSnap
				? shouldSnap.reduce(
						(model, fn) => ({
							...fn(
								{
									position,
									rotation,
									size: getBoundingBox({...size, angle: rotation.z})
								},
								guidesContext,
								model
							)
						}),
						position
				  )
				: position,
		[position, rotation, shouldSnap, size, guidesContext]
	);
