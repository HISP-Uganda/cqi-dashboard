import Dexie, { Table } from "dexie";
import { IUnit } from "./interfaces";

export interface IOrgUnit {
    id?: string;
    pId: string;
    value: string;
    title: string;
    isLeaf: boolean;
}

export interface IExpanded {
    id: string;
    name: string;
}

export class CQIDexie extends Dexie {
    organisations!: Table<IUnit>;
    expanded!: Table<IExpanded>;

    constructor() {
        super("myDatabase");
        this.version(1).stores({
            organisations: "++id,path",
            expanded: "++id,name",
        });
    }
}

export const db = new CQIDexie();
