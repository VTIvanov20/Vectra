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
    AspectRatio, useDisclosure, Center, Flex, Spacer, FormControl, FormLabel, NumberInput, NumberInputStepper, NumberInputField, NumberIncrementStepper, NumberDecrementStepper, Checkbox, Divider,
    
} from "@chakra-ui/react";
import { Formik, Form, Field, FormikProps } from "formik";

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
                        <Button onClick={onClose} w={'10vw'} bgColor={'#DCE2E9'} textColor={'black'}>
                            Close
                        </Button>
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

const StringInput: React.FC<{name: string, optional: boolean}> = ({ name, optional }) => {
    return <Field name={name} required={!optional}>
        {(props: FormikProps<any>) => {
            console.log(props);
            return <FormControl isRequired={!optional}>
                <FormLabel>{name}</FormLabel>
                <Input />
            </FormControl>
        }}
    </Field>
}

const _NumberInput: React.FC<{name: string, optional: boolean}> = ({ name, optional }) => {
    return <Field name={name} required={!optional}>
        {(props: FormikProps<any>) => {
            console.log(props);
            return <FormControl isRequired={!optional}>
                <FormLabel>{name}</FormLabel>
                <NumberInput>
                    <NumberInputField />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
            </FormControl>
        }}
    </Field>
};

const BigIntInput: React.FC<{name: string, optional: boolean}> = ({ name, optional }) => {
    return <Field name={name} required={!optional}>
        {(props: FormikProps<any>) => {
            console.log(props);
            return <FormControl isRequired={!optional}>
                <FormLabel>{name}</FormLabel>
                <NumberInput>
                    <NumberInputField />
                    <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                    </NumberInputStepper>
                </NumberInput>
            </FormControl>
        }}
    </Field>
};

const BooleanInput: React.FC<{name: string, optional: boolean}> = ({ name, optional }) => {
    return <Field name={name} required={!optional}>
        {(props: FormikProps<any>) => {
            console.log(props);
            return <FormControl isRequired={!optional}>
                <FormLabel>{name}</FormLabel>
                <Checkbox>{name}</Checkbox>
            </FormControl>
        }}
    </Field>
};

const ArrayInput: React.FC<{name: string, optional: boolean}> = ({ name, optional }) => {
    return <Field name={name} required={!optional}>
        {(props: FormikProps<any>) => {
            console.log(props);
            return <FormControl isRequired={!optional}>
                <FormLabel>{name}</FormLabel>
            </FormControl>
        }}
    </Field>
};

const UnionInput: React.FC<{name: string, unionDef: any, optional: boolean}> = ({ name, optional, unionDef }) => {
    const [chosenField, setChosenField] = useState<number>(0);
    
    let unionFields: JSX.Element[] = [];
    let unionOptions: JSX.Element[] = [];

    unionDef.options.forEach((e: any, i: number) => {
        unionOptions.push(<option value={i}>
            {((): string => {
                if (e._def.typeName == z.ZodFirstPartyTypeKind.ZodLiteral) {
                    return e._def.value.toString();
                } else {
                    return "custom";
                }
            })()}
        </option>)

        if (e._def.typeName != z.ZodFirstPartyTypeKind.ZodLiteral) {
            unionFields.push(ZodSchemaToJSX(e._def, name, optional));
        } else unionFields.push(ZodSchemaToJSX(e._def, name, optional));
    })

    return <>
        <FormControl isRequired={!optional}>
            <FormLabel>{name}</FormLabel>
            <Select onChange={e => setChosenField(Number(e.target.value))}>
                {...unionOptions}
            </Select>
        </FormControl>
        {unionFields[chosenField]}
    </>
}

function ZodSchemaToJSX(def: any, fName?: string, optional: boolean = false): JSX.Element {
    const { typeName } = def;

    if (typeName == undefined)
    {
        console.log(typeName);
        debugger;
        throw new Error('Something bad happened!');
    }
    
    let fieldName: string = "";
    if (fName) {
        fieldName = fName;
        if (typeName == z.ZodFirstPartyTypeKind.ZodObject)
            fieldName += '.';
    }

    switch (typeName) {
        case z.ZodFirstPartyTypeKind.ZodString:
            return <StringInput name={fieldName} {...{optional}} />;
        case z.ZodFirstPartyTypeKind.ZodNumber:
            return <_NumberInput name={fieldName} {...{optional}} />;
        case z.ZodFirstPartyTypeKind.ZodObject:
            return <VStack>
            {Object
                .entries(def.shape())
                .map((e) => <>{ZodSchemaToJSX((e[1] as any)._def, fieldName + e[0])}<Divider /></>)}
            </VStack>
        case z.ZodFirstPartyTypeKind.ZodBigInt:
            return <BigIntInput name={fieldName} {...{optional}} />;
        case z.ZodFirstPartyTypeKind.ZodBoolean:
            return <BooleanInput name={fieldName} {...{optional}} />;
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
            return <ArrayInput name={fieldName} {...{optional}} />
        case z.ZodFirstPartyTypeKind.ZodUnion:
        case z.ZodFirstPartyTypeKind.ZodDiscriminatedUnion:
            // return def.options.map((e: ZodObjectDef, i: number) => ZodSchemaToJSX((e as any)._def, `${fieldName}[${i}]`));
            return <UnionInput name={fieldName} {...{optional}} unionDef={def} />
        // case z.ZodFirstPartyTypeKind.ZodIntersection:
        //     return parseIntersectionDef(def, refs);
        case z.ZodFirstPartyTypeKind.ZodTuple:
            return def.items.map((e: any, i: number) => ZodSchemaToJSX((e as any)._def, `${fieldName}[${i}]`));
        case z.ZodFirstPartyTypeKind.ZodLiteral:
            // return { type: 'literal', data: def.value };
            return <Field name={fieldName} value={def.value} type='hidden' />
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
            <Select onChange={e => setChosenType(Number(e.target.value))} variant='outline' bg='themeBlue' fontFamily={'Raleway, regular'}>
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
        <Formik initialValues={{}} onSubmit={(e: { [key: string]: any }) => { e['type'] = elementTypes[chosenType]; console.log(e) }}>
            {(props: FormikProps<any>) => {
                console.log(props);

                return <Form onSubmit={props.handleSubmit}>
                    {/* <InputGroup>
                        <InputLeftAddon children={'Type'} />
                        <Input bg={'#D7E0EA'} placeholder={'type'} />
                    </InputGroup> */}
                    {ZodSchemaToJSX(elementSchema._def.options[chosenType]._def)}
                    <Button type='submit' bgColor={'themeBlue'}>
                        Submit
                    </Button>
                </Form>
            }}
        </Formik>
    </VStack>
    </Box>
}

const EditorMafs: React.FC = (props) => {
    return <CartesianCoordinates />
}