import React from "react";
import {getBoundingBox} from "../utils";

export const useBoundingBox = (size, angle) =>
	React.useMemo(() => getBoundingBox({...size, angle}), [size, angle]);
