import { ThemeContext } from "@emotion/react";
import {
  Mafs,
  Text,
  Line,
  useMovablePoint,
  Polygon,
  CartesianCoordinates,
  vec,
  Vector2,
  Circle,
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

  
  const lineStart = useMovablePoint([3.35, -0.2]);
  const lineEnd = useMovablePoint([1.9, -0.2]);
  
  const col1: Points = [[-6, -7], [-5.5, -7], [-5.5, -3], [-6, -3]]
  
  // bottom left, bottom right, top right, top left 
  const blValue = col1[0][0], brValue = col1[0][1], 
  trValue = col1[2][0], tlValue = col1[2][1]
  
  {/* 
  to simplify total positioning, the code has been reformatted
  const col2: Points = [[-5.5, -7], [-5, -7], [  -5,   -2], [  -5.5, -2]]
*/}

const col2: Points = [
  [(blValue + 0.5), brValue],
  [(trValue + 0.5), brValue], 
  [(trValue + 0.5), (tlValue + 0.5)], 
  [(blValue + 0.5), (tlValue + 0.5)]
]

// const col3: Points = [[-4.99, -7], [-4.5, -7], [-4.5, -1.5], [-4.99, -1.5]]
const col3: Points = [
  [(blValue + 1.01), brValue],
  [(trValue + 1), brValue], 
  [(trValue + 1), (tlValue + 1.5)], 
  [(blValue + 1.01), (tlValue + 1.5)]
]

// const col4: Points = [[-4.99, -7], [-4.5, -7], [-4.5, -1.5], [-4.99, -1.5]]
const col4: Points = [
  [(blValue + 1.51), brValue],
  [(trValue + 1.5), brValue], 
  [(trValue + 1.5), (tlValue + 1)], 
  [(blValue + 1.51), (tlValue + 1)]
]

// no comment :(
  const col5: Points = [
    [(blValue + 2), brValue],
    [(trValue + 2), brValue], 
    [(trValue + 2), (tlValue + 0.5)], 
    [(blValue + 2), (tlValue + 0.5)]
  ]
  
  const circleDrag = useMovablePoint([
    Math.sqrt(49) / 7,
    Math.sqrt(49) / 7,
    //7, 3.5
  ]);

  const radius = vec.mag(circleDrag.point)
  
  
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

        <Circle center={[7, 3.5]} radius={radius}/>

        <Polygon 
          points={col1}
          color="#D73DFE"
        />
        <Polygon 
          points={col2}
          color="#D73DFE"
        />
        <Polygon 
          points={col3}
          color="#86FE3D"
        />
        <Polygon 
          points={col4}
          color="#86FE3D"
        />
        <Polygon 
          points={col5}
          color="#86FE3D"
        />
        {circleDrag.element}
      </Mafs>
    </div>
  )
}

export default App
