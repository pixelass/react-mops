import cx from "classnames";
import React from "react";
import styles from "./elements.css";
import {Mops} from "./types";

export const handleVariations: Mops.HandleVariation[] = [
	"e",
	"n",
	"ne",
	"nw",
	"s",
	"se",
	"sw",
	"w"
];

export const handleDirs: Mops.HandleDirs = {
	e: {
		x: 1,
		y: 0
	},
	n: {
		x: 0,
		y: -1
	},
	ne: {
		x: 1,
		y: -1
	},
	nw: {
		x: -1,
		y: -1
	},
	s: {
		x: 0,
		y: 1
	},
	se: {
		x: 1,
		y: 1
	},
	sw: {
		x: -1,
		y: 1
	},
	w: {
		x: -1,
		y: 0
	}
};

export const Handle: React.RefForwardingComponent<
	HTMLSpanElement,
	Mops.HandleProps
> = React.forwardRef(({fullSize, marker: Marker, onMouseDown, onTouchStart, variation}, ref) => (
	<span
		ref={ref}
		className={cx("handleBase", variation, {[styles.full]: fullSize})}
		onMouseDown={onMouseDown}
		onTouchStart={onTouchStart}>
		{Marker ? <Marker /> : null}
	</span>
));

export const Handles: React.RefForwardingComponent<
	HTMLDivElement,
	Mops.HandlesProps
> = React.forwardRef(({children, className, drawOutline, ...props}, ref) => (
	<div
		{...props}
		ref={ref}
		className={cx(className, styles.handles, {
			[styles.drawOutline]: drawOutline
		})}>
		{children}
	</div>
));

Handle.defaultProps = {
	marker: null
};

export const Wrapper: React.RefForwardingComponent<
	HTMLElement,
	Mops.WrapperProps
> = React.forwardRef(({children, className, isDown, as: asElement, ...props}, ref) => {
	const As = asElement as React.ComponentType<any>;
	return (
		<As {...props} ref={ref} className={cx(className, styles.wrapper)}>
			{children}
		</As>
	);
});

export const Axis: React.RefForwardingComponent<HTMLDivElement, Mops.AxisProps> = React.forwardRef(
	({children, className, ...props}, ref) => (
		<div {...props} ref={ref} className={cx(className, styles.axis)}>
			{children}
		</div>
	)
);

export const GuidesWrapper: React.RefForwardingComponent<
	HTMLDivElement,
	Mops.GuidesWrapperProps
> = React.forwardRef(({children, className, ...props}, ref) => (
	<div {...props} ref={ref} className={cx(className, styles.guidesWrapper)}>
		{children}
	</div>
));

export const GuidesInner: React.RefForwardingComponent<
	HTMLDivElement,
	Mops.GuidesInnerProps
> = React.forwardRef(({children, className, ...props}, ref) => (
	<div {...props} ref={ref} className={cx(className, styles.guidesInner)}>
		{children}
	</div>
));

export const Content: React.RefForwardingComponent<
	HTMLDivElement,
	Mops.ContentProps
> = React.forwardRef(({children, className, ...props}, ref) => (
	<div
		{...props}
		ref={ref}
		className={cx(className, styles.content, {
			[styles.move]: typeof props.onMouseDown === "function"
		})}>
		{children}
	</div>
));

export const BoundingBox: React.RefForwardingComponent<
	HTMLDivElement,
	Mops.BoundingBoxProps
> = React.forwardRef(({children, className, drawOutline, ...props}, ref) => (
	<div
		{...props}
		ref={ref}
		className={cx(className, styles.boundingBox, {
			[styles.drawOutline]: drawOutline
		})}>
		{children}
	</div>
));
