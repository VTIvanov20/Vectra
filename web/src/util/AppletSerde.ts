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

export function AppletToJSX(applet: AppletScaffold): JSX.Element[][] {
    const mathInstance = new evalexpr.JsEvalexprContext;
    // let resourceMap: { [key: string]:  }
    return applet.map(page => {
        // TODO: introduce the concept of variables with "$"
        return page.elements.map(element => {
            switch(element.type) {
                case "cartesianCoordinates":
                    return React.createElement(CartesianCoordinates, element)
                    break;
                case "circle":
                    return React.createElement(Circle, element)
                    break;
                case "ellipse":
                    return React.createElement(Ellipse, element)
                    break;
                // TODO: implement with movablePoint resource
                // case "movablePoint":
                //     outJSX.push(React.createElement(MovablePoint, { ...element }));
                //     break;
                // TODO: implement styling on ofX
                case "ofX":
                    return React.createElement(Plot.OfX, {
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
                    })
                    break;
                case "ofY":
                    return React.createElement(Plot.OfY, {
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
                    })
                    break;
                case "parametric":
                    return React.createElement(Plot.Parametric, {
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
                    })
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
                        }
                    }
                    if (element.xyOpacity)
                    {
                        let xyOpac: string = element.xyOpacity;
                        vectorFieldProps.xyOpacity = (point) => {
                            mathInstance.set_value("x", point[0])
                            mathInstance.set_value("y", point[1])
                            mathInstance.eval(xyOpac) // for example: element.xyOpacity = "o = x * y"
                            let out = mathInstance.get_value("o")
                            if (typeof out == 'number') return out
                            else throw new Error("Invalid return type from expression")
                        };
                    }
                    return React.createElement(Plot.VectorField, vectorFieldProps)
                    break;
                case "point":
                    return React.createElement(Point, element)
                    break;
                case "pointAngle":
                    return React.createElement(Line.PointAngle, element)
                    break;
                case "pointSlope":
                    return React.createElement(Line.PointSlope, element)
                    break;
                case "throughPoints":
                    return React.createElement(Line.ThroughPoints, element)
                    break;
                case "segment":
                    return React.createElement(Line.Segment, element)
                    break;
                case "text":
                    return React.createElement(Text, element)
                    break;
                case "vector":
                    return React.createElement(Vector, element)
                    break;
                case "polygon":
                    return React.createElement(Polygon, element)
                    break;
            }
        }) as JSX.Element[]
    })

    // return [];
}

export function JSXToApplet(jsx: JSX.Element) {

}
