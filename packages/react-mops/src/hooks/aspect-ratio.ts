import React from "react";

export const useAspectRatio = (
	aspectRatio,
	{setSize, setInitialSize, setPosition, setInitialPosition}
) => {
	React.useEffect(() => {
		setSize(({height}) => ({
			height,
			width: height * aspectRatio
		}));
	});
};
