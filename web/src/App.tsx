import {
  Mafs,
  Text, 
  useMovablePoint, 
  CartesianCoordinates 
} from "mafs"
import './App.css'

function App() {
  const point = useMovablePoint([0, 0]);
  let height = window.innerHeight;

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
      </Mafs>
    </div>
  )
}

export default App
