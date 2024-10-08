import dbAdapter from "./dbAdapter"
import selector from "./Selector"

interface path{
    element? : string,
    action : string,
    params? : string[]
}

interface args{
    [key : string] : any
}

interface UIElementData{
    name: string,
     selectors: selector[],
     father: path[],
     url: string,
    defaultAction : string
    [key : string] : any
}

export type UIAction = (element: UIElement, args?: args) => Promise<any>;
export type GlobalAction = (...agrs : any) => Promise<any>;

interface defaultActions{
    [key: string] : UIAction
    get : UIAction,
}

interface executeCallbacks{
    onSelectorSuccess : (element : UIElement, args? : args) => Promise<void>,
    onSelectorError : (element : UIElement, error : Error, action : UIAction, args? : args) => Promise<void>,
    onPathSuccess : (element : UIElement, args? : args) => Promise<void>,
    onPathError : (element : UIElement, error : Error, pathFinder : (args? : args, at? : number) => Promise<void>, args? : args) => Promise<void>
}

interface globalActions{
    getUrl : () => Promise<string>,
    url : (url : string) => Promise<any>
    [key: string] : GlobalAction
}

class UIElement{
    private name : string
    private selectors : selector[]
    private father : path[]
    private url : string
    private database : dbAdapter
    private defaultAction : string
    private args : args
    static elementActions : defaultActions
    static globalActions : globalActions
    static callbacks : executeCallbacks = {
        onSelectorSuccess : async (element) => {},
        onSelectorError : async (element, error) => {},
        onPathSuccess : async (element, args) => {},
        onPathError : async (element, error, cb) => {}
    }
    constructor(json : UIElementData, db : dbAdapter){
        const {name, selectors, father, url, defaultAction, ...args} = json
        this.name = name
        this.selectors = selectors
        this.father = father
        this.url = url
        this.defaultAction = defaultAction || "get"
        this.args = args
        this.database = db
    }

    public getName(){
        return this.name
    }

    public getSelector(at : number = 0){
        return this.selectors[at].selector || null
    }

    public getSelectors(){
        return this.selectors
    }

    public async setSelectors(selectors : selector[]){
        this.selectors = selectors
        await this.database.saveElement(this)
    }
    
    public getPath(at : number = 0) : path | null{
        return this.father[at] || null
    }

    public getPaths() : path[]{
        return this.father
    }

    public async setPaths(path : path[]){
        this.father = path
        await this.database.saveElement(this)
    }

    public getURL(){
        return this.url
    }

    public async setURL(url : string){
        this.url = url
        await this.database.saveElement(this)
    }

    public getDefaultAction(){
        return this.defaultAction
    }

    public async setDefaultAction(action : string){
        this.defaultAction = action
        await this.database.saveElement(this)
    }

    public getArgs(arg : string){
        return this.args[arg]
    }

    public async setArgs(args : args){
        this.args = args
        await this.database.saveElement(this)
    }

    public async execute(args? : args, action : string = this.defaultAction) : Promise<any> {
        if(!UIElement.elementActions[action]) throw Error("Action not found")
        const element : any = await UIElement.elementActions.get(this, args)
        .catch((error) => UIElement.callbacks.onSelectorError(this, error, UIElement.elementActions[action], {...args, element: this}))
        if(element) UIElement.callbacks.onSelectorSuccess(this, args)
        if(action === "get") return element
        if(element) await UIElement.elementActions[action](this, args)
        if(!element && this.father.length === 0) await this.checkURL(args, action)
        await this.pathFinder(args)
        .then(() => UIElement.callbacks.onPathSuccess(this, args))
        .catch((error) => UIElement.callbacks.onPathError(this, error, this.pathFinder, args))
        await UIElement.elementActions[action](this, args)
    } 

    private async checkURL(args? : args, action : string = this.defaultAction){
        const currentUrl = await UIElement.globalActions.getUrl()
        if(currentUrl === this.url) throw Error("Element not found on spected url")
        await UIElement.globalActions.url(this.url)
        await this.execute(args, action)
    }

    private async pathFinder(args? : args, at? : number){
        const path = this.getPath(at)
        if(!path) return
        if(!path.element) return await UIElement.globalActions[path.action]({ ...args, ...path.params })
        const father = await this.database.getElement(path.element)
        if(!father) throw Error("Father element not found")
        await father.execute({ ...args, ...path.params }, path.action)
    }

}

export default UIElement