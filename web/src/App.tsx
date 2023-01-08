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
        <CartesianCoordinates subdivisions={2} />
        
        <Text x={-4.3} y={2.5} attach="n" color="#5d8ca3">
          hello world
        </Text>
      </Mafs>
    </div>
  )
}

export default App
