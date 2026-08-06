import { Course, OTPs, User } from "@/types/databaseTypes";
import { AuthToken } from "@/types/tokenType";
import { CookieNames } from "@/types/cookieType";

export type ReqDataType = {
    courses:{
        'add-course':{
            params:{
                mode:'update'|'add'
            }
            boby: Omit<Course,'images'>&{
                'image-cover'?: File|null
                'image-thumbnail'?: File|null
            }
        },
        get:{
            cards:{
                params:{
                    return?: 'enrolled',
                    id?: string,
                    skip?: number,
                    limit?: number
                }
                body?:{
                    // Add if needed
                }
            }
        },
        set:{
            enroll:{
                courseId: string,
            },
            rate:{
                courseId: string,
                rating: number
            }
        }
    },
    user:{
        'track-record':{
            'mark-as-read':{
                _body:{
                    courseId: string
                }
            }
        }
    }
    jwt:{
        sign:{},
        verify:{},
        update:{
            cookieName: CookieNames,
            token?: string,
            updateFields: AuthToken
        }
    },
    'update-user-details':{
        username: string,
        fields: {
            [key in keyof User]?: User[key]
        }
    },
    otp:{
        username: string;
        email: string;
        purpose: OTPs['purpose'],
        otp?: string
    }
    upload: {
        "add-profile-picture": FormData
    }
} 
