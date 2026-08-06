import { Changelog } from "@/types/databaseTypes";
import { mongoCollection } from "../operations";
import { ApiError } from "@/lib/serverUtils/apiError";

export const getChangelog = async (version?: Changelog['version'])=>{
    if (version) version = version.trim() as typeof version;

    const versionRegex = /^[0-9]+.[0-9]+.[0-9]$/;
    
    if (version && !versionRegex.test(version)) throw new ApiError(
        "Invalid Version Format. Must be of format <number>.<number>.<number>",
        { httpCode: 422}
    );
    
    const changelog = mongoCollection("Changelogs")?.collection!
    
    // Fetches the Latest Changelog document
    const document = (await changelog.find({
        ...(version ? { version }:undefined)
    },{
        projection:{
            _id: 0
        }
    })
    .sort({createdAt: -1})
    .limit(1)
    .toArray()).at(0);

    if(!document) throw new ApiError(`Changelog [${version??"latest"}] Not Found!`,{
        httpCode: version? 404:500
    });

    return document;
}