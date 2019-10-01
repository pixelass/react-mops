import cx from "classnames";
import React from "react";
import {resizeClasses, rotationClasses} from "./cursors";
import styles from "./elements.css";
import {Mops} from "./types";

export const {Provider: PropProvider, Consumer: PropConsumer} = React.createContext<
	Mops.ProviderProps
>({
	getCursorSlice: n => n,
	handleRotationDown: () => undefined,
	isDraggable: false,
	isResizable: false,
	isRotatable: false,
	metaKey: false
});

const HandleLogic: React.RefForwardingComponent<
	HTMLAnchorElement,
	Partial<Mops.HandleProps> & {cursorSlice: string}
> = React.forwardRef(({children, cursorSlice, ...props}, ref: React.Ref<HTMLAnchorElement>) => {
	React.useEffect(() => {
		if (cursorSlice) {
			document.body.classList.remove(...resizeClasses, ...rotationClasses);
			document.body.classList.add(cursorSlice, styles.forceHandle);
		} else {
			document.body.classList.remove(...resizeClasses, ...rotationClasses, styles.forceHandle);
		}
	}, [cursorSlice]);
	return (
		<a {...props} href="#" ref={ref}>
			{children}
		</a>
	);
});

const HandleBase: React.RefForwardingComponent<
	HTMLAnchorElement,
	Mops.HandleProps
> = React.forwardRef(
	(
		{children, className, onClick, isMouseDown, onMouseDown, variation, ...props},
		ref: React.Ref<HTMLAnchorElement>
	) => {
		const [isDown, setDown] = React.useState(false);
		React.useEffect(() => {
			const handleMouseUp = () => {
				setDown(false);
			};
			window.addEventListener("mouseup", handleMouseUp);
			return () => {
				window.removeEventListener("mouseup", handleMouseUp);
			};
		}, [setDown]);
		const handleClick = React.useCallback(
			(e: React.MouseEvent<HTMLAnchorElement>) => {
				e.preventDefault();
				if (typeof onClick === "function") {
					onClick(e);
				}
			},
			[onClick]
		);
		return (
			<PropConsumer>
				{({handleRotationDown, isResizable, isRotatable, getCursorSlice, metaKey}) => {
					const cursorSlice = getCursorSlice(Mops.HandleVariations[variation]);
					const rotationClassName = rotationClasses[cursorSlice];
					const resizeClassName = resizeClasses[cursorSlice % resizeClasses.length];

					return (
						<HandleLogic
							{...props}
							className={cx(className, styles.handleBase, {
								[styles[resizeClassName]]: !metaKey && isResizable,
								[styles[rotationClassName]]: metaKey && isRotatable
							})}
							ref={ref}
							onClick={handleClick}
							cursorSlice={
								isDown ? (metaKey ? rotationClassName : resizeClassName) : undefined
							}
							onMouseDown={e => {
								setDown(true);
								if (metaKey) {
									handleRotationDown(e);
								} else {
									onMouseDown(e);
								}
							}}>
							{children}
						</HandleLogic>
					);
				}}
			</PropConsumer>
		);
	}
);

const HandleMarker: React.FunctionComponent<React.HTMLAttributes<HTMLDivElement>> = ({
	children,
	className,
	...props
}) => (
	<span {...props} className={cx(className, styles.handleMarker)}>
		{children}
	</span>
);

export const Handle: React.RefForwardingComponent<
	HTMLAnchorElement,
	Mops.HandleProps & {variation: Mops.HandleVariation; full?: boolean}
> = React.forwardRef(
	({className, variation, isMouseDown, style, marker: Marker, full, ...props}, ref) => {
		return (
			<HandleBase
				{...props}
				variation={variation}
				isMouseDown={isMouseDown}
				className={cx(className, styles[variation], {
					[styles.full]: full
				})}
				ref={ref}>
				<Marker />
			</HandleBase>
		);
	}
);

Handle.defaultProps = {
	marker: HandleMarker
};

export const Handles: React.FunctionComponent<
	React.HTMLAttributes<HTMLDivElement> & {draw?: boolean}
> = ({children, className, draw, ...props}) => (
	<div
		{...props}
		className={cx(className, styles.handles, {
			[styles.drawOutline]: draw
		})}>
		{children}
	</div>
);

export const Wrapper: React.RefForwardingComponent<
	HTMLElement,
	Mops.WrapperProps
> = React.forwardRef(
	({children, className, isDown, as: As, ...props}, ref: React.Ref<HTMLElement>) => (
		<As
			{...props}
			ref={ref as React.Ref<HTMLElement>}
			className={cx(className, styles.wrapper)}>
			{children}
		</As>
	)
);

export const Content: React.RefForwardingComponent<
	HTMLDivElement,
	Mops.ContentProps
> = React.forwardRef(
	({children, className, onMouseDown, ...props}, ref: React.Ref<HTMLDivElement>) => (
		<div
			{...props}
			onMouseDown={onMouseDown}
			ref={ref as React.Ref<HTMLDivElement>}
			className={cx(className, styles.content, {
				[styles.move]: typeof onMouseDown === "function"
			})}>
			{children}
		</div>
	)
);

export const BoundingBox: React.RefForwardingComponent<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement> & {draw?: boolean}
> = React.forwardRef(({children, className, draw, ...props}, ref: React.Ref<HTMLDivElement>) => (
	<div
		{...props}
		ref={ref as React.Ref<HTMLDivElement>}
		className={cx(className, styles.boundingBox, {
			[styles.drawOutline]: draw
		})}>
		{children}
	</div>
));
