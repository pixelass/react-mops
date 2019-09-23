import update from "immutability-helper";
import React from "react";
import {Mops} from "../types";

const {Provider, Consumer} = React.createContext<Mops.GuidesContext>({
	// tslint:disable-next-line:no-empty
	addGuides: () => {},
	guideRequests: [],
	guides: [],
	// tslint:disable-next-line:no-empty
	hideGuides: () => {},
	// tslint:disable-next-line:no-empty
	removeGuides: () => {},
	// tslint:disable-next-line:no-empty
	showGuides: () => {}
});

export {Consumer as GuidesConsumer};

export const GuidesProvider: React.FunctionComponent<{
	guideRequests?: Mops.GuideRequest[];
	containerSize: Mops.ContainerSize;
}> = ({children, guideRequests, containerSize}) => {
	const [guides, setGuides] = React.useState<Mops.Guide[]>([]);
	const addGuides = guideModels => {
		setGuides(state => {
			const newGuides = guideModels.filter(
				({uuid}) =>
					!Boolean(
						state.find(guide => {
							return guide.uuid === uuid;
						})
					)
			);
			return update(state, {
				$push: newGuides
			});
		});
	};
	const removeGuides = uuids => {
		setGuides(state => {
			return uuids
				? update(state, {
						$splice: uuids
							.map(uuid => {
								const index = state.findIndex(guide => guide.uuid === uuid);
								if (index >= 0) {
									return [index, 1];
								}
								return false;
							})
							.filter(Boolean)
							.sort(([a], [b]) => b - a)
				  })
				: [];
		});
	};
	const showGuides = uuids => {
		setGuides(state =>
			update(
				state,
				(uuids || state.map(({uuid}) => uuid)).reduce((previousValue, currentValue) => {
					const index = state.findIndex(({uuid}) => uuid === currentValue);
					return {...previousValue, [index]: {visible: {$set: true}}};
				}, {})
			)
		);
	};
	const hideGuides = uuids => {
		setGuides(state =>
			update(
				state,
				(uuids || state.map(({uuid}) => uuid)).reduce((previousValue, currentValue) => {
					const index = state.findIndex(({uuid}) => uuid === currentValue);
					return {...previousValue, [index]: {visible: {$set: false}}};
				}, {})
			)
		);
	};
	React.useEffect(() => {
		if (guideRequests) {
			const guideModels = guideRequests.map(({uuid, x, y}) => {
				if (x !== undefined) {
					return {
						uuid,
						x1: x,
						x2: x,
						y1: 0,
						y2: containerSize.height
					};
				}
				if (y !== undefined) {
					return {
						uuid,
						x1: 0,
						x2: containerSize.width,
						y1: y,
						y2: y
					};
				}
			});
			addGuides(guideModels);
			const uuids = guideModels.map(({uuid}) => uuid);
			return () => {
				removeGuides(uuids);
			};
		}
	}, [guideRequests, containerSize]);
	return (
		<Provider value={{guideRequests, guides, addGuides, removeGuides, showGuides, hideGuides}}>
			{children}
		</Provider>
	);
};

export const Guides: React.RefForwardingComponent<
	HTMLDivElement,
	Mops.GuideProps
> = React.forwardRef(({...props}, ref: React.Ref<HTMLDivElement>) => {
	const sizeRef = React.useRef<HTMLDivElement>();

	const [height, setHeight] = React.useState(0);
	const [width, setWidth] = React.useState(0);

	const viewBox = `0 0 ${width} ${height}`;

	React.useEffect(() => {
		if (sizeRef && sizeRef.current) {
			const {clientHeight, clientWidth} = sizeRef.current as HTMLDivElement;
			setHeight(clientHeight);
			setWidth(clientWidth);
		}
	}, [ref, setHeight, setWidth]);
	return (
		<div
			ref={ref}
			style={{
				bottom: 0,
				left: 0,
				pointerEvents: "none",
				position: "absolute",
				right: 0,
				top: 0,
				zIndex: 3
			}}>
			<Consumer>
				{({guides}) => {
					return (
						<div
							ref={sizeRef}
							style={{
								bottom: 0,
								left: 0,
								position: "absolute",
								right: 0,
								top: 0
							}}>
							<svg viewBox={viewBox}>
								{guides
									.filter(({visible}) => visible)
									.map(({uuid, visible, ...guide}) => (
										<line
											{...guide}
											key={uuid}
											stroke="hsl(50, 100%, 50%)"
											strokeWidth={2}
										/>
									))}
							</svg>
						</div>
					);
				}}
			</Consumer>
		</div>
	);
});
