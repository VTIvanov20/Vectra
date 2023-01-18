import { Theme } from 'mafs';
import { z } from 'zod';
import { resourceSchema, pageSchema, childSchema, appletSchema } from './mafs.zod';

// CartesianCoordinates - CartesianCoordinatesProps - done
// Transform - TransformProps - on hold

// Plot.OfX - OfXProps - on hold (maybe evalexpr)
// Plot.OfY - OfYProps - on hold (maybe evalexpr)
// Plot.VectorField - VectorFieldProps - on hold (maybe evalexpr)
// Plot.Parametric - ParametricProps extends Stroked - on hold (maybe evalexpr)

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

export type ResourceScaffold = z.infer<typeof resourceSchema>
export type ChildScaffold = z.infer<typeof childSchema>
export type PageScaffold = z.infer<typeof pageSchema>
export type AppletScaffold = z.infer<typeof appletSchema>

export { resourceSchema, pageSchema, childSchema, appletSchema };