import React from "react";

export namespace Mops {
	/**
	 * @typedef InitialSizeModel
	 * @type {object}
	 * @property {number|string} height
	 * @property {number|string} width
	 */
	export interface InitialSizeModel {
		height: number | string;
		width: number | string;
	}

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
	 * @typedef RotationModel
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

	/**
	 * @typedef MouseHandler
	 * @type {function}
	 * @param {PositionModel} position
	 * @param {boolean} altKey
	 * @param {boolean} shiftKey
	 * @param {boolean} altKey
	 */
	export type MouseHandler = (
		position: PositionModel,
		altKey: boolean,
		shiftKey: boolean,
		event: MouseEvent
	) => void;

	/**
	 * @typedef SnapHandler
	 * @type {function}
	 * @param {BoundingBox} boundingBox
	 *
	 */
	export type SnapHandler = (
		boundingBox: BoundingBox,
		model?: PositionModel
	) => Partial<PositionModel>;

	/**
	 * @typedef EventHandler
	 * @type {function}
	 * @param {BoundingBox} boundingBox
	 *
	 */
	export type EventHandler = (boundingBox: BoundingBox) => void;

	/**
	 * @typedef BoxProps
	 * @type {object}
	 * @property {SnapHandler} [shouldSnap]
	 * @property {EventHandler} [onResize]
	 * @property {EventHandler} [onResizeStart]
	 * @property {EventHandler} [onResizeEnd]
	 * @property {EventHandler} [onRotate]
	 * @property {EventHandler} [onRotateStart]
	 * @property {EventHandler} [onRotateEnd]
	 * @property {EventHandler} [onDragStart]
	 * @property {EventHandler} [onDragEnd]
	 * @property {PositionModel} [position]
	 * @property {RotationModel} [rotation]
	 * @property {SizeModel} [size]
	 * @property {boolean} [isDraggable]
	 * @property {boolean} [isResizable]
	 * @property {boolean} [isRotatable]
	 * @property {number} [scale]
	 * @property {keyof JSX.IntrinsicElements | React.ComponentType} [as]
	 */
	export interface BoxProps {
		shouldSnap?: SnapHandler[];
		onResize?: EventHandler;
		onResizeStart?: EventHandler;
		onResizeEnd?: EventHandler;
		onRotate?: EventHandler;
		onRotateStart?: EventHandler;
		onRotateEnd?: EventHandler;
		onDrag?: EventHandler;
		onDragStart?: EventHandler;
		onDragEnd?: EventHandler;
		position?: PositionModel;
		rotation?: RotationModel;
		size?: InitialSizeModel;
		isDraggable?: boolean;
		isResizable?: boolean;
		isRotatable?: boolean;
		children: React.ReactChild | React.ReactChild[];
		ref?: React.Ref<HTMLElement>;
		scale?: number;
		as?: keyof JSX.IntrinsicElements | React.ComponentType;
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
	export interface HandleProps {
		ref?: React.Ref<HTMLAnchorElement>;
		children?: React.ReactChild | React.ReactChild[];
		style?: React.CSSProperties;
		variation: Mops.HandleVariation;
		isResizable?: boolean;
		isRotatable?: boolean;
		metaKey?: boolean;
		onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
		onMouseDown?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
		onMouseUp?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
		onMouseMove?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
	}

	export interface WrapperProps {
		children?: React.ReactNode;
		isDown?: boolean;
		as?: keyof JSX.IntrinsicElements | React.ComponentType<any>;
		style?: React.CSSProperties;
		ref?: React.Ref<HTMLElement>;
	}

	export interface ContentProps {
		children?: React.ReactNode;
		onMouseDown?: (e: React.MouseEvent) => void;
		style?: React.CSSProperties;
		ref?: React.Ref<HTMLDivElement>;
	}

	export interface ProviderProps {
		isResizable?: boolean;
		isRotatable?: boolean;
		isDraggable?: boolean;
		getCursorSlice?: (n: number) => number;
		handleRotationDown?: (e: React.MouseEvent) => void;
		metaKey?: boolean;
	}

	export interface UseHandleProps {
		setSize: (s: Mops.SizeModel | ((state: Mops.SizeModel) => Mops.SizeModel)) => void;
		setInitialSize: (s: Mops.SizeModel | ((state: Mops.SizeModel) => Mops.SizeModel)) => void;
		setPosition: (
			p: Mops.PositionModel | ((state: Mops.PositionModel) => Mops.PositionModel)
		) => void;
		setInitialPosition: (
			p: Mops.PositionModel | ((state: Mops.PositionModel) => Mops.PositionModel)
		) => void;
		handleSize: (
			p: Mops.PositionModel,
			altKey: boolean,
			shiftKey: boolean
		) => (s: Mops.SizeModel) => Mops.SizeModel;
		handlePosition: (
			p: Mops.PositionModel,
			altKey: boolean,
			shiftKey: boolean
		) => (p: Mops.PositionModel) => Mops.PositionModel;
		scale: number;
		rotation?: Mops.RotationModel;
		contentRef?: React.RefObject<HTMLElement>;
	}
}
