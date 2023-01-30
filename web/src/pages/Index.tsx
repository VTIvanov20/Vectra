import * as React from 'react';
import { useEffect, useState, useRef } from "react";
import { Link } from 'react-router-dom';
import {
  Mafs, CartesianCoordinates,
  Text as MafsText,
  Polygon, Line, Circle, Point,
  useMovablePoint, useStopwatch,
  vec
} from 'mafs';
import {
  Box, Center, Divider,
  Text as ChakraText, Heading, Image,
  Grid, GridItem,
  Flex, Link as ChakraLink,
  ListItem, UnorderedList,
  Show, Hide
} from "@chakra-ui/react"
import bracketUrl from '../assets/img/bracket.png'
import { clamp } from "lodash"
import styled from "@emotion/styled"
import { triggerAsyncId } from 'async_hooks';
import { number } from 'prop-types';
import { useResolution } from '../util/useResolution';
import { text } from 'stream/consumers';
import { BlockList } from 'net';
import { setMaxIdleHTTPParsers } from 'http';

// forward mafs type in global scope of module
type Vector2 = vec.Vector2;
type GraphPoints = Vector2[];

interface NumberProps {
  inputRange: string;
  step: number;
  opacity: number;
}

const useScroll = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  function handleScroll() {
    setScrollPosition(window.pageYOffset);
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  })

  return scrollPosition;
}

const Index: React.FC = (props) => {
  const [isHovered, setIsHovered] = useState(false);
  const scrollPosition = useScroll();
  const [shouldDraw, setShouldDraw] = useState(true);

  let [width, height] = useResolution();

  // second Mafs instance
  const assumeX = -0.4
  const assumeY = 3.7

  const answerX = -1.25
  const answerY = 0.67

  const triArr_2: Array<number> = [-1.5, -2]
  const pointC = [-3, -4.5] as [number, number]

  // used as base; scrambled due to argument passing by Mafs
  // labeled as B
  const triA_2 = useMovablePoint([triArr_2[0] - 1.5, triArr_2[1] + 0.5], {
    // constrain: ([y]) => [clamp(-1,(Math.round(y*2)/2), (Math.round(y*2)/2)), -1]
    constrain: ([y]) => [triArr_2[0] - 1.5, clamp(y, (Math.round(y * 2) / 2), (Math.round(y * 2) / 2))]
  })

  //labeled as A Math.round(x*2)/2, Math.round(y*2)/2
  const triC_2 = useMovablePoint([triArr_2[0] + 3.5, triArr_2[1] - 2.5], {
    constrain: ([x]) => [clamp(x, (Math.round(x * 2) / 2), (Math.round(x * 2) / 2)), pointC[1]]
  })

  let sideA = Math.abs(Math.abs(triA_2.y) - Math.abs(-4.5))
  let sideB = Math.abs(triC_2.x) + Math.abs(-3)
  let hypothenuse = Math.sqrt(Math.pow(sideA, 2) + Math.pow(sideB, 2))

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

  const canvasRef = useRef<HTMLCanvasElement>(null);
  let context: CanvasRenderingContext2D | null | undefined = null;

  const drawText = (text: string, fontSize: number) => {
    if (!context) return;

    text
      .split('\n')
      .forEach((e, i) => {
        if (!context) return;
        context.font = `normal normal ${fontSize}px SF Pro Display`;
        context.textBaseline = 'middle';

        context.fillText(e, 0.5, 1.75 + 3 * i);
      })
  }

  const drawAnimatedText = () => {
    if (!shouldDraw) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = context;
    if (!ctx) return;

    devicePixelRatio = 10;
    let scale = window.devicePixelRatio;

    let canvasHeight = 55, canvasWidth = 134;
    // let contentX = canvasWidth / 2;
    // let contentY = canvasHeight / 2;    

    canvas.style.height = canvasHeight + 'vh';
    canvas.style.width = canvasWidth + 'vh';

    canvas.width = Math.floor(canvasWidth * 2 * scale) * 3.5;
    canvas.width = Math.floor(canvasHeight * scale) * 3.5;

    // var myFont = new FontFace('myFont', 'url(assets/fonts/myFont/myFont.otf)');
    var myFont = new FontFace('myFont', 'url(assets/fonts/SF-Pro-Display-Regular.otf');

    myFont.load().then(function (font) {
      document.fonts.add(myFont);
    });

    let piNum = "3.141592653589793238462\n643383279502884197169399\n10582097494459230781640628\n6208998628034825342117067\n9821480865132823066470938"

    var gradient = ctx.createLinearGradient(0, 0, 150, 100);
    ctx.scale(scale * 5, scale);

    gradient.addColorStop(0, "#fff");
    gradient.addColorStop(1, "#bbb");

    if (scrollPosition >= 1750) {
      setShouldDraw(false);
      for (let i = 0; i < piNum.length; i++) {
        setTimeout(() => {
          if (canvasRef.current)
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          ctx.fillStyle = gradient;
          drawText(piNum.slice(0, i), 3)
        }, 75 * i)
      }
    }

    const textWidth = ctx.measureText(piNum[0]).width;
  };

  useEffect(() => {
    if (canvasRef.current)
      context = canvasRef.current.getContext('2d');
    drawAnimatedText();
  }, [scrollPosition]);

  return <div className="main-parent">
    <div className="navbar-container">
      <Link className="navbar-brand" to="/Index">Vectra</Link>
      <div className="navbar-links">
        <Link className="navbar-link" to="/Login">Login</Link>
        <Link className="navbar-link" to="/Signup">Register</Link>
      </div>
    </div>
    <div className="first">

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <button className="buttonGo">Let's go</button>
      </div>

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

        <MafsText x={0} y={0} size={90} attach="n" >
          Mathematics made visual
        </MafsText>
        {/*TODO: Fix actual font import to be CMU Serif Upright Italic*/}
        <Line.Segment
          weight={5}
          color="#2F94FF"
          point1={[time * 2, -0.2]}
          point2={lineEnd.point}
        />

        <Circle center={[7, 3.5]} radius={3} color="#FF2121" />

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
      <Box w={'100vw'} h={'100vh'} bgColor={'bg'}>
        <Box w={{ base: '30rem', sm: '60rem', md: '100rem', lg: '200rem' }} h={'100vh'} display={'inline-flex'} overflow={'hidden'}> {/* height value must sum to 100vh  fontSize={{ base: '24px', md: '40px', lg: '56px' }}

          {/* TODO: add rotation to all elemetns */}
          <Box marginTop={'10vh'} marginLeft={'6vw'} textAlign={'center'} color={'darkGray'} fontFamily={'CMU Serif, serif'} fontSize={{ base: '1rem', sm: '2rem', md: '3rem', lg: '4rem' }} transform={'rotate(-8deg)'} >
            <ChakraText>2</ChakraText>
            <Divider />
            <ChakraText>3</ChakraText>
          </Box>

          <Box marginTop={'20vh'} marginLeft={'9vw'} textAlign={'center'} color={'darkGray'} fontFamily={'CMU Serif, serif'} fontSize={{ base: '4rem', sm: '6rem', md: '8rem', lg: '10rem' }} transform={'rotate(-12deg)'} >
            <ChakraText>π</ChakraText>
          </Box>

          <Box marginTop={'5vh'} marginLeft={'7vw'} textAlign={'center'} color={'darkGray'} fontFamily={'CMU Serif, serif'} fontSize={{ base: '1rem', sm: '2rem', md: '4rem', lg: '6rem' }} defaultValue={"1"} transform={'rotate(-8deg)'} >
            <ChakraText>
              √
              <ChakraText as='sub'>2</ChakraText>
            </ChakraText>
          </Box>

          <Box marginTop={'20vh'} marginLeft={'7vw'} textAlign={'center'} color={'darkGray'} fontFamily={'CMU Serif, serif'} fontSize={{ base: '0.5rem', sm: '1.5rem', md: '2.5rem', lg: '3.5rem' }} transform={'rotate(-15deg)'} >
            <ChakraText>p(x)</ChakraText>
          </Box>

          {/* right side of falling numbers starts here */}

          <Box marginTop={'23vh'} marginLeft={'23vw'} textAlign={'center'} color={'darkGray'} fontFamily={'CMU Serif, serif'} fontSize={{ base: '1rem', sm: '3rem', md: '5rem', lg: '7rem' }} transform={'rotate(15deg)'} >
            <ChakraText>1</ChakraText>
          </Box>

          <Box marginTop={'8vh'} marginLeft={'8vw'} textAlign={'center'} color={'darkGray'} fontFamily={'CMU Serif, serif'} fontSize={{ base: '1rem', sm: '3rem', md: '5rem', lg: '7rem' }} transform={'rotate(11deg)'} >
            <ChakraText>
              e
              <ChakraText as='sup' fontSize={'4rem'}> 3</ChakraText>
            </ChakraText>
          </Box>

          <Box marginTop={'35vh'} marginLeft={'3vw'} textAlign={'center'} color={'darkGray'} fontFamily={'CMU Serif, serif'} fontSize={{ base: '0.5rem', sm: '1rem', md: '2rem', lg: '3rem' }} transform={'rotate(20deg)'} >
            <ChakraText>
              log
              <ChakraText as='sub' fontSize={'2rem'}> 2</ChakraText> 3
            </ChakraText>
          </Box>

        </Box>
        <Center marginTop={'-90vh'} w={'100vw'} h={'85vh'}> {/* height value must sum to 100vh */}
          <Box>
            <ChakraText color={'headingWhite'} textAlign={'center'} fontSize={{ base: '3.5rem', sm: '4.5rem', md: '5.5rem', lg: '6.5rem' }} fontFamily={'CMU Serif Upright, serif'} zIndex={10} overflow={'hidden'}>
              Designed for interactivity
            </ChakraText>
            <br />
            <Box alignItems={'center'} textAlign={'center'}>
              <ChakraText color={'lightGray'} whiteSpace={'pre'} fontSize={{ base: '1.3rem', sm: '1.3rem', md: '2.3rem', lg: '3.3rem' }} fontFamily={'Raleway, serif'} letterSpacing={0} display={'inline-flex'}>
                <ChakraText fontFamily={'CMU Serif, serif'}>( </ChakraText>
                <ChakraText bgGradient={'linear(to-r, #2F94FF, #2F37FF)'} bgClip={'text'}>students</ChakraText>
                <ChakraText> + </ChakraText>
                <ChakraText bgGradient={'linear(to-r, #FF862F, #FF2F2F)'} bgClip={'text'}>teachers</ChakraText>
                <ChakraText fontFamily={'CMU Serif, serif'}> )</ChakraText>
                <ChakraText fontFamily={'Raleway, serif'}> + </ChakraText>
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
        <GridItem rowStart={1} rowSpan={2} colSpan={{ base: 6, sm: 6, md: 6, lg: 3 }} bg={'bg'} color={'headingWhite'} overflow={'hidden'}>
          <Heading as='h1' textAlign={{ base: 'center', sm: 'center', md: 'center', lg: 'left' }} marginTop={{ base: '0vh', md: '8vh' }} marginLeft={'3vw'} size={['3xl']} overflow={'hidden'} fontFamily={'CMU Serif Upright, serif'}>
            <u>Web</u>
          </Heading>

          {/* add bullet points as text decoration */}
          <UnorderedList textAlign={{ base: 'center', sm: 'center', md: 'center', lg: 'left' }} fontFamily={'Raleway Light'} fontSize={{ base: '2.5rem', lg: '3.2rem' }} marginTop={{ base: '0vh', md: '2vh' }} marginLeft={{ base: 'vw', md: '7.5vw' }} color={'lightGray'}>
            <ListItem overflow={'hidden'}>Online editing platform.</ListItem>
            <ListItem overflow={'hidden'}>Designed for classrooms.</ListItem>
            <ListItem overflow={'hidden'}>Clean and modern looks.</ListItem>
          </UnorderedList>
        </GridItem>

        <GridItem rowStart={3} rowSpan={2} colSpan={{ base: 6, sm: 6, md: 6, lg: 3 }} bg={'bg'} color={'headingWhite'} overflow={'hidden'}>
          <Heading as='h1' textAlign={{ base: 'center', sm: 'center', md: 'center', lg: 'left' }} marginTop={{ base: '0vh', md: '8vh' }} marginLeft={'3vw'} size={['3xl']} overflow={'hidden'} fontFamily={'CMU Serif Upright, serif'}>
            <u>Mobile</u>
          </Heading>

          <UnorderedList textAlign={{ base: 'center', sm: 'center', md: 'center', lg: 'left' }} fontFamily={'Raleway Light'} fontSize={{ base: '2.5rem', lg: '3.2rem' }} marginTop={{ base: '0vh', md: '2vh' }} marginLeft={{ base: 'vw', md: '7.5vw' }} color={'lightGray'} overflow={'hidden'}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}>
            <ListItem overflow={'hidden'}>Usable for everybody.</ListItem>
            <ListItem overflow={'hidden'}>Take a picture. Upload it.</ListItem>
            <ListItem overflow={'hidden'}>View shape geometry online.</ListItem>
          </UnorderedList>
        </GridItem>

        <Show above={'lg'}>
          <GridItem height={'100vh'} rotate={`$(bracketRotation)deg`} rowSpan={4} colSpan={1} bg={'bg'} color={'white'} overflow={'hidden'} userSelect={'none'}>
            <Image src={bracketUrl} alt='Image of a curly bracket that points to the current selected mode of examples' />
          </GridItem>
        </Show>

        <Show above={'lg'}>
          <GridItem rowSpan={4} colSpan={2} bg={'bg'}>
            <Mafs height={height} pan={false}>
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
              <MafsText x={assumeX + 2.65} y={assumeY - 0.8} size={45} attach={"w"}>
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
                points={[triA_2.point, pointC, triC_2.point]}
                color={"#CC2727"}
              />
              <MafsText x={triA_2.x - 0.25} y={triA_2.y + 0.3} size={35}>
                B
              </MafsText>

              {/* <Point x={Math.abs(triC_2 - triA_2)}/> */}

              {/*Alt styling: x={triB_2.x - 0.25} y={triB_2.y + 0.3} */}
              <MafsText x={-3.25} y={-4.8} size={35}>
                C
              </MafsText>
              <Point x={-3} y={-4.5} color={'lightGray'} />

              <MafsText x={triC_2.x + 0.25} y={triC_2.y - 0.3} size={35}>
                A
              </MafsText>

              <MafsText x={answerX - 1.7} y={answerY - 0.9} attach={'e'}>
                If a = {sideA * 2} and b = {sideB * 2}, then ...
              </MafsText>

              <MafsText x={answerX + 1.3} y={answerY - 1.93} size={52} attach={'e'}   >
                c = {(hypothenuse * 2).toFixed(2)}
              </MafsText>

              <MafsText x={answerX + 1.3} y={answerY - 2.43} size={26} attach={'e'} >
                (since a^2 + b^2 = c^2)
              </MafsText>

              {triA_2.element}
              {/* {triB_2.element} */}
              {triC_2.element}
            </Mafs>
            {/* Add alt text for all math views and think about accessibility */}
          </GridItem>
        </Show>
      </Grid>
    </div>

    <div className="fourth">

      <Box h={'100vh'} w={'100vw'} bgColor={'bg'} >
        <Flex direction={['column', 'column', 'row', 'row']} h={'100vh'} w={'100vw'} justifyContent={'center'} alignItems={'center'} userSelect={'none'}>
          <Box className={'numberBox'} h={'55vh'} w={'75vh'}>
            <Box h={'25.5vh'} w={'75vh'} display={'flex'}>
              <ChakraLink href="/applet">
                <Box h={'25.5vh'} w={'45.5vh'} bgColor={'transparent'} color={'transparent'} fontSize={'4xl'}
                  _hover={{
                    backgroundColor: '#000',
                    border: '3px dashed #2F94FF',
                    color: '#fff',
                    display: 'flex',
                    textAlign: 'center',
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignSelf: 'cetner',
                  }}
                >
                  Explore public applets
                </Box>
              </ChakraLink>

              {/* Spacer - sm*/}
              <Box h={'25.5vh'} w={'4vh'} bgColor={'black'} />

              <ChakraLink href="/">
                <Box h={'25.5vh'} w={'25.5vh'} bgColor={'transparent'} color={'transparent'} fontSize={'4xl'}
                  _hover={{
                    backgroundColor: '#000',
                    border: '3px dashed #2F94FF',
                    color: '#fff',
                    display: 'flex',
                    textAlign: 'center',
                    alignItems: 'center',
                    justifyContent: 'center',
                    alignSelf: 'cetner',

                  }}
                >*filler content*</Box>
              </ChakraLink>
            </Box>

            {/* Spacer - md*/}
            <Box h={'4vh'} w={'75vh'} bgColor={'black'} />
            <ChakraLink href="/editor">
              <Box h={'25.5vh'} w={'75vh'} bgColor={'transparent'} color={'transparent'} fontSize={'4xl'}
                _hover={{
                  backgroundColor: '#000',
                  border: '3px dashed #2F94FF',
                  color: '#fff',
                  display: 'flex',
                  textAlign: 'center',
                  alignItems: 'center',
                  justifyContent: 'center',
                  alignSelf: 'cetner',
                }}
              >
                Try out the online editor
              </Box>
            </ChakraLink>
          </Box>

          {/* Spacer - lg*/}
          <Box className={'spacerBox'} h={'55vh'} w={'2vw'} bgColor={'black'} />

          <ChakraLink href="/">
            <Box className={'numberBox'} h={'55vh'} w={'55vh'} bgColor={'transparent'} color={'transparent'} fontSize={'4xl'}
              _hover={{
                backgroundColor: '#000',
                border: '3px dashed #2F94FF',
                color: '#fff',
                display: 'flex',
                textAlign: 'center',
                alignItems: 'center',
                justifyContent: 'center',
                alignSelf: 'cetner',
              }}
            >
              *mockup of a phone with mobile design*
            </Box>
          </ChakraLink>
          <canvas id="canvas" width={'133vh'} ref={canvasRef} />
        </Flex>
      </Box>
    </div>
  </div>
}

export default Index;
