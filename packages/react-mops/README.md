# M.O.P.S.

**M**odify **O**rientation **P**osition **S**ize

## Value Proposition

M.O.P.S aims to provide a component that allows various transformations
to an Element as seen in design software like Photoshop, Sketch any many others.

## Installation

**NPM**

```shell
npm install react-mops --save-dev
```

**Yarn**

```shell
yarn add react-mops
```

## Docs

### Components

#### Box

### Hooks

#### useShift `() => boolean;`

listens for the shift key.

#### useAlt `() => boolean;`

listens for the alt/option key.

#### useControl `() => boolean;`

listens for the control/ctrl key.

#### useMeta `() => boolean;`

listens for the meta key.

#### useRotation

Hook to modify the orientation of an element.

#### usePosition

Hook to modify the position of an element.

#### useSize

Hook to modify the size of an element.

#### useSnap

Hook to enable snapping.

#### useGuides

Hook to draw guides.

#### useCursors

Hook to enable custom cursors. (requires css file)


### Basic usage examples

```jsx
import {Box} from "react-mops";
import "react-mops/styles.css";

const App = () => (
    <div className="container">
        <Box isResizable>Resize me!</Box>
        <Box isRotatable>Rotate me!</Box>
        <Box isDraggable>Drag me!</Box>
        <Box isResizable isRotatable isDraggable>
            I can do it all!
        </Box>
    </div>
);
```

### Homegrown

M.O.P.S. provides hooks to build custom components.

**rotatable.jsx**

```jsx
import {useRotation, useShift} from "react-mops";

const Rotatable = ({children, initialRotation, onRotate, onRotateEnd, onRotateStart, style}) => {
    // Use Shift to rotate in steps
    const shiftKey = useShift();

    // Hook options
    const options = React.useMemo(
        () => ({
            onRotate,
            onRotateEnd,
            onRotateStart,
            step: 45, // If steps are active rotation uses this value
            steps: shiftKey // Activates steps
        }),
        [shiftKey]
    );

    // Rotation Hook
    const [
        deg, // Current rotation (degree on z-axis)
        {
            onMouseDown, // Triggers rotation
            onTouchStart, // Triggers rotation
            ref // Element considered as rotation center
        }
    ] = useRotation(initialRotation, options);

    // Dynamic element styles
    const style = React.useMemo(
        () => ({
            ...style,
            transform: `rotate3d(0, 0, 1, ${deg}deg)`
        }),
        [deg]
    );

    // Box with content and a dedicated handle to rotate the element
    // The content is used to determind the rotation center (not anchor point)
    return (
        <div className="rotatable" style={style}>
            <span
                className="rotatable-handle"
                onMouseDown={onMouseDown}
                onTouchStart={onTouchStart}
            />
            <div ref={ref} className="rotatable-content">
                {children}
            </div>
        </div>
    );
};

Rotatable.defaultProps = {
    style: {},
    initialRotation: 0
};

export default Rotatable;
```
