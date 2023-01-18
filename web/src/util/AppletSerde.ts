import React, { ReactElement } from 'react';
import { AppletScaffold, ElementScaffold } from './MafsSchema';
import {
    CartesianCoordinates, Circle, Ellipse,
    Line, Text, MovablePoint, Plot, Point,
    vec, VectorFieldProps, Vector, Polygon
} from 'mafs';
import * as evalexpr from '../evalexpr-js';
import { vector2Schema } from './mafs.zod';


// CartesianCoordinates - CartesianCoordinatesProps
// Transform - TransformProps

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

export function AppletToJSX(applet: AppletScaffold): JSX.Element[] {
    const mathInstance = new evalexpr.JsEvalexprContext;
    // let resourceMap: { [key: string]:  }

    let outJSX: JSX.Element[] = [];
    
    applet.map(page => {
        // TODO: introduce the concept of variables with "$"
        page.elements.map(element => {
            switch(element.type) {
                case "cartesianCoordinates":
                    outJSX.push(React.createElement(CartesianCoordinates, element));
                    break;
                case "circle":
                    outJSX.push(React.createElement(Circle, element));
                    break;
                case "ellipse":
                    outJSX.push(React.createElement(Ellipse, element));
                    break;
                // TODO: implement with movablePoint resource
                // case "movablePoint":
                //     outJSX.push(React.createElement(MovablePoint, { ...element }));
                //     break;
                // TODO: implement styling on ofX
                case "ofX":
                    outJSX.push(React.createElement(Plot.OfX, {
                        y(x) {
                            mathInstance.set_value("x", x)
                            mathInstance.eval(element.y) // for example: element.y = "y = x^2"
                            let out = mathInstance.get_value("y");
                            if (typeof out != 'number') throw new TypeError("Invalid return type from math expression")
                            else return out;
                        },
                        color: element.color,
                        maxSamplingDepth: element.maxSamplingDepth,
                        minSamplingDepth: element.minSamplingDepth,
                        opacity: element.opacity,
                        style: element.style,
                        weight: element.weight
                    }));
                    break;
                case "ofY":
                    outJSX.push(React.createElement(Plot.OfY, {
                        x(y) {
                            mathInstance.set_value("y", y)
                            mathInstance.eval(element.x) // for example: element.x = "x = y^2"
                            let out = mathInstance.get_value("x")
                            if (typeof out != 'number') throw new TypeError("Invalid return type from math expression")
                            else return out;
                        },
                        color: element.color,
                        maxSamplingDepth: element.maxSamplingDepth,
                        minSamplingDepth: element.minSamplingDepth,
                        opacity: element.opacity,
                        style: element.style,
                        weight: element.weight
                    }));
                    break;
                case "parametric":
                    outJSX.push(React.createElement(Plot.Parametric, {
                        xy(t) {
                            mathInstance.set_value("t", t);
                            mathInstance.eval(element.xy); // for example: element.xy = "xy = (math::cos(t), (t / k) * math::sin(t))"
                            let out = vector2Schema.safeParse(mathInstance.get_value("xy"));
                            if (out.success) return out.data;
                            else throw new Error("Invalid return type from expression.\nMore info: " + out.error.toString());
                        },
                        t: element.t,
                        minSamplingDepth: element.minSamplingDepth,
                        maxSamplingDepth: element.maxSamplingDepth,
                        color: element.color,
                        opacity: element.opacity,
                        style: element.style,
                        weight: element.weight
                    }))
                    break;
                case "vectorField":
                    let vectorFieldProps: VectorFieldProps = {
                        step: element.step,
                        color: element.color,
                        opacityStep: element.opacityStep,
                        xy(point) {
                            mathInstance.set_value("x", point[0]);
                            mathInstance.set_value("y", point[1]);
                            mathInstance.eval(element.xy); // for example: element.xy = "xy = (x^2, y*2)"
                            let out = vector2Schema.safeParse(mathInstance.get_value("xy"));
                            if (out.success) return out.data;
                            else throw new Error("Invalid return type from expression.\nMore info: " + out.error.toString());
                        },
                    }
                    // outJSX.push(React.createElement(Plot.VectorField, ));
                    break;
                case "point":
                    outJSX.push(React.createElement(Point, element))
                    break;
                case "pointAngle":
                    outJSX.push(React.createElement(Line.PointAngle, element))
                    break;
                case "pointSlope":
                    outJSX.push(React.createElement(Line.PointSlope, element))
                    break;
                case "throughPoints":
                    outJSX.push(React.createElement(Line.ThroughPoints, element))
                    break;
                case "segment":
                    outJSX.push(React.createElement(Line.Segment, element))
                    break;
                case "text":
                    outJSX.push(React.createElement(Text, element));
                    break;
                case "vector":
                    outJSX.push(React.createElement(Vector, element));
                    break;
                case "polygon":
                    outJSX.push(React.createElement(Polygon, element));
                    break;
            }
        })
    })

    return outJSX;
}

export function JSXToApplet(jsx: JSX.Element) {

}
