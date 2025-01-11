export type loginDataType = {
    username: string;
    password: string;
}
export type signupDataType = {
    username: string;
    email: string;
    password: string;
    admin: boolean;
}
export type forgotPwdDataType = {
    username:string;
    email:`${string}@${string}`
}