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

  const poly: Points = [[-6, -7], [-5.5, -7], [-5.5, -3], [-6, -3]]

  // bottom left, bottom right, top right, top left 
  const blValue = poly[0][0], brValue = poly[0][1], 
        trValue = poly[2][0], tlValue = poly[2][1]
  
  {/* 
    to simplify total positioning, the code has been reformatted
    const poly2: Points = [[-5.5, -7], [-5, -7], [  -5,   -2], [  -5.5, -2]]
  */}
  
  const poly2: Points = [
    [(blValue + 0.5), brValue],
    [(trValue + 0.5), brValue], 
    [(trValue + 0.5), (tlValue + 0.5)], 
    [(blValue + 0.5), (tlValue + 0.5)]
  ]

  // const poly3: Points = [[-4.99, -7], [-4.5, -7], [-4.5, -1.5], [-4.99, -1.5]]
  const poly3: Points = [
    [(blValue + 1.01), brValue],
    [(trValue + 1), brValue], 
    [(trValue + 1), (tlValue + 1.5)], 
    [(blValue + 1.01), (tlValue + 1.5)]
  ]

  // const poly4: Points = [[-4.99, -7], [-4.5, -7], [-4.5, -1.5], [-4.99, -1.5]]
  const poly4: Points = [
    [(blValue + 1.51), brValue],
    [(trValue + 1.5), brValue], 
    [(trValue + 1.5), (tlValue + 1)], 
    [(blValue + 1.51), (tlValue + 1)]
  ]

  // no comment :(
  const poly5: Points = [
    [(blValue + 2), brValue],
    [(trValue + 2), brValue], 
    [(trValue + 2), (tlValue + 0.5)], 
    [(blValue + 2), (tlValue + 0.5)]
  ]

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
        <Polygon 
          points={poly2}
          color="#D73DFE"
        />
        <Polygon 
          points={poly3}
          color="#86FE3D"
        />
        <Polygon 
          points={poly4}
          color="#86FE3D"
        />
        <Polygon 
          points={poly5}
          color="#86FE3D"
        />
      </Mafs>
    </div>
  )
}

export default App
