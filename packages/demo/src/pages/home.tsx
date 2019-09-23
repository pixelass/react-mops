import React from "react";
import {
	GuidedBox as Box,
	Guides,
	GuidesProvider,
	Mops,
	to360,
	toBounds,
	toGrid,
	toGuides
} from "react-mops";
import {ThemeProvider} from "styled-components";
import {containerSize, fixedGuides, gridSize} from "../constants";
import {
	Button,
	ButtonWrapper,
	Container,
	Example,
	Examples,
	Headline,
	Inner,
	InvisibleMarker,
	StyledBox, SubHeadline, Title,
	Wrapper
} from "../elements";

export function Home() {
	const [isDraggable, setDraggable] = React.useState(true);
	const [isResizable, setResizable] = React.useState(false);
	const [isRotatable, setRotatable] = React.useState(false);
	const [showMarkers, setMarkers] = React.useState(true);
	const [showBox, setBox] = React.useState(false);
	const [showBoundingBox, setBoundingBox] = React.useState(false);
	const [hasGrid, setGrid] = React.useState(false);
	const [hasBounds, setBounds] = React.useState(true);
	const [hasGuides, setGuides] = React.useState(false);
	const shouldSnap: Mops.SnapHandler[] = React.useMemo(
		() =>
			[
				hasGrid ? toGrid(gridSize) : undefined,
				hasGuides
					? toGuides({
							threshold: {
								x: gridSize.x / 2,
								y: gridSize.y / 2
							}
					  })
					: undefined,
				hasBounds
					? toBounds({
							bottom: containerSize.height,
							left: 0,
							right: containerSize.width,
							top: 0
					  })
					: undefined
			].filter(Boolean),
		[hasBounds, hasGrid, hasGuides, isDraggable, isResizable, isRotatable]
	);
	return (
		<ThemeProvider theme={{}}>
			<React.Fragment>
				<Wrapper>
					<Title>M.O.P.S</Title>
					<Headline>Orientation</Headline>
					<ul>
						<li>
							Press <code>Cmd</code> to enable rotation.
						</li>
						<li>Hold and drag a handle.</li>
						<li>
							Press <code>Shift</code> to rotate in steps of 15°.
						</li>
					</ul>
					<Headline>Position</Headline>
					<ul>
						<li>Hold and drag an element.</li>
					</ul>
					<Headline>Size</Headline>
					<ul>
						<li>Hold and drag a handle.</li>
						<li>
							Press <code>Alt</code> to resize opposite sides.
						</li>
						<li>
							Press <code>Shift</code> to retain the aspect-ratio.
						</li>
					</ul>
					<hr/>
					<SubHeadline>Snapping (onDrag)</SubHeadline>
					<ButtonWrapper>
						<Button
							onClick={() => {
								setGrid(state => !state);
							}}
							isActive={hasGrid}>
							Grid
						</Button>
						<Button
							onClick={() => {
								setBounds(state => !state);
							}}
							isActive={hasBounds}>
							Bounds
						</Button>
						<Button
							onClick={() => {
								setGuides(state => !state);
							}}
							isActive={hasGuides}>
							Guides
						</Button>
					</ButtonWrapper>
					<SubHeadline>Modifiers</SubHeadline>
					<ButtonWrapper>
						<Button
							onClick={() => {
								setDraggable(state => !state);
							}}
							isActive={isDraggable}>
							Draggable
						</Button>
						<Button
							onClick={() => {
								setResizable(state => !state);
							}}
							isActive={isResizable}>
							Resizable
						</Button>
						<Button
							onClick={() => {
								setRotatable(state => !state);
							}}
							isActive={isRotatable}>
							Rotatable
						</Button>
					</ButtonWrapper>
					<SubHeadline>Debug</SubHeadline>
					<ButtonWrapper>
						<Button
							onClick={() => {
								setBoundingBox(state => !state);
							}}
							isActive={showBoundingBox}>
							Bounding Box
						</Button>
						<Button
							onClick={() => {
								setBox(state => !state);
							}}
							isActive={showBox}>
							Box
						</Button>
						<Button
							onClick={() => {
								setMarkers(state => !state);
							}}
							isActive={showMarkers}>
							Handle Markers
						</Button>
					</ButtonWrapper>
				</Wrapper>

				<Examples>
					<GuidesProvider
						guideRequests={hasGuides ? fixedGuides : undefined}
						containerSize={containerSize}>
						<Example>
							<Container
								withGrid={hasGrid ? gridSize : undefined}
								hasBounds={hasBounds}>
								<Guides />
								{Array(3)
									.fill(Boolean)
									.map((x, i) => (
										<Box
											key={i}
											as={StyledBox}
											drawBoundingBox={showBoundingBox}
											drawBox={showBox}
											isDraggable={isDraggable}
											isResizable={isResizable}
											isRotatable={isRotatable}
											minHeight={100}
											minWidth={100}
											marker={showMarkers ? undefined : InvisibleMarker}
											fullHandles={!showMarkers}
											size={{
												height: 100 + 41 * (i % 4),
												width: 100 + 36 * (i % 5)
											}}
											position={{
												x: 120 + 65 * 3 * (i % 6),
												y: 120 + 32 * 3 * Math.floor(i / 4)
											}}
											rotation={{
												x: 0,
												y: 0,
												z: to360(((i % 12) + 1) * 68)
											}}
											shouldSnap={shouldSnap}>
											<Inner />
										</Box>
									))}
							</Container>
						</Example>
					</GuidesProvider>
				</Examples>
			</React.Fragment>
		</ThemeProvider>
	);
}
