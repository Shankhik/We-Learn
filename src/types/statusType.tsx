import { tokenType } from "@/lib/jwt";
import { ObjectId } from "mongodb";
import { Course, EnrolledCourses } from "./databaseTypes";

export type status ={
    status: boolean;
    message?: string;
    error?: string;
    token?: string;
    cookie?: string;
    link?:string|null;
    documentId?: ObjectId;
    users?: any [];
    user?: any;
    hashed?: string;
    decoded?: tokenType|null;
    course?: Course;
    courses?: Course[];
    moreAvailable?: boolean;
    courseHistory?: EnrolledCourses;
}
