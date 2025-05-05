import { ObjectId, WithId } from "mongodb";
import { ReactHTML } from "react";

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

export type Course = {
    _id?: ObjectId|undefined;
    courseName: string;
    courseId: string;
    description: string;
    author: {
        name: string;
        website?: string;
    }
    skills: Skills[];
    rating:{
        rateCount: number;
        userCount: number;
    };
    modules:{
        title: string;
        moduleNumber: number;
        jsx: string;
        html?: string;
    }[];
}

export type CourseHistory = {
    _id?: ObjectId|undefined;
    username: string;
    courses: EnrolledCourses[];
}
export type EnrolledCourses = {
    courseId: string;
    enrollmentDate?: Date;
    completedUpto: number;
    completionDate: Date|null;
    lastLoaded?: Date;
}
