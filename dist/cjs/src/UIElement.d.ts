import dbAdapter from "./dbAdapter";
import selector from "./Selector";
interface path {
    element?: string;
    action: string;
    params?: string[];
}
interface args {
    [key: string]: any;
}
type UIAction = (element: UIElement, args?: args) => Promise<any>;
type GlobalAction = (...agrs: any) => Promise<any>;
interface defaultActions {
    [key: string]: UIAction;
    get: UIAction;
}
interface executeCallbacks {
    onSelectorSuccess: (element: UIElement, args?: args) => Promise<void>;
    onSelectorError: (element: UIElement, error: Error, action: UIAction, args?: args) => Promise<void>;
    onPathSuccess: (element: UIElement, args?: args) => Promise<void>;
    onPathError: (element: UIElement, error: Error, pathFinder: (args?: args, at?: number) => Promise<void>, args?: args) => Promise<void>;
}
interface globalActions {
    getUrl: () => Promise<string>;
    url: (url: string) => Promise<any>;
    [key: string]: GlobalAction;
}
declare class UIElement {
    name: string;
    private selectors;
    private father;
    url: string;
    database: dbAdapter;
    defaultAction: string;
    static elementActions: defaultActions;
    static globalActions: globalActions;
    static callbacks: executeCallbacks;
    constructor(json: {
        name: string;
        selectors: selector[];
        father: path[];
        url: string;
        defaultAction: string;
    }, db: dbAdapter);
    getSelector(at?: number): any;
    getSelectorType(at?: number): string;
    getPath(at?: number): path | null;
    execute(args?: args, action?: string): Promise<any>;
    private checkURL;
    private pathFinder;
}
export default UIElement;
