import {promises as fs} from "fs"
import dbAdapter from "./dbAdapter"
import UIElement from "./UIElement";

export default class jsonDB extends dbAdapter{

    constructor(location : string = "elements.json"){
        super(location)
    }

    private async readDbFile() : Promise<{ [key: string]: any }>{
        try {
            const data = await fs.readFile(this.dbLocation, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            if ((error as any).code === 'ENOENT') {
                // Si el archivo no existe, devolver un objeto vacío
                return {};
            } else {
                throw error;
            }
        }
    }

    private async writeDbFile(dbContent: { [key: string]: UIElement }): Promise<void> {
        await fs.writeFile(this.dbLocation, JSON.stringify(dbContent, null, 2));
    }

    async saveElement(element : UIElement): Promise<void> {
        const dbContent = await this.readDbFile();
        dbContent[element.name] = {
            name: element.name,
            selectors: element.getSelector(),
            father: element.getPath(),
            url: element.url,
        };
        await this.writeDbFile(dbContent);
    }

    async getElement(name : string): Promise<UIElement | null> {
        const dbContent = await this.readDbFile();
        const element = dbContent[name]
        if(element)
            return new UIElement(
                {name : element.name,
                selectors: element.selectors,
                father: element.father,
                url: element.url,
                defaultAction: element.defaultAction},
                this
            )
        else
            return null
    }
}