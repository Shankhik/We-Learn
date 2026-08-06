import type { Changelog, Channel, Course, User, UserTrack, Enrollment, Chapter, Rating } from "@/types/mongoDBTypes";
import mongoClientPromise from "./mongoClient";
import { Collection, Db, MongoClient } from "mongodb";

type ChapterType = 'lesson' | 'assignment' | 'quiz'

export type DbCollections<
    CH extends ChapterType = 'lesson'
> = {
    Changelogs: Changelog,
    Channels: Channel,
    Courses: Course,
    Chapters: Chapter<CH>,
    Enrollments: Enrollment,
    Rating: Rating,
    Users: User,

    // Old version
    UserTracks: UserTrack
}

type MongoCollection <T extends keyof DbCollections> = {
    database: Db,
    collection: Collection<DbCollections[T]>
}
export default async function mongoCollection <
    T extends keyof DbCollections,
    N extends boolean = false,
> (collection: T, isNullable?:N): Promise<
    N extends false
    ? MongoCollection<T>
    : MongoCollection<T> | undefined
> {
    try {
        const client: MongoClient|undefined = await mongoClientPromise;
        if (!client) return undefined as any;
        const db = client.db("E-Learning");
        return {
            database: db,
            collection: db.collection<DbCollections[T]>(collection)
        }
    } catch (error:any) {
        return undefined as any;
    }
}