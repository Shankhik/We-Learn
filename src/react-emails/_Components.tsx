import {Text} from 'react-email'
// import {Text} from '@react-email/components'
type Props = {
    EmailText: {
        children?: React.ReactNode,
        fontSize?: React.CSSProperties['fontSize'],
        fontColor?: React.CSSProperties['color'],
        fontFamily?: React.CSSProperties['fontFamily'],
        fontWeight?: React.CSSProperties['fontWeight'],
        textAlign?: React.CSSProperties['textAlign'],
        style?: React.CSSProperties,
    }
}
export const EmailText = ({
    children, style, fontSize, fontColor, fontFamily, fontWeight, textAlign
}:Props['EmailText'])=>{
    return <Text
    style={{
        color: fontColor||'',
        fontSize: fontSize||'1rem',
        fontFamily: fontFamily||"Calibri",
        fontWeight: fontWeight||'',
        textAlign: textAlign,
        ...style
    }}>
        {children}
    </Text>
}