import React from 'react';
import { Mafs, CartesianCoordinates, Text, Plot, Line, Circle, Ellipse, Polygon, Point, Vector, MovablePoint, Vector2 } from 'mafs';
import { useResolution } from '../util/useResolution';

export const Applet: React.FC = (props) => {
    let [width, height] = useResolution();

    return <Mafs {...{ width, height }}>
        <CartesianCoordinates />

        {/* <Plot.OfX y={(x) => +x}></Plot.OfX>
        <Plot.OfY x={(y) => -y}></Plot.OfY> */}
        {/* <Plot.VectorField step={2} xy={([x, y]) => [Math.sin(x), Math.cos(y)]}></Plot.VectorField> */}
        {/* <Plot.Parametric t={[1, 1]} xy={() => [1, 1]}></Plot.Parametric> */}

        {/* <Line.PointAngle angle={Math.PI*0.25} point={[0, 0]}></Line.PointAngle> */}
        {/* <Line.PointSlope point={[1, 1]} slope={3}></Line.PointSlope> */}
        {/* <Line.Segment point1={[2, 1]} point2={[3, 1]}></Line.Segment> */}
        {/* <Line.ThroughPoints point1={[2, 3]} point2={[3, 3]}></Line.ThroughPoints> */}

        {/* <Circle center={[1, 1]} radius={0.5}></Circle> */}
        {/* <Ellipse center={[2, 2]} radius={[0.5, 0.25]}></Ellipse> */}
        {/* <Polygon points={[[3, 3], [3, 4], [4, 3]]}></Polygon> */}
        {/* <Point x={4} y={4}></Point> */}
        {/* <Vector tip={[5, 5]} tail={[4.5, 4.5]}></Vector> */}
        {/* <Text x={6} y={6}>Some Text</Text> */}
        {/* <MovablePoint point={[7, 7]} onMove={() => {}}></MovablePoint> */}
    </Mafs>;
}