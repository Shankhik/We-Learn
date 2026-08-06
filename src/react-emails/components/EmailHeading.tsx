import { WithChildren } from "./Types";
import { Heading, Text } from "./Elements";
import { Column, Row, Section, ColumnProps } from "react-email";

type HeadingProps = React.ComponentProps<typeof Heading>;

type EmailHeadingProps = WithChildren<HeadingProps & {
    containersProps?: {
        heading?: ColumnProps,
        tag?: ColumnProps
    }
    textAlign?: NonNullable<HeadingProps['style']>['textAlign']
    tag?: string,
    tagStyle?: React.CSSProperties
}>

export default function EmailHeading ({
    children, style, textAlign, tag, tagStyle, containersProps, ...props
}:EmailHeadingProps){
    return<>
    <Section><Row>
        <Column
            width={"1"}
            {...containersProps?.heading}
            style={{
                whiteSpace: "nowrap",
                ...containersProps?.heading?.style
            }} 
        >
        <Heading //className="Nunito-Heading"
            {...props} style={{
            // fontFamily: "Nunito Sans Heading",
            textAlign: textAlign || "center",
            marginBottom: 0,
            color: "rgb(54, 68, 145)",
            ...style,
        }}
        >{children}</Heading>
        </Column>
        
        {tag? <>
        <Column valign="middle" {...containersProps?.tag}>
        <Text style={{
            lineHeight: "",
            fontSize: "0.85rem",
            width: "fit-content", whiteSpace: "nowrap",
            borderRadius: "8px",
            backgroundColor:'rgb(194, 204, 233)',
            color: "rgb(100, 104, 143)",
            padding: "5px 10px", marginLeft: "15px", marginBottom: 0, //marginTop:"20px",
            ...tagStyle
        }}>{tag}</Text>
        </Column>
        </>: null}
    </Row></Section>
    </>
}