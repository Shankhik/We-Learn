import { Metadata } from "next";
import { AuthLayout } from "./Components";

export async function generateMetadata ({params}:{
    params: Promise<{slug: string}>
}):Promise<Metadata> {
    return {
        title:"Authenticate",
        description: "Authenticate in We-Learn"
    }
}
export default function Layout ({children}:{children: React.ReactNode}) {
    return <>
    <AuthLayout>
        {children}
    </AuthLayout>
    </>
}