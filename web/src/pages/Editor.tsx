import { Mafs, CartesianCoordinates } from "mafs";
import React, { useState } from "react";
import { z, ZodObjectDef, ZodTypeDef } from "zod";
import { AppletToJSX } from "../util/AppletSerde";
import { elementSchema } from "../util/mafs.zod";
import { AppletScaffold } from "../util/MafsSchema";
import { useResolution } from "../util/useResolution";
import { 
    Grid, GridItem, Select,
    Input, InputGroup, InputLeftAddon, 
    Stack, StackDivider, VStack,
    Drawer, DrawerBody, DrawerFooter, DrawerHeader, 
    DrawerOverlay, DrawerContent, DrawerCloseButton 
} from "@chakra-ui/react";
import { zodToJsonSchema } from 'zod-to-json-schema'

export const EditorView: React.FC = (props) => {
    const [currentApplet, setCurrentApplet] = useState<AppletScaffold>([]);
    const [width, height] = useResolution();

    return <Grid
        h='100vh'
        templateRows='repeat(1, 1fr)'
        templateColumns='repeat(4, 1fr)'
        gap={4}
    >
        <GridItem rowSpan={1} colSpan={1} bg='tomato'><EditorSidebar /></GridItem>
        <GridItem rowSpan={1} colSpan={3}>
            <Mafs {...{height}}>
                <EditorMafs />
            </Mafs>
        </GridItem>
    </Grid>;
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

    if (typeName == z.ZodFirstPartyTypeKind.ZodArray) debugger;
    switch (typeName) {
        case z.ZodFirstPartyTypeKind.ZodString:
            return "string";
        case z.ZodFirstPartyTypeKind.ZodNumber:
            return "number";
        case z.ZodFirstPartyTypeKind.ZodObject:
            return Object
                .entries(def.shape())
                .map(e => { let el: any = {}; el[e[0]] = ZodSchemaToJSON((e[1] as any)._def); return el; })
        case z.ZodFirstPartyTypeKind.ZodBigInt:
            return "bigint";
        case z.ZodFirstPartyTypeKind.ZodBoolean:
            return "boolean";
        case z.ZodFirstPartyTypeKind.ZodUndefined:
            return "undefined";
        case z.ZodFirstPartyTypeKind.ZodNull:
            return "null";
        case z.ZodFirstPartyTypeKind.ZodArray:
            let test: z.ZodArray<z.ZodNumber>;
            return "*" + ZodSchemaToJSON(def.type._def);
        case z.ZodFirstPartyTypeKind.ZodUnion:
        case z.ZodFirstPartyTypeKind.ZodDiscriminatedUnion:
            return def.options.map((e: ZodObjectDef) => ZodSchemaToJSON((e as any)._def));
        // case z.ZodFirstPartyTypeKind.ZodIntersection:
        //     return parseIntersectionDef(def, refs);
        case z.ZodFirstPartyTypeKind.ZodTuple:
            return def.items.map((e: any) => ZodSchemaToJSON((e as any)._def));
        case z.ZodFirstPartyTypeKind.ZodLiteral:
            return def.value;
        // case z.ZodFirstPartyTypeKind.ZodNullable:
        //     return parseNullableDef(def, refs);
        case z.ZodFirstPartyTypeKind.ZodOptional:
            return "?" + ZodSchemaToJSON(def.innerType._def);
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
    const jsonSchema = zodToJsonSchema(elementSchema);
    const elementTypes = elementSchema._def.options.map(e => e.shape.type._def.value);
    // const elementSchemas = elementSchema._def.options.map(e => {
    //     let keys = (Object.keys(e._def) as (keyof typeof e._def)[]);
    //     keys.map(k => {
    //         e._def.description?
    //     })
    // })

    return <VStack
        spacing={4}
        align='stretch'
        padding='1vw'
    >
        <Select bg='white'>
            {elementTypes.map(e => <option
                value={e}
                key={e}
            >{e.replace(/([A-Z][a-z])/g,' $1').replace(/(\d)/g,' $1')}</option>)}
        </Select>
        <InputGroup>
            <InputLeftAddon children='Type' />
            <Input bg='white' placeholder='type' />
        </InputGroup>
    </VStack>
}

const EditorMafs: React.FC = (props) => {
    return <CartesianCoordinates />
}