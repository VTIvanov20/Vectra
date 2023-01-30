import React, { useRef, useEffect, useState } from 'react';
import { Mafs, Debug, useTransformContext, vec, Circle, CartesianCoordinates, Plot, useMovablePoint, Text, Line, Vector, Point, Polygon, Transform } from 'mafs';
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
    
    let sinMovablePoint = useMovablePoint([0, 0], {
        constrain: (pos) => [pos[0], Math.sin(pos[0])]
    })

    let cosMovablePoint = useMovablePoint([0, 1], {
        constrain: (pos) => [pos[0], Math.cos(pos[0])],
    })

    useEffect(() => {
        // console.log(sinMovablePoint.x, sinMovablePoint.y);
        cosMovablePoint.setPoint([sinMovablePoint.x, Math.cos(sinMovablePoint.x)]);
    }, [sinMovablePoint.x])

    // useEffect(() => {
    //     mathInstance.set_value("mouseX", mouseX)
    //     mathInstance.set_value("mouseY", mouseY)
    // }, [mouseX, mouseY]);
    
    // // TODO: implement AppletToJSX in here
    // return <div onClick={e => { divEvents.current["onClick"]?.(e) }}>
    //     {...AppletToJSX(exampleApplet, mathInstance).map(e => <Mafs width={width} height={height}>
    //         <Debug.ViewportInfo />
    //         {...e}
    //     </Mafs>)}
    // </div>;

    const pointTextSpacing = .05;
    const circleCenter: Vector2 = [0, 0];
    const circleRadius = 1.5;
    const vectorOutwardPadding = 1 * circleRadius * 1.15;

    const toDegrees = (rads: number): number => Math.abs(rads * 180 / Math.PI);
    const getSign = (num: number): string => num == 0 ? '0' : num > 0 ? '+' : '-';

    return <Mafs width={width} height={height}>
        <CartesianCoordinates />
        <Transform rotate={Math.PI*1.5} scale={[1, -1]} translate={[4, 3]}>
            <Vector tail={[circleCenter[0], circleCenter[1] - vectorOutwardPadding]} tip={[circleCenter[0], circleCenter[1] + vectorOutwardPadding]} />
            <Vector tail={[circleCenter[0] - vectorOutwardPadding, circleCenter[1]]} tip={[circleCenter[0] + vectorOutwardPadding, circleCenter[1]]} />

            <Circle center={circleCenter} radius={circleRadius} strokeStyle='dashed' weight={3} />
            <Circle center={circleCenter} radius={circleRadius / 4} strokeStyle='dashed' weight={2} />
            
            <Polygon points={[
                vec.add([sinMovablePoint.y, 0], circleCenter),
                circleCenter,
                vec.add([0, cosMovablePoint.y], circleCenter),
                vec.add([sinMovablePoint.y, cosMovablePoint.y], circleCenter),
            ]} strokeOpacity={0.75} strokeStyle='dashed' />

            <Text attach='ne' x={sinMovablePoint.y + circleCenter[0] + pointTextSpacing} y={circleCenter[1] + pointTextSpacing}>sin</Text>
            <Point x={sinMovablePoint.y + circleCenter[0]} y={circleCenter[1]} color='blue' />
            <Text attach='ne' x={circleCenter[0] + pointTextSpacing} y={cosMovablePoint.y + circleCenter[1] + pointTextSpacing}>cos</Text>
            <Point x={circleCenter[0]} y={cosMovablePoint.y + circleCenter[1]} color='red' />
            <Text attach='ne' size={40} x={circleCenter[0] + circleRadius} y={circleCenter[1] + circleRadius}>
                (sin: {getSign(sinMovablePoint.y)}, cos: {getSign(cosMovablePoint.y)})
            </Text>

            <Vector tail={circleCenter} tip={vec.add([sinMovablePoint.y, cosMovablePoint.y], circleCenter)} />
            <Point x={sinMovablePoint.y + circleCenter[0]} y={cosMovablePoint.y + circleCenter[1]} />
            <Text attach='ne' x={sinMovablePoint.y + circleCenter[0] + pointTextSpacing} y={cosMovablePoint.y + circleCenter[1] + pointTextSpacing}>
                {Math.round(toDegrees(sinMovablePoint.x))}°
            </Text>
        </Transform>

        <>
            <Text x={0} y={1.125}>... and its cosine</Text>
            <Plot.OfX y={y => Math.sin(y)} color='blue' />
            <Text x={Math.PI / 2} y={1.125}>This is a sine.</Text>
            <Plot.OfX y={y => Math.cos(y)} color='red' />
        </>

        <>
            {sinMovablePoint.element}
            <Point x={cosMovablePoint.x} y={cosMovablePoint.y} />
        </>
        <Debug.ViewportInfo />
    </Mafs>
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