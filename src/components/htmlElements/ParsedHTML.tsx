import globalStyle from "./global.module.css";

type Props = React.HTMLAttributes<HTMLDivElement> & {
    children?: React.ReactNode,
    replaceClassname?: boolean,
}
export default function ParsedHTML ({
    children, className, replaceClassname, ...props
}: Props){
    const localClassname = replaceClassname && className?
        className: `${globalStyle['parsed-html-container']} ${className??""}`
    return <div className={localClassname} {...props}>
        {children}
    </div>
}