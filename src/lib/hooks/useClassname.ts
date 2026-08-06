import { useMemo } from "react";
import ModuleClassname from "../cssUtil";

type CSSModule = { readonly [key: string]: string; }

export default function useClassname (cssModule:CSSModule){
    return useMemo(()=> new ModuleClassname(cssModule),[cssModule]);
}