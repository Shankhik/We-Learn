class ApiLinks {
    static apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN||'localhost:3000'
    static httpsOrNot = process.env.NODE_ENV==='production'?'https':'http';
    
    static firstPart = `${this.httpsOrNot}://${this.apiDomain}/api`

    //get key word make it a member which needs computation
    static cloudinary = {
        url:{
            this:`${this.firstPart}/cloudinary/url`
        },
        upload:{
            this:`${this.firstPart}/cloudinary/upload`
        }
    }
    static courses = {
        this:`${this.firstPart}/courses`,//api/courses
        
        completeCourse:{
            this: `${this.firstPart}/courses/complete-course`,//api/courses/complete-course
        },
        enroll : {
            this:`${this.firstPart}/courses/enroll`,//api/courses/enroll
        },
        findCourseHistory : {
            this:`${this.firstPart}/courses/find-course-history`,//api/courses/find-course-history
        },
        findall:{
            this:`${this.firstPart}/courses/findall`,//api/courses/findall
        },
        findone:{
            this:`${this.firstPart}/courses/findone`,//api/courses/findone
        },
        inc:{
            this:`${this.firstPart}/courses/inc`,//api/courses/inc
        },
        updateLastLoaded:{
            this:`${this.firstPart}/courses/update-last-loaded`,//api/courses/update-last-loaded
        }
    }
    
    static email = {
        signup: {
            this: `${this.firstPart}/email/signup`,//api/email/signup
        },
        forgotPwd: {
            this: `${this.firstPart}/email/forgot-pwd`,//api/email/forgot-pwd
        }
    }
    static forgotPwd = {
        /**
         * method: POST;
         * Authorization header:{username, password}
         */
        changePwd: {
            this: `${this.firstPart}/forgot-pwd/change-pwd`
        },
        verifyUser: {
            this: `${this.firstPart}/forgot-pwd/verify-user`
        },
        
    }
    static getUserDetails = {
        this: `${this.firstPart}/get-user-details`
    }
    static loginReq ={
        this: `${this.firstPart}/login-req`,//api/login-req
    }

    static signupReq ={
        this: `${this.firstPart}/signup-req`,//api/signup-req
    }
    
    static updateUserDetails = {
        this: `${this.firstPart}/update-user-details`,//api/signup-req
    }
    
}
export default ApiLinks;