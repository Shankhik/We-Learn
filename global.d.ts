import { AuthToken, SignupToken } from "@/types/tokenType";
import { 
    Changelog, User, UserTrack, Course,
    OTPs, EnrolledCourses
} from "@/types/databaseTypes";

import { SentMessageInfo } from "nodemailer";
import { MongoClient, ObjectId, WithId } from "mongodb";

export {}

declare global {
    var _mongoClientPromise: Promise<MongoClient>|undefined;

    namespace NodeJS {
        interface ProcessEnv{
            NEXT_PUBLIC_API_DOMAIN: string

            EMAIL_HOST: string
            EMAIL_PORT: string
            EMAIL_ADDRESS: string
            EMAIL_PASS: string

            MONGODB_URI: string

            JWT_SECRET_KEY: string

            CLD_NAME: string
            CLD_KEY: string
            CLD_SECRET: string

            REDIS_URI: string
        }
    };

    type AsyncPageProps<
        S extends unknown = never,
        P extends unknown = never
    > = {
        params: Promise<P>
        searchParams: Promise<{
            [key in S]: string | string[] | undefined
        }>
    }

    type Optional<
        T, K extends keyof T = never
    > = Omit<T, K> & Partial<Pick<T, K>>;

    type Merge <
        T, K extends unknown = unknown
    > = Omit<T, keyof K> & K;

    type Status <
        T extends unknown = unknown,
        E extends unknown = unknown
    > = E & {
        status: boolean;
        message?: string;
        error?: string;
        // for excucution: fine, result: bad
        errorMessage?: string;
        token?: string;
        cookie?: string;
        link?:string|null;
        sessionId?: string;
    
        // MongoDB document ID
        documentId?: ObjectId;
        // MongoDB document (one)
        document?: User|OTPs|Course|UserTrack|Changelog,
        // MongoDB documents (many)
        documents?: WithId<User|OTPs|Course|UserTrack|Changelog>[],
        
        users?: any [];
        user?: User | Partial<User>;
        hashed?: string;
        decoded?: AuthToken|SignupToken|null;
        course?: Course;
        courses?: Course[];
        moreAvailable?: boolean;
        courseHistory?: EnrolledCourses;
    
        // For Email Sent Response
        emailSentResponse?: SentMessageInfo
        
        otp?: {
            hashedOtp?: string,
            expiresAt: number;
            purpose: OTPs['purpose']
        };

        // For anything
        data?: T;
    
    }
}
