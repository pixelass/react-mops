import React from "react";

// tslint:disable-next-line:no-namespace
export namespace Mops {
	/**
	 * @typedef SizeModel
	 * @type {object}
	 * @property {number} height
	 * @property {number} width
	 */
	export interface SizeModel {
		height: number;
		width: number;
	}

	/**
	 * @typedef PositionModel
	 * @type {object}
	 * @property {number} x
	 * @property {number} y
	 */
	export interface PositionModel {
		x: number;
		y: number;
	}

	/**
	 * @typedef RotationModel
	 * @type {object}
	 * @property {number} x
	 * @property {number} y
	 * @property {number} z
	 */
	export interface RotationModel {
		x: number;
		y: number;
		z: number;
	}

	/**
	 * @typedef BoundingBox
	 * @type {object}
	 * @property {PositionModel} position
	 * @property {RotationModel} rotation
	 * @property {SizeModel} size
	 */
	export interface BoundingBox {
		position: PositionModel;
		rotation: RotationModel;
		size: SizeModel;
	}

	export interface SnapModel {
		position: PositionModel;
		size: SizeModel;
	}
	/**
	 * @typedef SnapHandler
	 * @type {function}
	 * @param {BoundingBox} boundingBox
	 * @param {Partial<GuidesContext>} guideContext
	 * @param {PositionModel} [model]
	 *
	 */
	export type SnapHandler = (
		boundingBox: BoundingBox,
		guideContext: Partial<GuidesContext>,
		model?: SnapModel
	) => SnapModel;

	/**
	 * @typedef EventHandler
	 * @type {function}
	 * @param {BoundingBox} boundingBox
	 *
	 */
	export type EventHandler = (boundingBox: Partial<BoundingBox>) => void;

	/**
	 * @typedef BoxProps
	 * @type {object}
	 * @property {keyof JSX.IntrinsicElements | React.ComponentType} [as]
	 * @property {string} [className]
	 * @property {boolean} [drawBoundingBox]
	 * @property {boolean} [drawBox]
	 * @property {boolean} [fullHandles]
	 * @property {boolean} [isDraggable]
	 * @property {boolean} [isResizable]
	 * @property {boolean} [isRotatable]
	 * @property {React.ComponentType} [marker]
	 * @property {EventHandler} [onDrag]
	 * @property {EventHandler} [onDragEnd]
	 * @property {EventHandler} [onDragStart]
	 * @property {EventHandler} [onResize]
	 * @property {EventHandler} [onResizeEnd]
	 * @property {EventHandler} [onResizeStart]
	 * @property {EventHandler} [onRotate]
	 * @property {EventHandler} [onRotateEnd]
	 * @property {EventHandler} [onRotateStart]
	 * @property {PositionModel} [position]
	 * @property {RotationModel} [rotation]
	 * @property {number} [scale]
	 * @property {SnapHandler} [shouldSnap]
	 * @property {SizeModel} [size]
	 */
	export interface BoxProps {
		as?: keyof JSX.IntrinsicElements | React.ComponentType;
		className?: string;
		drawBoundingBox?: boolean;
		drawBox?: boolean;
		fullHandles?: boolean;
		isDraggable?: boolean;
		isResizable?: boolean;
		isRotatable?: boolean;
		marker?: React.ComponentType;
		onDrag?: EventHandler;
		onDragEnd?: EventHandler;
		onDragStart?: EventHandler;
		onResize?: EventHandler;
		onResizeEnd?: EventHandler;
		onResizeStart?: EventHandler;
		onRotate?: EventHandler;
		onRotateEnd?: EventHandler;
		onRotateStart?: EventHandler;
		position?: PositionModel;
		ref?: React.Ref<HTMLElement>;
		rotation?: RotationModel;
		scale?: number;
		shouldSnap?: SnapHandler[];
		size?: SizeModel;
		style?: React.CSSProperties;
	}
	export interface Dir {
		y: -1 | 1 | 0;
		x: -1 | 1 | 0;
	}

	export enum HandleVariations {
		e,
		se,
		s,
		sw,
		w,
		nw,
		n,
		ne
	}
	export type HandleVariation = "n" | "ne" | "e" | "se" | "s" | "sw" | "w" | "nw";
	export type HandleDirs = {
		[key in HandleVariation]: Dir;
	};
	export interface HandleProps extends React.HTMLAttributes<HTMLSpanElement> {
		ref?: React.Ref<HTMLSpanElement>;
		marker: React.ComponentType | null;
		fullSize?: boolean;
		variation: HandleVariation;
	}

	export interface AxisProps extends React.HTMLAttributes<HTMLDivElement> {
		ref?: React.Ref<HTMLDivElement>;
	}
	export interface GuidesInnerProps extends React.HTMLAttributes<HTMLDivElement> {
		ref?: React.Ref<HTMLDivElement>;
	}
	export interface GuidesWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
		ref?: React.Ref<HTMLDivElement>;
	}

	export interface BoundingBoxProps extends React.HTMLAttributes<HTMLDivElement> {
		drawOutline?: boolean;
		ref?: React.Ref<HTMLDivElement>;
	}

	export interface HandlesProps extends React.HTMLAttributes<HTMLDivElement> {
		drawOutline?: boolean;
		ref?: React.Ref<HTMLDivElement>;
	}

	export interface WrapperProps extends React.HTMLAttributes<HTMLElement> {
		as?: keyof JSX.IntrinsicElements | React.ComponentType<unknown>;
		isDown?: boolean;
		ref?: React.Ref<HTMLElement>;
	}

	export interface ContentProps extends React.HTMLAttributes<HTMLDivElement> {
		ref?: React.Ref<HTMLDivElement>;
	}

	export interface GuideProps {
		guideColor?: string;
		height: number;
		showGuides?: boolean;
		width: number;
	}

	export interface Guide {
		uuid: string;
		visible?: boolean;
		x1: number;
		x2: number;
		y1: number;
		y2: number;
	}

	export interface GuideRequest {
		uuid: string;
		x?: number;
		y?: number;
	}

	export interface ContainerSize {
		height: number;
		width: number;
	}

	export interface GuidesContext {
		guides: Guide[];
		guideRequests: GuideRequest[];
		addGuides: (guideModels: Guide[]) => void;
		removeGuides: (uuids?: string[]) => void;
		showGuides: (guides?: string[]) => void;
		hideGuides: (guides?: string[]) => void;
		updateGuide: (guideModel: Partial<Guide>) => void;
	}

	export interface Sibling extends Partial<BoundingBox> {
		uuid: string;
	}

	export type SetPosition = React.Dispatch<React.SetStateAction<PositionModel>>;
	export type SetSize = React.Dispatch<React.SetStateAction<SizeModel>>;

	export interface UseSizeProps {
		dir?: Dir;
		minHeight?: number;
		minWidth?: number;
		centered?: boolean;
		deg?: number;
		initialPosition?: PositionModel;
		onResizeEnd?: (boundingBox: Partial<BoundingBox>) => void;
		onResizeStart?: (boundingBox: Partial<BoundingBox>) => void;
		onResize?: (boundingBox: Partial<BoundingBox>) => void;
		setPosition?: SetPosition;
		setInitialPosition?: SetPosition;
	}
	export type UseSize = (
		initialState: SizeModel,
		props: UseSizeProps
	) => [
		SizeModel,
		{
			onMouseDown?: React.MouseEventHandler;
			onTouchStart?: React.TouchEventHandler;
			setSize?: SetSize;
			setInitialSize?: SetSize;
		}
	];
}
