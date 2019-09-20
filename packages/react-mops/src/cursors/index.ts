import png_eRotate1x from "./images/e-rotate.png";
import png_eRotate2x from "./images/e-rotate@2x.png";
import png_nRotate1x from "./images/n-rotate.png";
import png_nRotate2x from "./images/n-rotate@2x.png";
import png_neRotate1x from "./images/ne-rotate.png";
import png_neRotate2x from "./images/ne-rotate@2x.png";
import png_nwRotate1x from "./images/nw-rotate.png";
import png_nwRotate2x from "./images/nw-rotate@2x.png";
import png_sRotate1x from "./images/s-rotate.png";
import png_sRotate2x from "./images/s-rotate@2x.png";
import png_seRotate1x from "./images/se-rotate.png";
import png_seRotate2x from "./images/se-rotate@2x.png";
import png_swRotate1x from "./images/sw-rotate.png";
import png_swRotate2x from "./images/sw-rotate@2x.png";
import png_wRotate1x from "./images/w-rotate.png";
import png_wRotate2x from "./images/w-rotate@2x.png";

export const resizeClasses = [
	"Mops--col-resize",
	"Mops--nwse-resize",
	"Mops--row-resize",
	"Mops--nesw-resize"
];

export const resizeCursors = ["col-resize", "nwse-resize", "row-resize", "nesw-resize"];

export const rotationClasses = [
	"Mops--e-rotate",
	"Mops--se-rotate",
	"Mops--s-rotate",
	"Mops--sw-rotate",
	"Mops--w-rotate",
	"Mops--nw-rotate",
	"Mops--n-rotate",
	"Mops--ne-rotate"
];

export const rotationCursors = [
	{"1x": png_eRotate1x, "2x": png_eRotate2x},
	{"1x": png_seRotate1x, "2x": png_seRotate2x},
	{"1x": png_sRotate1x, "2x": png_sRotate2x},
	{"1x": png_swRotate1x, "2x": png_swRotate2x},
	{"1x": png_wRotate1x, "2x": png_wRotate2x},
	{"1x": png_nwRotate1x, "2x": png_nwRotate2x},
	{"1x": png_nRotate1x, "2x": png_nRotate2x},
	{"1x": png_neRotate1x, "2x": png_neRotate2x}
];
