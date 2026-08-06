// "use client";

// import Button from "@/components/buttons/NewButton";
import HomeLayout from "@/components/layouts/HomeLayout";

type HomeLayoutProps = React.ComponentProps<typeof HomeLayout>;

export default async function Unauthorized ({searchParams}:{
    searchParams: Promise<{
        reason?: string,
        note?: string,
        heading?: string
    }>
}){
    // const reason = useSearchParams().get("reason")
    const { reason, note, heading } = await searchParams;
    
    const homeLayoutProps= {
        elementStyles: {
            main: {
                alignItems:"center", gap:"10px", userSelect: "none"
            }
        } satisfies HomeLayoutProps['elementStyles'],
        error: {
            reason:{
                padding: "0 7px", borderRadius: "6px",
                backgroundColor: "rgb(224, 37, 37)",
                color: "rgba(255, 255, 255, 0.7)"
            } satisfies React.CSSProperties,
            note:{
                fontSize:"0.7rem", display: !note? "none":""
            } satisfies React.CSSProperties
        }
    }
    return <>
    <HomeLayout bypassAuth elementStyles={homeLayoutProps.elementStyles}>
        <h1>{heading || "Unauthorized"}</h1>
        <h3 style={{display: !reason?"none":""}}>
            <small style={homeLayoutProps.error.note}>{note}: </small>
            <span style={homeLayoutProps.error.reason}>{reason}</span>
        </h3>
        <p>
            You don't have the permission to access the contents of this page.<br/>
            <small>
                *File a report if you think this is a mistake.
            </small>
        </p>
    </HomeLayout>
    </>
}