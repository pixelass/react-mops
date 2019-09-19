import {Box, Mops, coordinatesToDeg, resizeClasses, rotationClasses} from "react-mops";
import React from "react";
import styled, {css, ThemeProvider} from "styled-components";

const theme = {};

const Wrapper = styled.div<{grid?: {x: number; y: number}}>`
	position: relative;
	height: 500px;
	width: 500px;
	margin: 3rem;
	box-shadow: 0 0 0 1px black;
	${({grid}) =>
		grid &&
		css`
			background-image: linear-gradient(to right, hsla(0, 0%, 0%, 0.1) 1px, transparent 1px),
				linear-gradient(to bottom, hsla(0, 0%, 0%, 0.1) 1px, transparent 1px);
			background-size: ${grid.x}px ${grid.y}px;
			// background-position: ${grid.x / 2}px ${grid.y / 2}px;
		`};
`;

const Inner = styled.div<{backgroundColor: string}>`
	box-sizing: border-box;
	padding: 10px;
	min-height: 100%;
	min-width: 100%;
	background: ${({backgroundColor}) => backgroundColor};
	font-family: sans-serif;
	display: flex;
	align-items: center;
	align-content: center;
	justify-content: center;
	text-align: center;
	font-size: 25px;
`;

const Examples = styled.div`
	display: flex;
	flex-wrap: wrap;
`;

const toBounds = ({top, right, bottom, left}) => ({position, size}, model = position) => {
	const snap: Partial<Mops.PositionModel> = {
		x: Math.max(left + size.width / 2, Math.min(right - size.width / 2, model.x)),
		y: Math.max(top + size.height / 2, Math.min(bottom - size.height / 2, model.y))
	};
	return snap;
};

const toGrid = ({x = 1, y = 1}) => ({position, size}, model = position) => {
	const snap: Partial<Mops.PositionModel> = {
		x: Math.round(model.x / x) * x,
		y: Math.round(model.y / y) * y
	};
	return snap;
};

export function Home() {
	const rotatableRef = React.useRef<HTMLDivElement>();
	const resizableRef = React.useRef<HTMLDivElement>();
	const allRef = React.useRef<HTMLDivElement>();
	const draggableRef = React.useRef<HTMLDivElement>();
	const [windowPointer, setWindowPointer] = React.useState({
		clientX: 0,
		clientY: 0
	});
	const handleMouseMove = React.useCallback(
		(e: MouseEvent) => {
			setWindowPointer({
				clientX: e.clientX,
				clientY: e.clientY
			});
		},
		[setWindowPointer]
	);
	const removeClasses = React.useCallback(
		(e: MouseEvent) => {
			document.body.classList.remove(...rotationClasses, ...resizeClasses)
		},
		[]
	);
	React.useEffect(() => {
		window.addEventListener("mousemove", handleMouseMove);
		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
		};
	}, [handleMouseMove]);
	React.useEffect(() => {
		window.addEventListener("blur", removeClasses);
		window.addEventListener("focus", removeClasses);
		return () => {
			window.removeEventListener("blur", removeClasses);
			window.removeEventListener("focus", removeClasses);
		};
	}, [removeClasses]);
	return (
		<ThemeProvider theme={theme}>
			<Examples>
				<Wrapper>
					<h3>Resizable</h3>
					<p><code>Alt</code> to resize in opposite directions</p>
					<p><code>Shift</code> to retain the aspect-ratio</p>
					<p><code>Alt + Shift</code> to resize in opposite directions and retain the aspect-ratio</p>
					<Box
						ref={resizableRef as React.Ref<HTMLDivElement>}
						isResizable
						onResizeEnd={() => {
							document.body.classList.remove(
								...resizeClasses
							);
						}}
						onResize={() => {
							if (resizableRef && resizableRef.current) {
								const {clientX, clientY} = windowPointer;
								const {
									left,
									top,
									width,
									height
								} = resizableRef.current.getBoundingClientRect();
								const pointer = {x: clientX - left, y: clientY - top};
								const center = {x: width / 2, y: height / 2};
								const deg = coordinatesToDeg(pointer, center);
								const rotationStep =
									(Math.round(deg / 45) + rotationClasses.length) %
									rotationClasses.length;
								document.body.classList.remove(
									...resizeClasses,
								);
								document.body.classList.add(
									resizeClasses[rotationStep % resizeClasses.length]
								);
							}
						}}
						position={{
							x: 250,
							y: 250
						}}
						size={{
							height: 100,
							width: 100
						}}>
						<Inner backgroundColor={`hsl(0, 100%, 30%)`} />
					</Box>
				</Wrapper>
				<Wrapper>
					<h3>Rotatable</h3>
					<h3>All combined</h3>
					<p><code>CMD</code> to rotate</p>
					<p><code>CMD + Shift</code> to rotate in steps</p>
					<Box
						ref={rotatableRef as React.Ref<HTMLDivElement>}
						isRotatable
						onRotateEnd={() => {
							document.body.classList.remove(
								...rotationClasses
							);
						}}
						onRotate={() => {
							if (rotatableRef && rotatableRef.current) {
								const {clientX, clientY} = windowPointer;
								const {
									left,
									top,
									width,
									height
								} = rotatableRef.current.getBoundingClientRect();
								const pointer = {x: clientX - left, y: clientY - top};
								const center = {x: width / 2, y: height / 2};
								const deg = coordinatesToDeg(pointer, center);
								const rotationStep =
									(Math.round(deg / 45) + rotationClasses.length) %
									rotationClasses.length;
								document.body.classList.remove(
									...rotationClasses
								);
								document.body.classList.add(
									rotationClasses[rotationStep % rotationClasses.length]
								);
							}
						}}
						position={{
							x: 250,
							y: 250
						}}
						size={{
							height: 100,
							width: 100
						}}>
						<Inner backgroundColor={`hsl(90, 100%, 30%)`} />
					</Box>
				</Wrapper>
				<Wrapper>
					<h3>Draggable</h3>
					<Box
						ref={draggableRef as React.Ref<HTMLDivElement>}
						shouldSnap={[
							// toGrid({x: 25, y: 25}),
							// toBounds({top: 0, right: 500, bottom: 500, left: 0})
						]}
						isDraggable
						position={{
							x: 250,
							y: 250
						}}
						size={{
							height: 100,
							width: 100
						}}>
						<Inner backgroundColor={`hsl(180, 100%, 30%)`} />
					</Box>
				</Wrapper>
				<Wrapper>
					<h3>All combined</h3>
					<p><code>CMD</code> to rotate</p>
					<p><code>CMD + Shift</code> to rotate in steps</p>
					<p><code>Alt</code> to resize in opposite directions</p>
					<p><code>Shift</code> to retain the aspect-ratio</p>
					<p><code>Alt + Shift</code> to resize in opposite directions and retain the aspect-ratio</p>
					<Box
						ref={allRef as React.Ref<HTMLDivElement>}
						isRotatable
						isResizable
						isDraggable
						onResizeEnd={() => {
							document.body.classList.remove(
								...resizeClasses
							);
						}}
						onResize={() => {
							if (allRef && allRef.current) {
								const {clientX, clientY} = windowPointer;
								const {
									left,
									top,
									width,
									height
								} = allRef.current.getBoundingClientRect();
								const pointer = {x: clientX - left, y: clientY - top};
								const center = {x: width / 2, y: height / 2};
								const deg = coordinatesToDeg(pointer, center);
								const rotationStep =
									(Math.round(deg / 45) + rotationClasses.length) %
									rotationClasses.length;
								document.body.classList.remove(
									...resizeClasses,
								);
								document.body.classList.add(
									resizeClasses[rotationStep % resizeClasses.length]
								);
							}
						}}
						onRotateEnd={() => {
							document.body.classList.remove(
								...rotationClasses
							);
						}}
						onRotate={() => {
							if (allRef && allRef.current) {
								const {clientX, clientY} = windowPointer;
								const {
									left,
									top,
									width,
									height
								} = allRef.current.getBoundingClientRect();
								const pointer = {x: clientX - left, y: clientY - top};
								const center = {x: width / 2, y: height / 2};
								const deg = coordinatesToDeg(pointer, center);
								const rotationStep =
									(Math.round(deg / 45) + rotationClasses.length) %
									rotationClasses.length;
								document.body.classList.remove(
									...rotationClasses
								);
								document.body.classList.add(
									rotationClasses[rotationStep % rotationClasses.length]
								);
							}
						}}
						position={{
							x: 250,
							y: 250
						}}
						size={{
							height: 100,
							width: 100
						}}>
						<Inner backgroundColor={`hsl(260, 100%, 30%)`} />
					</Box>
				</Wrapper>
			</Examples>
		</ThemeProvider>
	);
}
