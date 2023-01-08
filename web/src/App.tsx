import { ThemeContext } from "@emotion/react";
import {
  Mafs,
  Text,
  Line,
  useMovablePoint,
  Polygon,
  CartesianCoordinates 
} from "mafs"
import './App.css'

function App() {
  let height = window.innerHeight;
  const point = useMovablePoint([0, 0]);

  const lineStart = useMovablePoint([3.35, -0.2]);
  const lineEnd = useMovablePoint([1.9, -0.2]);

  {/*TODO: Refactor this into a template for all polygons*/}
  const a = [-6.5, -7] as [number, number]
  const b = [-6, -7] as [number, number]
  const c = [-6, -2] as [number, number]
  const d = [-6.5, -2] as [number, number]

  return (
    <div className="App">
      <Mafs pan={false} height={height}>
        <CartesianCoordinates 
        xAxis={{
          axis: false,
          lines: 0.5,
          labels: false
        }}
        yAxis={{
          axis: false,
          lines: 0.5,
          labels: false
        }}
        subdivisions={false} />
        
        <Text size={90} attach="n">
          Mathematics made visual
        </Text>
        {/*TODO: Fix actual font import to be CMU Serif Upright Italic*/}
        <Line.Segment 
          weight={5}
          color="#2F94FF"
          point1={lineStart.point}
          point2={lineEnd.point}
        />
        <Polygon 
          points={[a, b, c, d]}
          color="#D73DFE"
        />
      </Mafs>
    </div>
  )
}

export default App
