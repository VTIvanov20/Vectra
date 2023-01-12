import * as React from 'react';
import { useEffect, useState } from "react";
import {
  CartesianCoordinates,
  Mafs, Text as MafsText, Line, Circle,
  Polygon, Vector2,
  useMovablePoint, useStopwatch, Point
} from 'mafs';
import { 
  Box, Text as ChakraText, Center
 } from "@chakra-ui/react"

type GraphPoints = Vector2[];

const Index: React.FC = (props) => {
  let [height, setHeight] = useState(window.innerHeight);
  let [width, setWidth] = useState(window.innerWidth);
  
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
  
  const col1: GraphPoints = [[-6, -7], [-5.5, -7], [-5.5, -3], [-6, -3]]
  
  // bottom left, bottom right, top right, top left 
  const blValue = col1[0][0], brValue = col1[0][1], 
  trValue = col1[2][0], tlValue = col1[2][1]
  
  {/* 
  to simplify total positioning, the code has been reformatted
  const col2: GraphPoints = [[-5.5, -7], [-5, -7], [  -5,   -2], [  -5.5, -2]]
  */}

  const col2: GraphPoints = [
    [(blValue + 0.5), brValue],
    [(trValue + 0.5), brValue], 
    [(trValue + 0.5), (tlValue + 0.5)], 
    [(blValue + 0.5), (tlValue + 0.5)]
  ]

  // const col3: GraphPoints = [[-4.99, -7], [-4.5, -7], [-4.5, -1.5], [-4.99, -1.5]]
  const col3: GraphPoints = [
    [(blValue + 1.01), brValue],
    [(trValue + 1), brValue], 
    [(trValue + 1), (tlValue + 1.5)], 
    [(blValue + 1.01), (tlValue + 1.5)]
  ]

  // const col4: GraphPoints = [[-4.99, -7], [-4.5, -7], [-4.5, -1.5], [-4.99, -1.5]]
  const col4: GraphPoints = [
    [(blValue + 1.51), brValue],
    [(trValue + 1.5), brValue], 
    [(trValue + 1.5), (tlValue + 1)], 
    [(blValue + 1.51), (tlValue + 1)]
  ]

  // no comment :(
  const col5: GraphPoints = [
    [(blValue + 2), brValue],
    [(trValue + 2), brValue], 
    [(trValue + 2), (tlValue + 0.5)], 
    [(blValue + 2), (tlValue + 0.5)]
  ]
  
  // borken, will fix later on
  // const circleDrag = useMovablePoint([
  //   Math.sqrt(49) / 7,
  //   Math.sqrt(49) / 7,
  //   7, 3.5
  // ]);

  // const radius = vec.mag(circleDrag.point)


  //TODO: simplify the following lines, by using a map
  const triArr: Array<number> = [6, -0.5]

  // used as base
  const triA = useMovablePoint([triArr[0], triArr[1]])

  // points have to be [2, -2]
  const triB = useMovablePoint([triArr[0] - 4, triArr[1] - 1.5])

  // points have to be [4, -3]
  const triC = useMovablePoint([triArr[0] - 2, triArr[1] - 2.5])

  // line animation
  const { time, start, stop } = useStopwatch({ endTime: 2 })
  useEffect(() => start(), [start])

  return <div className="main-parent">
    <div className="mafs-landing">
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
    
    <MafsText x={0} y={0} size={90} attach="n">
      Mathematics made visual
    </MafsText>
    {/*TODO: Fix actual font import to be CMU Serif Upright Italic*/}
    <Line.Segment 
      weight={5}
      color="#2F94FF"
      point1={[time * 2, -0.2]}
      point2={lineEnd.point}
    />

    <Circle center={[7, 3.5]} radius={3} color="#FF2121"/>

    {/* Begining of graphs */}
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
    {/* End of graphs */}

    {/* Begining of triangle polygon */}
    <Polygon 
      points={[triA.point, triB.point, triC.point]}
      color="#2F94FF"
      />
    {/* End of triangle polygon */}

    {triA.element}
    {triB.element}
    {triC.element}
  </Mafs>
    </div>
    <div className="second">
      <Box 
        width={'100vw'} 
        height={'100vh'}
        bgColor={'#020207'}
      >

      {/* <ChakraText
        color={'#fff'}
        marginTop={"49vh"}
        marginLeft={"49vw"}
        fontFamily={'CMU Serif, serif'}
      >
        Designed for interactivity.
      </ChakraText> */}
      <Center
        w={'inherit'}
        h={'inherit'}
        color={'#fff'}
        fontFamily={'CMU Serif, serif'}
        margin={'0 auto'}
        fontSize={'4.3rem'}
      >
        Designed for interactivity.
      </Center>
      <Center
        color={'#bbb'}
        fontFamily={'Raleway, serif'}
        margin={'-35vh'}
        fontSize={'3.3rem'}
        letterSpacing={8}
      >
        (students + teachers) + parents
      </Center>
    </Box>
    </div>

  </div>
}

export default Index;