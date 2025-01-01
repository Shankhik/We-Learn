class ApiLinks {
    static apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN||'localhost:3000'
    static httpsOrNot = process.env.NODE_ENV==='production'?'https':'http';
    
    static firstPart = `${this.httpsOrNot}://${this.apiDomain}/api`

    //get key word make it a member which needs computation

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
    
    static loginReq ={
        this: `${this.firstPart}/login-req`,//api/login-req
    }

    static signupReq ={
        this: `${this.firstPart}/signup-req`,//api/signup-req
    }
}
export default ApiLinks;