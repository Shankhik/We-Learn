export default class ModuleClassname {
    cssModule: { readonly [key: string]: string; };
    constructor(module: typeof this.cssModule) {
        this.cssModule = module;
    }
    names(classes: string){
        const classList = classes.trim().split(" ");
        let response = "";
        classList.forEach(c =>{
            response = response + this.cssModule[c]+" "
        })
        return response;
    }
}