declare module '@babel/standalone' {
    export const transform: (code: string, options: any) => { code: string };
}