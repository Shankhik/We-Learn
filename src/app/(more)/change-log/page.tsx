import CurrentVersion from "./CurrentVersion";
import { getChangelog } from "@/mongoDB/serverActions/changelog";

export default async function ChangeLog (){
    const changelog = await getChangelog();

    if(!changelog) return <>
    <h1>No Changelog Found</h1>
    </>;

    // console.log(changelog.content)
    return <>
    <CurrentVersion {...changelog}/>
    </>
}