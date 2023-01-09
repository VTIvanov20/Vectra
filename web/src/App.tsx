import { ThemeContext } from "@emotion/react";
import {
  Mafs,
  Text,
  Line,
  useMovablePoint,
  Polygon,
  CartesianCoordinates,
  Vector2,
} from "mafs"
import { useEffect, useState } from "react";
import './App.css'

type Points = Vector2[];

function App() {
  let [height, setHeight] = useState(window.innerHeight);

  useEffect(() => {
    function handleResize(this: Window, ev: UIEvent) {
      setHeight(window.innerHeight);
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    }
  })

  const point = useMovablePoint([0, 0]);

  const lineStart = useMovablePoint([3.35, -0.2]);
  const lineEnd = useMovablePoint([1.9, -0.2]);

  {/*TODO: Refactor this into a template for all polygons*/}
  const poly: Points = [[-6.5, -7], [-6, -7], [-6, -2], [-6.5, -2]]

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
        
        <Text x={0} y={0} size={90} attach="n">
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
          points={poly}
          color="#D73DFE"
        />
      </Mafs>
    </div>
  )
}

export default App
