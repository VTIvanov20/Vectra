import React, { useRef, useEffect, useState } from 'react';
import { Mafs, Debug, useTransformContext, vec } from 'mafs';
import * as evalexpr from '../evalexpr-js';
import { AppletToJSX } from '../util/AppletSerde';
import { useResolution } from '../util/useResolution';
import { AppletScaffold } from '../util/MafsSchema';
import { useMousePos } from '../util/useMousePos';

type Vector2 = vec.Vector2;

// CartesianCoordinates - CartesianCoordinatesProps

// Plot.OfX - OfXProps
// Plot.OfY - OfYProps
// Plot.VectorField - VectorFieldProps
// Plot.Parametric - ParametricProps extends Stroked

// Line.PointAngle - PointAngleProps extends Stroked
// Line.PointSlope - PointSlopeProps extends Stroked
// Line.Segment - SegmentProps extends Stroked
// Line.ThroughPoints - ThroughPointsProps extends Stroked

// Circle - CircleProps extends Filled
// Ellipse - EllipseProps extends Filled
// Polygon - PolygonProps extends Filled
// Point - PointProps
// Vector - VectorProps extends Stroked
// Text - TextProps = React.PropsWithChildren
// MovablePoint - MovablePointProps

/*

[
    {
        "elements": [
            {
                "type": number
                "props": 
            }
        ]
    }
]

*/

// const EventContext = React.createContext<React.DOMAttributes<HTMLDivElement>>({});

// {/* <Mafs {...{ width, height }}>
//             {/* <CartesianCoordinates /> */}

//             {/* <Plot.OfX y={(x) => +x}></Plot.OfX>
//             <Plot.OfY x={(y) => -y}></Plot.OfY> */}
//             {/* <Plot.VectorField step={2} xy={([x, y]) => [Math.sin(x), Math.cos(y)]}></Plot.VectorField> */}
//             {/* <Plot.Parametric t={[1, 1]} xy={() => [1, 1]}></Plot.Parametric> */}

//             {/* <Line.PointAngle angle={Math.PI*0.25} point={[0, 0]}></Line.PointAngle> */}
//             {/* <Line.PointSlope point={[1, 1]} slope={3}></Line.PointSlope> */}
//             {/* <Line.Segment point1={[2, 1]} point2={[3, 1]}></Line.Segment> */}
//             {/* <Line.ThroughPoints point1={[2, 3]} point2={[3, 3]}></Line.ThroughPoints> */}

//             {/* <Circle center={[1, 1]} radius={0.5}></Circle> */}
//             {/* <Ellipse center={[2, 2]} radius={[0.5, 0.25]}></Ellipse> */}
//             {/* <Polygon points={[[3, 3], [3, 4], [4, 3]]}></Polygon> */}
//             {/* <Point x={4} y={4}></Point> */}
//             {/* <Vector tip={[5, 5]} tail={[4.5, 4.5]}></Vector> */}
//             {/* <Text x={6} y={6}>Some Text</Text> */}
//             {/* <MovablePoint point={[7, 7]} onMove={() => {}}></MovablePoint> */}
// </Mafs> */}

const exampleApplet: AppletScaffold = [
    {
        elements: [
            {
                type: "ofX",
                color: "lightblue",
                y: "y = x",
                weight: 5,
            },
            {
                type: "cartesianCoordinates"
            }
        ],
        resources: []
    }
]

export const Applet: React.FC = (props) => {
    const mathInstance = new evalexpr.JsEvalexprContext
    let [width, height] = useResolution()
    let [mouseX, mouseY] = useMousePos()
    let divEvents = useRef<React.DOMAttributes<HTMLDivElement>>({})

    useEffect(() => {
        mathInstance.set_value("mouseX", mouseX)
        mathInstance.set_value("mouseY", mouseY)
    }, [mouseX, mouseY]);
    
    // TODO: implement AppletToJSX in here
    return <div onClick={e => { divEvents.current["onClick"]?.(e) }}>
        {...AppletToJSX(exampleApplet, mathInstance).map(e => <Mafs width={width} height={height}>
            <Debug.ViewportInfo />
            {...e}
        </Mafs>)}
    </div>;
}

type InnerAppletProps = {
    divEventsRef: React.MutableRefObject<React.DOMAttributes<HTMLDivElement>>;
};

const InnerApplet: React.FC<InnerAppletProps> = (props) => {
    const transformContext = useTransformContext();
    
    useEffect(() => {
        props.divEventsRef.current.onClick = e => {
            let invert = vec.matrixInvert(transformContext.viewTransform);
            if (invert)
                console.log(vec.transform([e.pageX, e.pageY], invert));
        };

        return () => props.divEventsRef.current.onClick = undefined;
    }, []);

    return <>
    </>
}