import { render } from "@react-email/render";
import { ComponentProps, ComponentType } from "react";

export async function renderEmailHtml <T extends ComponentType<any>> (
    Component: T,
    props?: ComponentProps<T> 
) {
    try {
        const html = await render(<Component {...props as any} />);
        return html ?? undefined;
    } catch (error:any) {
        return undefined
    }
}
