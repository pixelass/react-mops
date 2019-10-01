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
	InvisibleMarker,
	StyledBox,
	SubHeadline,
	Title,
	Wrapper
} from "../elements";


export function Home() {
	const [items, setItems] = React.useState<Mops.Sibling[]>([]);
	const [isDraggable, setDraggable] = React.useState(true);
	const [isResizable, setResizable] = React.useState(true);
	const [isRotatable, setRotatable] = React.useState(true);
	const [showMarkers, setMarkers] = React.useState(true);
	const [showBox, setBox] = React.useState(false);
	const [showBoundingBox, setBoundingBox] = React.useState(false);
	const [hasGrid, setGrid] = React.useState(false);
	const [hasBounds, setBounds] = React.useState(true);
	const [hasGuides, setGuides] = React.useState(false);
	const [hasSiblings, setSiblings] = React.useState(true);

	const updateItem = (item: Mops.Sibling) =>
		setItems(state => {
			const index = state.findIndex(({uuid}) => uuid === item.uuid);
			const $spec = {
				[index]: {
					$merge: item
				}
			};
			return update(state, $spec);
		});

	const addItem = () => {
		setItems(state => [
			...state,
			{
				position: {
					x: 50,
					y: 50
				},
				rotation: {
					x: 0,
					y: 0,
					z: 0
				},
				size: {
					height: 100,
					width: 100
				},
				uuid: uuidV4()
			}
		]);
	};

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
								{items.map(({uuid, size, position, rotation}, i) => (
									<Box
										key={uuid}
										as={StyledBox}
										drawBoundingBox={showBoundingBox}
										drawBox={showBox}
										isDraggable={isDraggable}
										isResizable={isResizable}
										isRotatable={isRotatable}
										onDragEnd={b => {
											updateItem({uuid, ...b});
										}}
										onResizeEnd={b => {
											updateItem({uuid, ...b});
										}}
										onRotateEnd={b => {
											updateItem({uuid, ...b});
										}}
										// minHeight={100} // not implemented
										// minWidth={100} // not implemented
										marker={showMarkers ? undefined : InvisibleMarker}
										fullHandles={!showMarkers}
										size={size}
										position={position}
										rotation={rotation}
										shouldSnap={[
											...shouldSnap,
											hasSiblings && toSiblings(items.filter(item => item.uuid !== uuid))
										].filter(Boolean)}>
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
