import update from "immutability-helper";
import React from "react";
import {GuidesInner, GuidesWrapper} from "../elements";
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
	showGuides: () => {},
	// tslint:disable-next-line:no-empty
	updateGuide: () => {}
});

export {Consumer as GuidesConsumer};

export const GuidesProvider: React.FunctionComponent<{
	guideRequests?: Mops.GuideRequest[];
	containerSize: Mops.ContainerSize;
}> = ({children, guideRequests, containerSize}) => {
	const [guides, setGuides] = React.useState<Mops.Guide[]>([]);
	const addGuides = React.useCallback(
		guideModels => {
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
		},
		[setGuides]
	);
	const removeGuides = React.useCallback(
		uuids => {
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
		},
		[setGuides]
	);
	const showGuides = React.useCallback(
		uuids => {
			setGuides(state =>
				update(
					state,
					(uuids || state.map(({uuid}) => uuid)).reduce((previousValue, currentValue) => {
						const index = state.findIndex(({uuid}) => uuid === currentValue);
						return index > -1
							? {...previousValue, [index]: {visible: {$set: true}}}
							: previousValue;
					}, {})
				)
			);
		},
		[setGuides]
	);
	const hideGuides = React.useCallback(
		uuids => {
			setGuides(state =>
				update(
					state,
					(uuids || state.map(({uuid}) => uuid)).reduce((previousValue, currentValue) => {
						const index = state.findIndex(({uuid}) => uuid === currentValue);
						return index > -1
							? {...previousValue, [index]: {visible: {$set: false}}}
							: previousValue;
					}, {})
				)
			);
		},
		[setGuides]
	);

	const updateGuide = React.useCallback(
		partialItem => {
			setGuides(state => {
				const index = state.findIndex(({uuid}) => uuid === partialItem.uuid);
				return index > -1
					? update(state, {
							[index]: {
								$merge: partialItem
							}
					  })
					: state;
			});
		},
		[setGuides]
	);
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
		<Provider
			value={{
				addGuides,
				guideRequests,
				guides,
				hideGuides,
				removeGuides,
				showGuides,
				updateGuide
			}}>
			{children}
		</Provider>
	);
};

export const Guides: React.RefForwardingComponent<
	HTMLDivElement,
	Mops.GuideProps
> = React.forwardRef(
	({guideColor, showGuides, height, width, ...props}, ref: React.Ref<HTMLDivElement>) => {
		const sizeRef = React.useRef<HTMLDivElement>();
		return (
			<GuidesWrapper ref={ref}>
				<Consumer>
					{({guides}) => {
						return (
							<GuidesInner ref={sizeRef}>
								<svg viewBox={`0 0 ${width} ${height}`}>
									{guides
										.filter(({visible}) => visible || showGuides)
										.map(({uuid, visible, ...guide}) => (
											<line
												{...guide}
												key={uuid}
												stroke={guideColor}
												strokeWidth={2}
											/>
										))}
								</svg>
							</GuidesInner>
						);
					}}
				</Consumer>
			</GuidesWrapper>
		);
	}
);

Guides.defaultProps = {
	guideColor: "hsl(50, 100%, 50%)"
};
