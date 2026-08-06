export default function HideIf ({children,hideIf}:{
    hideIf: boolean,
    children: React.ReactNode,
}){
    return <>
    { hideIf ? null: children }
    </> 
}