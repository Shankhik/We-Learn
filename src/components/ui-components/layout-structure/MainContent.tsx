import ModuleClassname from "@/lib/cssUtil";
import moduleStyle from "./MainContent.module.css"

type Props = Omit<React.HTMLAttributes<HTMLDivElement>,"className"> & {
    children?: React.ReactNode
}
export default function MainContent ({
    children, ...props
}: Props) {
    const css = new ModuleClassname(moduleStyle);
    return <>
    <main
        className={css.names(`content`)}
        {...props}
    >
        {children}
    </main>
    </>
}