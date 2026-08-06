import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

const protocol = process.env.NODE_ENV === "development"? "http":"https";

const genUrl = async(pathname: string)=> {
    const host = (await headers()).get("host");
    if (!host) return null;
    return `${protocol}://${host}${pathname}`
}

export default async function Redirect ({searchParams}:{
    searchParams: Promise<{
        pathname: string
    }>
}){
    const { pathname } = await searchParams;
    const url = await genUrl(pathname);

    if (!url || !pathname) notFound();

    redirect(url);
}