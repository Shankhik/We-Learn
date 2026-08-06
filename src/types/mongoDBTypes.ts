import { ObjectId, WithId } from "mongodb";
// type Optional<T, K extends keyof T = never> = Omit<T,K> & Partial<Pick<T, K>>;

export type Block<
    T extends "image"|"video"|"html"|"markdown"|"iframe"
> = {
    type: T
} & T extends "image"|"video"? {
    media: MediaMetadata
}: T extends "iframe"? {
    url: string
}: {
    content: string
};

type MediaMetadata<T extends unknown = unknown> = Merge<{
    /** Cloudinary Public Id [includes folder] */
    publicId: string;

    /** Media type */
    media: "image"|"video"|"raw";

    /** Media version ?v<version> */
    version?: number;

    /** Media preffered transformation while fetching */
    transformation?: string;

    title?: string;
    lastModified: Date;

    /** Direct external url [not maintained by the app] */
    externalUrl?: string;
}, T>;

export type Changelog = {
    version: `${number}.${number}.${number}` | `${number}.${number}.${number}-${"A"|"B"}`,
    pushDate: Date,
    content: string
}

// Old Collection
export type UserTrack = {
    _id?: ObjectId | undefined,
    username: string,
    likedCourses: {
        courseId: string,
        likedDate: Date
    }[],
    enrolled: {
        courseId: string,
        completedUpto: number,
        enrollmentDate: Date,
        completionDate?: Date,
        rating?: number
    }[],
}

export type User = {
    _id?: ObjectId | string;
    username: string;
    password: string;
    email: string;
    displayName: string;

    admin: boolean;

    profilePicture: MediaMetadata | null
    
    enrollments?: ObjectId[] | string[];
    
    createdAt: Date;

    lastUpdate: {
        username: Date;
        password: Date;
        email: Date;
        displayName: Date;
        profilePicture?: Date;
    }
}

export type Enrollment = {
    _id?: ObjectId | string;

    _id_user: ObjectId | string;
    _id_course: ObjectId | string;

    _id_payment?: ObjectId | string;

    courseId: string;
    username?: string;

    /** Chapters which are marked completed */
    completedChapters: {
        _id_chapter: ObjectId | string;
        completedAt: Date;
    }[];

    /** Chapters which are skipped */
    skipedChapters: {
        _id_chapter: ObjectId | string;
        completedAt: Date;
    }[];

    enrollmentDate: Date;
    completionDate: Date | null;
}

export type Channel = {
    /** Channel Object ID [mongo] */
    _id?: ObjectId | string;
    /** Owner Object ID [mongo] */
    _id_user: ObjectId | string;

    /** Public channel id (mus start with @) */
    channelId: `@${string}`;

    channelName: string;

    logo?: MediaMetadata | null;
    banner?: MediaMetadata | null;
    
    /** Info Section Block */
    blocks: Block<"html"|"markdown"|"image">[];

    createdAt: Date;
    updatedAt?: Date;
}

export type Chapter<T extends "lesson"|"quiz"|"assignment"> = {
    _id?: ObjectId | string;

    /** Parent Course ObjectId */
    _id_course: ObjectId | string;
    
    /** Index of the chapter in the course */
    index: number;

    type: T;
    title: string;
    
} & T extends "lesson"? {
    blocks: Block<'html'|'iframe'|'image'|'markdown'|'video'>[]
}: T extends "quiz"? {
    questions: {
        point: number,
        // Question blocks
        blocks: Block<"markdown"|"image">[];
        // Options
        options: Block<"markdown">[];
        // Single | Multiple answers
        correctOption: number | Array<number>
    }[]
    // ...
}: T extends "assignment"? {
    // ...
}: never;

export type Course = {
    _id?: ObjectId | string;

    /** Parent Channel's ObjectId */
    _id_channel: ObjectId | string;

    /** List of users who contributed */
    credit: ObjectId[] | string[];

    // chapters: {
    //     _id_chapter: ObjectId;
    //     index: number
    // }[];

    rating: {
        count: number;
        userCount: number
    }
}

export type Rating = {
    _id?: ObjectId | string;
    _id_user: ObjectId | string;
    _id_course: ObjectId | string;

    ratingCourse?:{
        rating: number;
        review: string;
        createdAt: Date;
        updatedAt?: Date;
    };

    ratingChapters?: {
        like: number;
        review?: string;
        createdAt: Date;
        updatedAt?: Date;
    }[];
}