import { Mafs, CartesianCoordinates } from "mafs";
import React, { useState } from "react";
import { z, ZodObjectDef, ZodTypeDef } from "zod";
import { AppletToJSX } from "../util/AppletSerde";
import { elementSchema } from "../util/mafs.zod";
import { AppletScaffold } from "../util/MafsSchema";
import { useResolution } from "../util/useResolution";
import { 
    Container, Box,
    Grid, GridItem, Select,
    Input, InputGroup, InputLeftAddon, 
    Stack, StackDivider, VStack,
    Drawer, DrawerBody, DrawerFooter, DrawerHeader, 
    DrawerOverlay, DrawerContent, DrawerCloseButton, Button,
    AspectRatio, useDisclosure
} from "@chakra-ui/react";

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
                <DrawerHeader borderBottomColor={'themeBlue'} borderBottomWidth={'1px'}> 
                    New Applet
                </DrawerHeader>
                <DrawerBody>
                    <EditorSidebar />
                </DrawerBody>
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

type SimpleSchema = { [key: string]: string | string[] | SimpleSchema };

// const parseStringDef = () => 

function ZodSchemaToJSON(def: any): any {
    const { typeName } = def;

    if (typeName == undefined)
    {
        console.log(typeName);
        debugger;
        throw new Error('Something bad happened!');
    }
    
    switch (typeName) {
        case z.ZodFirstPartyTypeKind.ZodString:
            return { type: "string" };
        case z.ZodFirstPartyTypeKind.ZodNumber:
            return { type: "number" };
        case z.ZodFirstPartyTypeKind.ZodObject:
            let out: { [key: string]: any } = {};
            Object
                .entries(def.shape())
                .forEach(e => { let el: any = {}; out[e[0]] = ZodSchemaToJSON((e[1] as any)._def); return el; })
            return out;
        case z.ZodFirstPartyTypeKind.ZodBigInt:
            return { type: "bigint" };
        case z.ZodFirstPartyTypeKind.ZodBoolean:
            return { type: "boolean" };
        case z.ZodFirstPartyTypeKind.ZodUndefined:
            return { type: "undefined" };
        case z.ZodFirstPartyTypeKind.ZodNull:
            return { type: "null" };
        case z.ZodFirstPartyTypeKind.ZodArray:
            return { type: 'array', data: ZodSchemaToJSON(def.type._def) };
        case z.ZodFirstPartyTypeKind.ZodUnion:
        case z.ZodFirstPartyTypeKind.ZodDiscriminatedUnion:
            return def.options.map((e: ZodObjectDef) => ZodSchemaToJSON((e as any)._def));
        // case z.ZodFirstPartyTypeKind.ZodIntersection:
        //     return parseIntersectionDef(def, refs);
        case z.ZodFirstPartyTypeKind.ZodTuple:
            return def.items.map((e: any) => ZodSchemaToJSON((e as any)._def));
        case z.ZodFirstPartyTypeKind.ZodLiteral:
            return { type: 'literal', data: def.value };
        // case z.ZodFirstPartyTypeKind.ZodNullable:
        //     return parseNullableDef(def, refs);
        case z.ZodFirstPartyTypeKind.ZodOptional:
            return { type: 'optional', data: ZodSchemaToJSON(def.innerType._def) };
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
            return undefined;
        default:
            // return ((_: never) => undefined)(typeName);
            return undefined;
      }
}

const EditorSidebar: React.FC = (props) => {
    console.log(ZodSchemaToJSON(elementSchema._def));
    const elementTypes = elementSchema._def.options.map(e => e.shape.type._def.value);
    // const elementSchemas = elementSchema._def.options.map(e => {
    //     let keys = (Object.keys(e._def) as (keyof typeof e._def)[]);
    //     keys.map(k => {
    //         e._def.description?
    //     })
    // })

    return <Box>
        <VStack
        spacing={4}
        align='stretch'
        padding='1vw'
    >
        <Select bg={'themeBlue'} w={'5vw'}>
            {elementTypes.map(e => <option
                value={e}
                key={e}
            >{e.replace(/([A-Z][a-z])/g,' $1').replace(/(\d)/g,' $1')}</option>)}
        </Select>
        <InputGroup>
            <InputLeftAddon children={'Type'} />
            <Input bg={'#D7E0EA'} placeholder={'type'} />
        </InputGroup>
    </VStack>
    </Box>
}

const EditorMafs: React.FC = (props) => {
    return <CartesianCoordinates />
}