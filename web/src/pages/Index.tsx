import * as React from 'react';
import { useEffect, useState } from "react";
import {
  CartesianCoordinates,
  Mafs, Text as MafsText, Line, Circle,
  Polygon, Vector2,
  useMovablePoint, useStopwatch, Point
} from 'mafs';
import { 
  Box, Text as ChakraText, Heading, 
  Center, Divider, Grid, GridItem,
  List, ListItem, ListIcon, UnorderedList,
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
      <Box w={'100vw'} h={'100vh'} bgColor={'#020207'}>
        <Box w={'100vw'} h={'100vh'} display={'inline-flex'}> {/* height value must sum to 100vh */}

          {/* TODO: add rotation to all elemetns */}
          <Box marginTop={'10vh'} marginLeft={'6vw'} textAlign={'center'} color={'#656565'} fontFamily={'CMU Serif, serif'} fontSize={'4rem'}>
              <ChakraText>2</ChakraText>
              <Divider />
              <ChakraText>3</ChakraText>
          </Box>

          <Box marginTop={'20vh'} marginLeft={'9vw'}textAlign={'center'} color={'#656565'} fontFamily={'CMU Serif, serif'} fontSize={'10rem'}>
            <ChakraText>π</ChakraText>
          </Box>

          <Box marginTop={'5vh'} marginLeft={'7vw'}textAlign={'center'} color={'#656565'} fontFamily={'CMU Serif, serif'} fontSize={'6rem'}>
            <ChakraText>
              √
              <ChakraText as='sub'>2</ChakraText>
            </ChakraText>
          </Box>

          <Box marginTop={'20vh'} marginLeft={'7vw'}textAlign={'center'} color={'#656565'} fontFamily={'CMU Serif, serif'} fontSize={'3.5rem'}>
            <ChakraText>p(x)</ChakraText>
          </Box>

          {/* right side of falling numbers starts here */}

          <Box marginTop={'23vh'} marginLeft={'28vw'}textAlign={'center'} color={'#656565'} fontFamily={'CMU Serif, serif'} fontSize={'7rem'}>
            <ChakraText>1</ChakraText>
          </Box>

          <Box marginTop={'8vh'} marginLeft={'8vw'}textAlign={'center'} color={'#656565'} fontFamily={'CMU Serif, serif'} fontSize={'7rem'} >
            <ChakraText>
              e
              <ChakraText as='sup' fontSize={'4rem'}> 3</ChakraText>
            </ChakraText>
          </Box>

          <Box marginTop={'35vh'} marginLeft={'3vw'}textAlign={'center'} color={'#656565'} fontFamily={'CMU Serif, serif'} fontSize={'3rem'} >
            <ChakraText>
              log
              <ChakraText as='sub' fontSize={'2rem'}> 2</ChakraText> 3
            </ChakraText>
          </Box>
          
        </Box>
        <Center marginTop={'-90vh'} w={'100vw'} h={'85vh'}> {/* height value must sum to 100vh */}
          <Box>
            <ChakraText color={'#fff'} textAlign={'center'} fontSize={'6.5rem'} fontFamily={'CMU Serif, serif'}>
              Designed for interactivity
            </ChakraText>
            <br/>
            <Box alignItems={'center'} textAlign={'center'}>
              <ChakraText color={'#bbb'} fontSize={'3.3rem'} fontFamily={'Raleway, serif'} letterSpacing={12} display={'inline-flex'}>
                (
                  <ChakraText bgGradient={'linear(to-r, #2F94FF, #2F37FF)'} bgClip={'text'}>students</ChakraText>
                + 
                  <ChakraText bgGradient={'linear(to-r, #FF862F, #FF2F2F)'} bgClip={'text'}>teachers</ChakraText> 
                )+
                  <ChakraText bgGradient={'linear(to-r, #C9FF2F, #2FFF8F)'} bgClip={'text'}>parents</ChakraText>
              </ChakraText>
            </Box>
          </Box>
        </Center>
      </Box>
    </div>
    <div className="third">
      <Box w={'100vw'} h={'100vh'} bgColor={'#020207'}>
        <Grid
          h='49vw'
          templateRows='repeat(4, 1fr)'
          templateColumns='repeat(6, 1fr)'
          gap={4}
        >
          {/* !!TODO: CMU SERIF -> CMU SERIF UPRIGHT */}
          {/* TODO: rework overflow: hidden to utilise alternative postitioning */}
          <GridItem rowStart={1} rowSpan={2} colSpan={3} bg='papayawhip'>
            <Heading as='h1' marginTop={'8vh'} marginLeft={'2vw'} size={'4xl'} overflow={'hidden'} fontFamily={'CMU Serif, serif'}>
              Web
            </Heading>

            {/* add bullet points as text decor */}
            <UnorderedList fontFamily={'Raleway'} fontSize={'3.5rem'} marginTop={'2vh'} marginLeft={'5vw'}>
              <ListItem>Online editing platform.</ListItem>
              <ListItem>Designed for classrooms.</ListItem>
              <ListItem>Clean and modern looks.</ListItem>
            </UnorderedList>
          </GridItem>

          <GridItem rowStart={3} rowSpan={2} colSpan={3} bg='papayawhip'> 
            <Heading as='h1' marginTop={'8vh'} marginLeft={'2vw'} size={'4xl'} overflow={'hidden'} fontFamily={'CMU Modern, serif'}>
              Mobile
            </Heading>

            <UnorderedList fontFamily={'Raleway'} fontSize={'3.5rem'} marginTop={'2vh'} marginLeft={'5vw'}>
              <ListItem>Online editing platform.</ListItem>
              <ListItem>Designed for classrooms.</ListItem>
              <ListItem>Clean and modern looks.</ListItem>
            </UnorderedList>
          </GridItem>
          
          <GridItem rowSpan={4} colSpan={1} bg='coral'> 
            <img src={'#'}/>
          </GridItem>
          
          <GridItem rowSpan={4} colSpan={2} bg='tomato'>
            <Mafs height={height} />
          </GridItem>
          
          {/* ====*/}
          {/* <GridItem rowStart={1} rowSpan={2} colSpan={3} bg='papayawhip' />
          <GridItem rowStart={3} rowSpan={4} colSpan={3} bg='papayawhip' />
          <GridItem rowSpan={4} colSpan={3} bg='tomato' /> */}
        </Grid>
      </Box>
    </div>

  </div>
}

export default Index;