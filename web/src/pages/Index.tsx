import * as React from 'react';
import { useEffect, useState } from "react";
import {
  Mafs, CartesianCoordinates,
  Text as MafsText, Vector2,
  Polygon, Line, Circle, Point,
  useMovablePoint, useStopwatch
} from 'mafs';
import { 
  Box, Center, Divider,
  Text as ChakraText, Heading, Image,
  Grid, GridItem,
  List, ListItem, ListIcon, UnorderedList
 } from "@chakra-ui/react"
import styled from "@emotion/styled"
import { triggerAsyncId } from 'async_hooks';
import { number } from 'prop-types';
import { useResolution } from '../util/useResolution';
import { text } from 'stream/consumers';

type GraphPoints = Vector2[];

const Index: React.FC = (props) => {
  let [width, height] = useResolution();

  // second Mafs instance
  const assumeX = -0.33
  const assumeY = 3.7

  const answerX = -1.25
  const answerY = 0.67

  const triArr2: Array<number> = [-1.5, -2]

  // used as base; scrambled due to argument passing by Mafs
  // labeled as C
  const triA2 = useMovablePoint([triArr2[0] - 1.5, triArr2[1] + 0.5])

  // labeled as A
  const triB2 = useMovablePoint([triArr2[0] - 1.5, triArr2[1] - 2.5])
  
  //labeled as B
  const triC2 = useMovablePoint([triArr2[0] + 3.5, triArr2[1] - 2.5])
  
  // console.log(Math.sqrt(Math.pow((triArr2[0] - 1.5)-(triArr2[0] - 1.5),2)+Math.pow(((triArr2[1] + 0.5)-(triArr2[1] - 2.5)),2)) / 2)
  // 
  // console.log((triArr2[0] + 3.5) - (triArr2[0] - 1.5))
  // console.log((triArr2[0] - 0.5) - (triArr2[0] + 3.5))
  
  // end of instance

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
    <div className={"second"}>
      <Box w={'100vw'} h={'100vh'} bgColor={'#020207'}>
        <Box w={'100vw'} h={'100vh'} display={'inline-flex'}> {/* height value must sum to 100vh */}

          {/* TODO: add rotation to all elemetns */}
          <Box marginTop={'10vh'} marginLeft={'6vw'} textAlign={'center'} color={'#656565'} fontFamily={'CMU Serif, serif'} fontSize={'4rem'}>
              <ChakraText>2</ChakraText>
              <Divider />
              <ChakraText>3</ChakraText>
          </Box>

          <Box marginTop={'20vh'} marginLeft={'9vw'} textAlign={'center'} color={'#656565'} fontFamily={'CMU Serif, serif'} fontSize={'10rem'}>
            <ChakraText>π</ChakraText>
          </Box>

          <Box marginTop={'5vh'} marginLeft={'7vw'} textAlign={'center'} color={'#656565'} fontFamily={'CMU Serif, serif'} fontSize={'6rem'}>
            <ChakraText>
              √
              <ChakraText as='sub'>2</ChakraText>
            </ChakraText>
          </Box>

          <Box marginTop={'20vh'} marginLeft={'7vw'} textAlign={'center'} color={'#656565'} fontFamily={'CMU Serif, serif'} fontSize={'3.5rem'}>
            <ChakraText>p(x)</ChakraText>
          </Box>

          {/* right side of falling numbers starts here */}

          <Box marginTop={'23vh'} marginLeft={'28vw'} textAlign={'center'} color={'#656565'} fontFamily={'CMU Serif, serif'} fontSize={'7rem'}>
            <ChakraText>1</ChakraText>
          </Box>

          <Box marginTop={'8vh'} marginLeft={'8vw'} textAlign={'center'} color={'#656565'} fontFamily={'CMU Serif, serif'} fontSize={'7rem'} >
            <ChakraText>
              e
              <ChakraText as='sup' fontSize={'4rem'}> 3</ChakraText>
            </ChakraText>
          </Box>

          <Box marginTop={'35vh'} marginLeft={'3vw'} textAlign={'center'} color={'#656565'} fontFamily={'CMU Serif, serif'} fontSize={'3rem'} >
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
      <Grid
        h={'100vh'}
        w={'100vw'}
        templateRows={'repeat(4, 1fr)'}
        templateColumns={'repeat(6, 1fr)'}
      >
        {/* !!TODO: CMU SERIF -> CMU SERIF UPRIGHT */}
        {/* TODO: rework overflow: hidden to utilise alternative postitioning */}
        <GridItem rowStart={1} rowSpan={2} colSpan={3} bg={'#020207'} color={'#fff'}>
          <Heading as='h1' marginTop={'8vh'} marginLeft={'3vw'} size={'4xl'} overflow={'hidden'} fontFamily={'CMU Serif, serif'}>
            Web
          </Heading>

          {/* add bullet points as text decor */}
          <UnorderedList fontFamily={'Raleway'} fontSize={'3.5rem'} marginTop={'2vh'} marginLeft={'7vw'}>
            <ListItem>Online editing platform.</ListItem>
            <ListItem>Designed for classrooms.</ListItem>
            <ListItem>Clean and modern looks.</ListItem>
          </UnorderedList>
        </GridItem>

        <GridItem rowStart={3} rowSpan={2} colSpan={3} bg={'#020207'} color={'#fff'}> 
          <Heading as='h1' marginTop={'8vh'} marginLeft={'3vw'} size={'4xl'} overflow={'hidden'} fontFamily={'CMU Modern, serif'}>
            Mobile
          </Heading>

          <UnorderedList fontFamily={'Raleway'} fontSize={'3.5rem'} marginTop={'2vh'} marginLeft={'7vw'}>
            <ListItem>Online editing platform.</ListItem>
            <ListItem>Designed for classrooms.</ListItem>
            <ListItem>Clean and modern looks.</ListItem>
          </UnorderedList>
        </GridItem>
        
        <GridItem rowSpan={4} colSpan={1} bg={'#020207'}> 
          <Image src='web/src/assets/bracket.png' alt='Image of a curly bracket that points to the current selected mode of examples'/>
          img goes here
        </GridItem>
        
        <GridItem rowSpan={4} colSpan={2} bg={'#020207'}>
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
              subdivisions={false}
            />

              {/* x: -0.3 | y: 3.7 */}
            <MafsText x={assumeX} y={assumeY} size={45} attach="w">
              Assume that
            </MafsText>
            <Line.Segment 
              weight={5}
              color={"#2F94FF"}
              point1={[-3, 3.5]}
              point2={[-0.25, 3.5]}
            />
            <MafsText x={assumeX + 2.7} y={assumeY - 0.7} size={45} attach={"w"}>
              Solve for the hypothenuse
            </MafsText>
            <MafsText x={assumeX - 0.5} y={assumeY - 1.4} size={45} attach={"w"}>
              of △ABC.              
            </MafsText>

            {/* end of problem code */}
            {/* start of solution code */}

            <MafsText x={answerX} y={answerY} size={45} attach={"w"}>
              Solution
            </MafsText>
            <Line.Segment                
              weight={5}
              color={"#2F94FF"}
              point1={[answerX - 1.7, answerY - 0.25]}
              point2={[answerX, answerY - 0.25]}
            />

            <Polygon 
              points={[triA2.point, triB2.point, triC2.point]}
              color={"#fff"}
            />
            {/* <Point></Point> */}
            <MafsText x={triA2.x - 0.25} y={triA2.y + 0.3} size={35}>
              B
            </MafsText>

            {/* <Point x={Math.abs(triC2 - triA2)}/> */}

            {/*Alt styling: x={triB2.x - 0.25} y={triB2.y + 0.3} */}
            <MafsText x={triB2.x - 0.25} y={triB2.y - 0.3} size={35}>
              C
            </MafsText>
            
            <MafsText x={triC2.x + 0.25} y={triC2.y - 0.3} size={35}>
              A
            </MafsText>

            {triA2.element}
            {triB2.element}
            {triC2.element}
          </Mafs>
          {/* Add alt text for all math views and think about accessibility */}
        </GridItem>
        
        {/* ====*/}
        {/* <GridItem rowStart={1} rowSpan={2} colSpan={3} bg='papayawhip' />
        <GridItem rowStart={3} rowSpan={4} colSpan={3} bg='papayawhip' />
        <GridItem rowSpan={4} colSpan={3} bg='tomato' /> */}
      </Grid>
    </div>

    <div className="fourth">
      <Grid
        h={'100vh'}
        w={'100vw'}
        templateRows={'repeat(4, 1fr)'}
        templateColumns={'repeat(7, 1fr)'}
        gap={4}
        backgroundColor={'#020207'}
        // sanity check?
      >
        <GridItem 
          rowStart={2} rowSpan={1} 
          colStart={2} colSpan={2} 
          bg='tomato'
          overflow={'hidden'}
          fontSize={'2rem'}
          _hover={{
            backgroundColor: '#000',
            border: '3px dashed #2F94FF',
            color: '#fff',
            userSelct: 'none',
            textAlign: 'center',
          }}
          // _before={{
          //   content: "Web port!"
          // }}
        >
          3.14159265358979323846264338327950288419716939937510582097494459230781640628620899862803482534211706798214808651328230664709384460955058223
        </GridItem>
        <GridItem 
          rowStart={2} rowSpan={1} 
          colStart={4} colSpan={1} 
          bg='papayawhip'
          _hover={{
            backgroundColor: '#000',
            border: '3px dashed #2F94FF'
          }}
        >
          
        </GridItem>
          <GridItem 
          rowStart={3} rowSpan={1} 
          colStart={2} colSpan={3} 
          bg='papayawhip'
          _hover={{
            backgroundColor: '#000',
            border: '3px dashed #2F94FF'
          }}
        >
          
        </GridItem>
        <GridItem 
          rowStart={2} rowSpan={2} 
          colStart={5} colSpan={2} 
          bg='tomato'
          _hover={{
            backgroundColor: '#000',
            border: '3px dashed #2F94FF'
          }}
        >
          
        </GridItem>
      </Grid>
    </div>
  </div>
}

export default Index;
