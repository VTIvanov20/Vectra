import React, { useRef, useEffect, useState } from 'react';
import { Mafs, Debug, useTransformContext, vec, Circle, CartesianCoordinates, Plot, useMovablePoint, Text, Line, Vector, Point, Polygon, Transform } from 'mafs';
import * as evalexpr from '../evalexpr-js';
import { AppletToJSX } from '../util/AppletSerde';
import { useResolution } from '../util/useResolution';
import { AppletScaffold } from '../util/MafsSchema';
import { useMousePos } from '../util/useMousePos';

type Vector2 = vec.Vector2;

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