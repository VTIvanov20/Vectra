import {
  Mafs,
  Text,
  Line,
  useMovablePoint, 
  CartesianCoordinates 
} from "mafs"
import './App.css'

function App() {
  let height = window.innerHeight;
  const point = useMovablePoint([0, 0]);

  const pointStart = useMovablePoint([3.35, -0.2]);
  const pointEnd = useMovablePoint([1.9, -0.2]);

  return (
    <div className="App">
      <Mafs height={height}>
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
          point1={pointStart.point}
          point2={pointEnd.point}
        />
      </Mafs>
    </div>
  )
}

export default App
