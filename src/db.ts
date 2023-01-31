import Dexie, { Table } from "dexie";

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
  organisations!: Table<IOrgUnit>;
  expanded!: Table<IExpanded>;

  constructor() {
    super("myDatabase");
    this.version(2).stores({
      organisations: "++id,value,pId,title",
      expanded: "++id,name",
    });
  }
}

export const db = new CQIDexie();
