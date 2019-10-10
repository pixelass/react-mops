import update from "immutability-helper";
import React from "react";
import {
	GuidedBox as Box,
	Guides,
	GuidesProvider,
	Mops,
	toBounds,
	toGrid,
	toGuides,
	toSiblings
} from "react-mops";
import {ThemeProvider} from "styled-components";
import {v4 as uuidV4} from "uuid";
import {containerSize, fixedGuides, gridSize} from "../constants";
import {
	Button,
	ButtonWrapper,
	Container,
	Example,
	Examples,
	Headline,
	Inner,
	SubHeadline,
	Title,
	Wrapper
} from "../elements";

export function Home() {
	const [items, setItems] = React.useState<Array<Mops.Sibling & {backgroundColor?: string}>>([]);
	const [isDraggable, setDraggable] = React.useState(true);
	const [isResizable, setResizable] = React.useState(true);
	const [isRotatable, setRotatable] = React.useState(true);
	const [showMarkers, setMarkers] = React.useState(true);
	const [showBox, setBox] = React.useState(false);
	const [showBoundingBox, setBoundingBox] = React.useState(false);
	const [hasGrid, setGrid] = React.useState(false);
	const [hasBounds, setBounds] = React.useState(false);
	const [hasGuides, setGuides] = React.useState(true);
	const [hasSiblings, setSiblings] = React.useState(true);

	const updateItem = (item: Mops.Sibling) =>
		setItems(state => {
			const index = state.findIndex(({uuid}) => uuid === item.uuid);
			const $spec = {
				[index]: {
					$merge: item
				}
			};
			return index > -1 ? update(state, $spec) : state;
		});

	const addItem = () => {
		const height = Math.round(Math.random() * 200) + 100;
		const width = Math.round(Math.random() * 200) + 100;
		setItems(state => [
			...state,
			{
				backgroundColor: `hsl(${Math.round(Math.random() * 360)}, 100%, 50%)`,
				position: {
					x: width / 2,
					y: height / 2
				},
				rotation: {
					x: 0,
					y: 0,
					z: 0
				},
				size: {
					height,
					width
				},
				uuid: uuidV4()
			}
		]);
	};

	const shouldSnap: Mops.SnapHandler[] = React.useMemo(
		() => [
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
		],
		[hasBounds, hasGrid, hasGuides, isDraggable, isResizable, isRotatable]
	);
	React.useEffect(() => {
		addItem();
	}, []);

	return (
		<ThemeProvider theme={{}}>
			<React.Fragment>
				<Wrapper>
					<Title>M.O.P.S</Title>
					<Headline>Orientation</Headline>
					<ul>
						<li>
							Press <code>Cmd / Ctrl)</code> to enable rotation. (OS X / Windows,
							Linux)
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
					<hr />
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
						<Button
							onClick={() => {
								setSiblings(state => !state);
							}}
							isActive={hasSiblings}>
							Siblings
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
					<hr />
					<Button onClick={addItem}>Add Box</Button>
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

								{items.map(({uuid, size, position, rotation, backgroundColor}) => (
									<Box
										key={uuid}
										// as={StyledBox}
										// drawBoundingBox={showBoundingBox}
										// drawBox={showBox}
										isDraggable={isDraggable}
										isResizable={isResizable}
										isRotatable={isRotatable}
										onDragStart={() => {
											// tslint:disable-next-line:no-console
											console.log("position:start");
										}}
										onDrag={() => {
											// tslint:disable-next-line:no-console
											console.log("position:move");
										}}
										onDragEnd={b => {
											// tslint:disable-next-line:no-console
											console.log("position:end");
											updateItem({uuid, rotation, position, size, ...b});
										}}
										onRotateStart={() => {
											// tslint:disable-next-line:no-console
											console.log("rotate:start");
										}}
										onRotate={() => {
											// tslint:disable-next-line:no-console
											console.log("rotate:move");
										}}
										onRotateEnd={b => {
											// tslint:disable-next-line:no-console
											console.log("rotate:end");
											updateItem({uuid, rotation, position, size, ...b});
										}}
										onResizeStart={() => {
											// tslint:disable-next-line:no-console
											console.log("resize:start");
										}}
										onResize={() => {
											// tslint:disable-next-line:no-console
											console.log("resize:move");
										}}
										onResizeEnd={b => {
											// tslint:disable-next-line:no-console
											console.log("resize:end");
											updateItem({uuid, rotation, position, size, ...b});
										}}
										// minHeight={100} // not implemented
										// minWidth={100} // not implemented
										// marker={showMarkers ? undefined : InvisibleMarker}
										// fullHandles={!showMarkers}
										size={size}
										position={position}
										rotation={rotation}
										shouldSnap={[
											...shouldSnap,
											hasSiblings &&
												toSiblings(items.filter(item => item.uuid !== uuid))
										].filter(Boolean)}>
										<Inner style={{backgroundColor}} />
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
