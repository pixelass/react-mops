import React from "react";
import {Mops} from "../types";
import {useEventListener} from "./event-listener";
import {useWindow} from "./globals";
interface UseViewportProps {
	fallbackSize: Mops.SizeModel;
	onResize?: (viewportSize: Mops.SizeModel) => void;
}
type UseViewport = (props: UseViewportProps) => Mops.SizeModel;

export const useViewport: UseViewport = ({fallbackSize, onResize}) => {
	const win = useWindow();
	const [size, setSize] = React.useState(fallbackSize);

	React.useEffect(() => {
		const newSize = {
			height: win ? win.innerHeight : fallbackSize.height,
			width: win ? win.innerWidth : fallbackSize.width
		};
		setSize(newSize);
	}, [fallbackSize]);

	useEventListener(
		"resize",
		() => {
			const newSize = {
				height: win ? win.innerHeight : fallbackSize.height,
				width: win ? win.innerWidth : fallbackSize.width
			};
			setSize(newSize);
			if (onResize) {
				onResize(newSize);
			}
		},
		win,
		[fallbackSize, setSize, onResize]
	);
	return size;
};
