import { use } from "react";

type Props = {
    children?: React.ReactNode,
    //title?: string,
    titlePromise: Promise<string|undefined>
}

export default function Title ({
    children, titlePromise
}:Props){
    //const title = titlePromise? use(titlePromise):undefined
    const title = use(titlePromise)
    if (children) return <title>{children}</title>;
    //if (!titlePromise) return null;
    
    return title? <title>{title}</title>:null;
}