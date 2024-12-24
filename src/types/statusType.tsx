import { tokenType } from "@/lib/jwt";
import { JwtPayload } from "jsonwebtoken";
import { ObjectId, WithId } from "mongodb";
import { Course, CourseHistory, EnrolledCourses } from "./databaseTypes";

export type status ={
    status: boolean;
    message?: string;
    error?: string;
    token?: string;
    cookie?: string;
    documentId?: ObjectId;
    users?: any [];
    user?: any;
    hashed?: string;
    decoded?: tokenType|null;
    course?: Course;
    courses?: Course[];
    courseHistory?: EnrolledCourses;
}
