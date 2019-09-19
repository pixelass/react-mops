# M.O.P.S.
**M**odify **O**rientation **P**osition **S**ize

<!-- toc -->

- [Value Proposition](#value-proposition)
- [Features](#features)
- [Installation](#installation)
- [Docs](#docs)
  * [Basic Examples](#basic-examples)
- [Demo](#demo)
  * [Live](#live)
  * [Screen recordings](#screen-recordings)

<!-- tocstop -->

## Value Proposition

M.O.P.S aims to provide a component that allows various transformations
to an Element as seen in design software like Photoshop, Sketch any many others.

## Features

**(implemented / planned)**

* [ ] `<Guides/>` component
* [x] Resize
  * [x] Alt key: resize left/right, top/bottom or all directions for corners
  * [x] Shift key: retain aspect-ratio
  * [ ] Snapping
  * [ ] Touch support
* [x] Rotate
  * [x] Meta key: activate rotation
  * [x] Shift key: rotate in steps of 15 deg
  * [ ] Snapping
  * [ ] Touch support
* [x] Drag
  * [x] Snapping
  * [ ] Touch support

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

This an extracted component.

Tests and documentation has not been written **yet**. Please look at the [examples](https://github.com/dekk-app/react-mops/blob/master/packages/demo/src/pages/home.tsx#L99) for now 

### Basic Examples

```jsx
import {Box} from "react-mops";

const wrapperStyle = {
    position "relative"
    height: 500,
    width: 500,
    boxShadow: "0 0 0 1px black"
};
const App = () => {
    return (
        <div style={wrapperStyle}>
            <Box isResizable>
                Resize me!
            </Box>
            <Box isRotatable>
                Rotate me!
            </Box>
            <Box isDraggable>
                Drag me!
            </Box>
            <Box isResizable isRotatable isDraggable>
                I can do it all!
            </Box>
        </div>
    );
}
```


## Demo

### Code Sandbox

https://codesandbox.io/s/react-mops-4cwhx

### Live

[https://react-mops.netlify.com](https://react-mops.netlify.com)

### Screen recordings

**Resizable**

![resizable](https://dekk-app.github.io/react-mops/mops_resizable.gif)

**Rotatable**

![rotatable](https://dekk-app.github.io/react-mops/mops_rotatable.gif)

**Draggable**

![draggable](https://dekk-app.github.io/react-mops/mops_draggable.gif)

**Combined**

![combined](https://dekk-app.github.io/react-mops/mops_combined.gif)

