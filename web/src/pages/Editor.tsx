import { Mafs, CartesianCoordinates } from "mafs";
import React, { useState } from "react";
import { z, ZodObjectDef, ZodTypeDef } from "zod";
import { AppletToJSX } from "../util/AppletSerde";
import { elementSchema } from "../util/mafs.zod";
import { AppletScaffold } from "../util/MafsSchema";
import { useResolution } from "../util/useResolution";
import { 
    Box,
    Grid, GridItem, Select,
    Input, InputGroup, InputLeftAddon, 
    Stack, StackDivider, VStack,
    Drawer, DrawerBody, DrawerFooter, DrawerHeader, 
    DrawerOverlay, DrawerContent, Button,
    AspectRatio, useDisclosure, Center, Flex, Spacer, FormControl, FormLabel,
    
} from "@chakra-ui/react";
import { Formik, Form, Field } from "formik";

export const EditorView: React.FC = (props) => {
    const [currentApplet, setCurrentApplet] = useState<AppletScaffold>([]);
    const [width, height] = useResolution();

    const { isOpen, onOpen, onClose } = useDisclosure()
    const [setPlacement] = React.useState('left')


    return <Box w={width}>
        <Button 
            onClick={onOpen} position={'absolute'} bottom={'2vw'} right={'2vw'}
            h={'8vh'} w={'8vh'}
            borderRadius={'100%'} borderColor={'themeBlue'}
            bgColor={'transparent'} color={'themeBlue'} fontSize={'1.5em'} textAlign={'center'}
        >
            +
        </Button>
        <Drawer
            size={'sm'}
            placement={'left'}
            isOpen={isOpen}
            onClose={onClose}
            // backgroundColor={'sidePanelBg'}
            // finalFocusRef={btnRef}
        >
            <DrawerOverlay />
            <DrawerContent>

                {/* start of name header */}

                <DrawerHeader borderBottomColor={'themeBlue'} borderBottomWidth={'1px'}> 
                    New Applet
                </DrawerHeader>

                {/* start of content section */}

                <DrawerBody>
                    <EditorSidebar />
                </DrawerBody>

                {/* start of button footer */}
                
                <DrawerFooter>
                    <Flex>
                        <Box>
                        <Button onClick={onClose} bgColor={'#DCE2E9'} w={'10vw'}>
                            Close
                        </Button>
                        </Box>
                        <Spacer />
                        <Box>
                        <Button onClick={onClose} w={'10vw'} bgColor={'themeBlue'} textColor={'white'}>
                            Save
                        </Button>
                        </Box>
                    </Flex>
                </DrawerFooter>

            </DrawerContent>
        </Drawer>
        <Mafs {...{height}}>
            <EditorMafs />
        </Mafs>

    {/* <Grid
    h='100vh'
    templateRows='repeat(1, 1fr)'
    templateColumns='repeat(4, 1fr)'
    gap={0}
>
    <GridItem rowSpan={1} colSpan={1} bg='tomato'><EditorSidebar /></GridItem>
    <GridItem rowSpan={1} colSpan={3}>
        <Mafs {...{height}}>
            <EditorMafs />
        </Mafs>
    </GridItem>
</Grid> */}
</Box>;
}

const StringInput: React.FC<{name: string}> = ({ name }) => {
    return <Field name={name}>
        {(props: any) => {
            console.log(props);
            return <FormControl>
                <FormLabel>{name}</FormLabel>
            </FormControl>
        }}
    </Field>
}

const NumberInput: React.FC<{name: string}> = ({ name }) => {
    return <Field name={name}>
        {(props: any) => {
            console.log(props);
            return <FormControl>
                <FormLabel>{name}</FormLabel>
            </FormControl>
        }}
    </Field>
};

const BigIntInput: React.FC<{name: string}> = ({ name }) => {
    return <Field name={name}>
        {(props: any) => {
            console.log(props);
            return <FormControl>
                <FormLabel>{name}</FormLabel>
            </FormControl>
        }}
    </Field>
};

const BooleanInput: React.FC<{name: string}> = ({ name }) => {
    return <Field name={name}>
        {(props: any) => {
            console.log(props);
            return <FormControl>
                <FormLabel>{name}</FormLabel>
            </FormControl>
        }}
    </Field>
};

const ArrayInput: React.FC<{name: string}> = ({ name }) => {
    return <Field name={name}>
        {(props: any) => {
            console.log(props);
            return <FormControl>
                <FormLabel>{name}</FormLabel>
            </FormControl>
        }}
    </Field>
};

function ZodSchemaToJSX(def: any, fieldName: string = "unknown", optional: boolean = false): JSX.Element {
    const { typeName } = def;

    if (typeName == undefined)
    {
        console.log(typeName);
        debugger;
        throw new Error('Something bad happened!');
    }
    
    switch (typeName) {
        case z.ZodFirstPartyTypeKind.ZodString:
            return <StringInput name={fieldName} />;
        case z.ZodFirstPartyTypeKind.ZodNumber:
            return <NumberInput name={fieldName} />;
        case z.ZodFirstPartyTypeKind.ZodObject:
            return <>
            {Object
                .entries(def.shape())
                .map((e) => ZodSchemaToJSX((e[1] as any)._def, e[0]))}
            </>
        case z.ZodFirstPartyTypeKind.ZodBigInt:
            return <BigIntInput name={fieldName} />;
        case z.ZodFirstPartyTypeKind.ZodBoolean:
            return <BooleanInput name={fieldName} />;
        case z.ZodFirstPartyTypeKind.ZodUndefined:
            // return { type: "undefined" };
            // return <Field name="unkno_wn" value={undefined} disabled />;
            return <></>;
        case z.ZodFirstPartyTypeKind.ZodNull:
            // return { type: "null" };
            // return <Field name="unknow_n" value={null} disabled />;
            return <></>;
        case z.ZodFirstPartyTypeKind.ZodArray:
            // ZodSchemaToJSON(def.type._def)    
            return <ArrayInput name={fieldName} />
        case z.ZodFirstPartyTypeKind.ZodUnion:
        case z.ZodFirstPartyTypeKind.ZodDiscriminatedUnion:
            return def.options.map((e: ZodObjectDef) => ZodSchemaToJSX((e as any)._def, ));
        // case z.ZodFirstPartyTypeKind.ZodIntersection:
        //     return parseIntersectionDef(def, refs);
        case z.ZodFirstPartyTypeKind.ZodTuple:
            return def.items.map((e: any) => ZodSchemaToJSX((e as any)._def));
        case z.ZodFirstPartyTypeKind.ZodLiteral:
            // return { type: 'literal', data: def.value };
            return <Field name={fieldName} />
        // case z.ZodFirstPartyTypeKind.ZodNullable:
        //     return parseNullableDef(def, refs);
        case z.ZodFirstPartyTypeKind.ZodOptional:
            return ZodSchemaToJSX(def.innerType._def, fieldName, true);
        // case z.ZodFirstPartyTypeKind.ZodAny:
        //     return parseAnyDef();
        // case z.ZodFirstPartyTypeKind.ZodUnknown:
        //     return parseUnknownDef();
        // case z.ZodFirstPartyTypeKind.ZodDefault:
        //     return parseDefaultDef(def, refs);
        // case z.ZodFirstPartyTypeKind.ZodBranded:
        //     return parseBrandedDef(def, refs);
        // case z.ZodFirstPartyTypeKind.ZodCatch:
        //     return parseCatchDef(def, refs);
        // case z.ZodFirstPartyTypeKind.ZodPipeline:
        //     return parsePipelineDef(def, refs);
        case z.ZodFirstPartyTypeKind.ZodFunction:
        case z.ZodFirstPartyTypeKind.ZodVoid:
        case z.ZodFirstPartyTypeKind.ZodSymbol:
            // return undefined;
            return <></>;
        default:
            // return ((_: never) => undefined)(typeName);
            // return undefined;
            return <></>;
      }
}

const EditorSidebar: React.FC = (props) => {
    // console.log(ZodSchemaToJSON(elementSchema._def));
    const elementTypes = elementSchema._def.options.map(e => e.shape.type._def.value);
    const [chosenType, setChosenType] = useState<number>(0);
    console.log(elementSchema);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log(event.target)
    }

    return <Box><VStack
        spacing={4}
        align='initial'
        padding='1vw'>
        <FormControl isRequired>
            <FormLabel>Type</FormLabel>
            <Select onChange={e => setChosenType(Number(e.target.value))} variant='outline' bg={'themeBlue'} fontFamily={'Raleway, regular'}>
                {elementTypes.map((e, i) => <option
                        value={i}
                        key={i}
                    >{(() => {
                        let out = e.replace(/([A-Z][a-z])/g,' $1').replace(/(\d)/g,' $1')
                        // why is capitalizing a string in js so hard
                        out = out[0].toUpperCase() + out.slice(1);
                        return out;
                    })()}</option>
                )}
            </Select>
        </FormControl>
        <Formik initialValues={{}} onSubmit={e => console.log(e)}>
            {(props) => {
                console.log(props);

                return <Form>
                    {/* <InputGroup>
                        <InputLeftAddon children={'Type'} />
                        <Input bg={'#D7E0EA'} placeholder={'type'} />
                    </InputGroup> */}
                    {ZodSchemaToJSX(elementSchema._def.options[chosenType]._def)}
                    <Box>
                        <Center>
                        </Center>
                    </Box>
                </Form>
            }}
        </Formik>
    </VStack>
    </Box>
}

const EditorMafs: React.FC = (props) => {
    return <CartesianCoordinates />
}