import { Grid, GridItem, Input, InputGroup, InputLeftAddon, Select, Stack, StackDivider, VStack } from "@chakra-ui/react";
import { CartesianCoordinates, Mafs } from "mafs";
import React, { useState } from "react";
import { z } from "zod";
import { AppletToJSX } from "../util/AppletSerde";
import { elementSchema } from "../util/mafs.zod";
import { AppletScaffold } from "../util/MafsSchema";
import { useResolution } from "../util/useResolution";

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

// function ZodSchemaToJSON(def: any) {
//     const { typeName } = def;

//     switch (typeName) {
//         case z.ZodFirstPartyTypeKind.ZodString:
//             return parseStringDef(def, refs);
//         case z.ZodFirstPartyTypeKind.ZodNumber:
//             return parseNumberDef(def, refs);
//         case z.ZodFirstPartyTypeKind.ZodObject:
//             return parseObjectDef(def, refs);
//         case z.ZodFirstPartyTypeKind.ZodBigInt:
//             return parseBigintDef();
//         case z.ZodFirstPartyTypeKind.ZodBoolean:
//             return parseBooleanDef();
//         case z.ZodFirstPartyTypeKind.ZodUndefined:
//             return parseUndefinedDef();
//         case z.ZodFirstPartyTypeKind.ZodNull:
//             return parseNullDef(refs);
//         case z.ZodFirstPartyTypeKind.ZodArray:
//             return parseArrayDef(def, refs);
//         case z.ZodFirstPartyTypeKind.ZodUnion:
//         case z.ZodFirstPartyTypeKind.ZodDiscriminatedUnion:
//             return parseUnionDef(def, refs);
//         case z.ZodFirstPartyTypeKind.ZodIntersection:
//             return parseIntersectionDef(def, refs);
//         case z.ZodFirstPartyTypeKind.ZodTuple:
//             return parseTupleDef(def, refs);
//         case z.ZodFirstPartyTypeKind.ZodLiteral:
//             return parseLiteralDef(def, refs);
//         case z.ZodFirstPartyTypeKind.ZodNullable:
//             return parseNullableDef(def, refs);
//         case z.ZodFirstPartyTypeKind.ZodOptional:
//             return parseOptionalDef(def, refs);
//         case z.ZodFirstPartyTypeKind.ZodAny:
//             return parseAnyDef();
//         case z.ZodFirstPartyTypeKind.ZodUnknown:
//             return parseUnknownDef();
//         case z.ZodFirstPartyTypeKind.ZodDefault:
//             return parseDefaultDef(def, refs);
//         case z.ZodFirstPartyTypeKind.ZodBranded:
//             return parseBrandedDef(def, refs);
//         case z.ZodFirstPartyTypeKind.ZodCatch:
//             return parseCatchDef(def, refs);
//         case z.ZodFirstPartyTypeKind.ZodPipeline:
//             return parsePipelineDef(def, refs);
//         case z.ZodFirstPartyTypeKind.ZodFunction:
//         case z.ZodFirstPartyTypeKind.ZodVoid:
//         case z.ZodFirstPartyTypeKind.ZodSymbol:
//             return undefined;
//         default:
//             return ((_: never) => undefined)(typeName);
//       }
// }

const EditorSidebar: React.FC = (props) => { 
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