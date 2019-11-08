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
	toSiblings,
	useViewport
} from "react-mops";
import {ThemeProvider} from "styled-components";
import {v4 as uuidV4} from "uuid";
import {containerSize as initialContainerSize, fixedGuides as initialFixedGuides, gridSize} from "../constants";
import {
	Button,
	ButtonWrapper,
	Container,
	Example,
	Examples,
	Headline,
	Inner,
	StyledBox,
	StyledMarker,
	SubHeadline,
	Title,
	Wrapper
} from "../elements";

export function Home() {
	const [items, setItems] = React.useState<Array<Mops.Sibling & {backgroundColor?: string}>>([]);
	const [isDraggable, setDraggable] = React.useState(true);
	const [isResizable, setResizable] = React.useState(true);
	const [isRotatable, setRotatable] = React.useState(true);
	const [showMarkers, setMarkers] = React.useState(false);
	const [showBox, setBox] = React.useState(false);
	const [showBoundingBox, setBoundingBox] = React.useState(false);
	const [fullHandles, setFullHandles] = React.useState(true);
	const [hasGrid, setGrid] = React.useState(false);
	const [hasBounds, setBounds] = React.useState(false);
	const [hasGuides, setGuides] = React.useState(false);
	const [hasSiblings, setSiblings] = React.useState(false);
	const [containerSize, setContainerSize] = React.useState<Mops.SizeModel>(initialContainerSize);
	const [fixedGuides, setFixedGuides] = React.useState(initialFixedGuides);
	const [guideColor, setGuideColor] = React.useState("#ff00ff");

	const viewportSize = useViewport({
		fallbackSize: initialContainerSize
	});

	React.useEffect(() => {
		const newSize = {
			height: Math.min(initialContainerSize.height, viewportSize.height),
			width: Math.min(initialContainerSize.width, viewportSize.width)
		};
		const newContainerSize = {
			height: newSize.height - 100,
			width: newSize.width - 40
		};
		const newGuides = [
			{x: newContainerSize.width / 4},
			{x: (newContainerSize.width / 4) * 3},
			{x: newContainerSize.width / 2},
			{y: newContainerSize.height / 2}
		];
		setContainerSize(newContainerSize);
		setFixedGuides(state => state.map(({uuid}, i) => ({uuid, ...newGuides[i]})));
	}, [setContainerSize, setFixedGuides, viewportSize]);

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
		const height = Math.round(Math.random() * 5) * gridSize.y + gridSize.y * 2;
		const width = Math.round(Math.random() * 5) * gridSize.x + gridSize.x * 2;
		setItems(state => [
			...state,
			{
				backgroundColor: `hsla(${Math.round(Math.random() * 360)}, 100%, 50%, 0.2)`,
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
			hasGrid && toGrid(gridSize),
			hasGuides &&
				toGuides({
					threshold: {
						x: gridSize.x / 2,
						y: gridSize.y / 2
					}
				})
		],
		[hasGrid, hasGuides]
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
							Press <code>(Cmd ⌘ / Ctrl)</code> to enable rotation. (OS X / Windows, Linux)
						</li>
						<li>Hold and drag a handle.</li>
						<li>
							Press <code>Shift ⇧</code> to rotate in steps of 15°.
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
							Press <code>Option / Alt ⌥</code> to resize proportionally from the center.
						</li>
						<li>
							Press <code>Shift ⇧</code> to retain the aspect-ratio.
						</li>
					</ul>
					<hr />
					<SubHeadline>Snapping</SubHeadline>
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
					<SubHeadline>Options</SubHeadline>
					<label>
						<span>Guide color: </span>
						<input type="color" value={guideColor} onChange={e => setGuideColor(e.target.value)} />
					</label>
					<ButtonWrapper>
						<Button
							onClick={() => {
								setFullHandles(state => !state);
							}}
							isActive={fullHandles}>
							Full Handles
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
					<GuidesProvider guideRequests={hasGuides ? fixedGuides : undefined} containerSize={containerSize}>
						<Example>
							<Container
								style={{
									...containerSize
								}}
								withGrid={hasGrid ? gridSize : undefined}
								hasBounds={hasBounds}>
								<Guides guideColor={guideColor} {...containerSize} />

								{items.map(({uuid, size, position, rotation, backgroundColor}) => (
									<Box
										key={uuid}
										as={StyledBox}
										drawBoundingBox={showBoundingBox}
										drawBox={showBox}
										fullHandles={fullHandles}
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
										marker={showMarkers ? StyledMarker : null}
										size={size}
										position={position}
										rotation={rotation}
										shouldSnap={[
											...shouldSnap,
											hasSiblings &&
												toSiblings(items.filter(item => item.uuid !== uuid), gridSize),
											hasBounds &&
												toBounds({
													bottom: containerSize.height,
													left: 0,
													right: containerSize.width,
													top: 0
												})
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
