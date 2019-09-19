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
	const draggableRef = React.useRef<HTMLDivElement>();
	const [windowPointer, setWindowPointer] = React.useState({
		pageX: 0,
		pageY: 0
	});
	const handleMouseMove = React.useCallback(
		(e: MouseEvent) => {
			setWindowPointer({
				pageX: e.pageX,
				pageY: e.pageY
			});
		},
		[setWindowPointer]
	);
	React.useEffect(() => {
		window.addEventListener("mousemove", handleMouseMove);
		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
		};
	}, [handleMouseMove]);
	return (
		<ThemeProvider theme={theme}>
			<Examples>
				<Wrapper>
					<h3>Resizable</h3>
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
								const {pageX, pageY} = windowPointer;
								const {
									left,
									top,
									width,
									height
								} = resizableRef.current.getBoundingClientRect();
								const pointer = {x: pageX - left, y: pageY - top};
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
							x: 100,
							y: 100
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
								const {pageX, pageY} = windowPointer;
								const {
									left,
									top,
									width,
									height
								} = rotatableRef.current.getBoundingClientRect();
								const pointer = {x: pageX - left, y: pageY - top};
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
							x: 100,
							y: 100
						}}
						size={{
							height: 100,
							width: 100
						}}>
						<Inner backgroundColor={`hsl(120, 100%, 30%)`} />
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
							x: 100,
							y: 100
						}}
						size={{
							height: 100,
							width: 100
						}}>
						<Inner backgroundColor={`hsl(240, 100%, 30%)`} />
					</Box>
				</Wrapper>
			</Examples>
		</ThemeProvider>
	);
}
