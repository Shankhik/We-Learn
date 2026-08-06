import { redirect } from "next/navigation";
import AuthPageClient from "./components/AuthPageClient";

type PageProps = {
    searchParams :Promise<{
        redirect?: string
    }>
}
export default async function AuthPage ({
    searchParams: urlSearchParams
}:PageProps) {

    const toBoolean = (param: string|undefined)=>{
        if (param !== "0" && param !== "1")
            return false;
        return Boolean(Number(param));
    }
    const searchParams = await urlSearchParams;
    
    // Redirect to Login
    if (toBoolean(searchParams.redirect))
        redirect("/auth/login");
    
    return <AuthPageClient/>
}