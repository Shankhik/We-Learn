'use client';

import { useSearchParams } from "next/navigation";
import EmailSegment from "./EmailSegment";
import { UpdateBlock } from "../../Components";
import DisplayNameSegment from "./DisplayNameSegment";

// Query Params
type EditTypes = 'display-name'|'email'

export default function Edit (){
    const search = useSearchParams();
    const editType = search.get("edit") as EditTypes;

    let title: string|null = null;
    
    switch (editType){
        case "display-name":
            title = 'Display Name'; break;
        case "email":
            title = 'Email'; break;
        default:
            title = null;
    }

    const render = ()=>{
        switch(title){
            case 'Display Name':
                return <DisplayNameSegment/>;
            case 'Email':
                return <EmailSegment/>
            default: return null;
        }
    }
    return !title? <NotFound/> : <>
        <header>
            <title>{`${title} Update`}</title>
            <meta name={'description'} content={`Update your '${title}'`}/>
        </header>
        <UpdateBlock>
            {render()}
        </UpdateBlock>
    </>
}

const NotFound = ()=>{
    return <>
    <h1 style={{margin:'0 auto'}}>
        You sure this is the Page?<br/>
    </h1>
    <h1 style={{fontSize:'4rem', alignSelf:"center"}}>🫠</h1>
    </>
}
