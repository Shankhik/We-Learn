import { ObjectId } from "mongodb";

export type User = {
    _id?: ObjectId | undefined;
    username: string;
    displayName: string;
    email?: string;
    password: string;
    profilePicture?: number|null;
    admin?: boolean;
}
export type Skills = 'coding'|'java'|'c++'|'c'|'python'|'svg'|'oops';

// export type Course = {
//     _id?: ObjectId|undefined;
//     courseName: string;
//     courseId: string;
//     description: string;
//     author: {
//         name: string;
//         website?: string;
//     }
//     skills: Skills[];
//     rating:{
//         rateCount: number;
//         userCount: number;
//     };
//     modules:{
//         title: string;
//         moduleNumber: number;
//         jsx: string;
//         html?: string;
//     }[];
// }

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

export type Course = {
    _id?: ObjectId|undefined;
    courseName: string;
    courseId: string;
    price?: {
        cost: number,
        unit: 'rupee'
    },
    images?:{
        thumbnail?: {
            publicId: string,
            version?: number,
            url?: string,
            dominantColor?: string
        },
        cover?: {
            publicId: string,
            version?: number,
            url?: string,
            dominantColor?: string
        },
    }
    description: {
        type: 'markdown'|'html'|'video-iframe',
        content: string
    }[];
    author: {
        name: string;
        website?: string;
    }
    skills: string[];
    rating:{
        rateCount: number;
        userCount: number;
    };
    modules:{
        title: string;
        //moduleNumber: number;
        blocks:{
            type: 'markdown'|'html'|'video-iframe',
            content: string
        }[]
    }[];
}
// export type CourseHistory = {
//     _id?: ObjectId|undefined;
//     username: string;
//     courses: EnrolledCourses[];
// }
export type EnrolledCourses = {
    courseId: string;
    enrollmentDate?: Date;
    completedUpto: number;
    completionDate: Date|null;
    lastLoaded?: Date;
    rating?: number;
}

export type OTPs = {
    username: string,
    otp: string,
    purpose:
        'update-email'|
        'update-display-name'|
        'forgot-password',
    issuedAt: Date,
    expiresAt: Date
}

export type Changelog = {
    version: `${number}.${number}.${number}` | `${number}.${number}.${number}-${"A"|"B"}`,
    pushDate: Date,
    content: string
}