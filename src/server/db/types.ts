export type DBFolder = {
    id: number;
    ownerId: string;
    name: string;
    parent: number | null;
    createdAt: Date;
  };
  
  export type DBFile = {
    id: number;
    ownerId: string;
    name: string;
    size: number;
    url: string;
    parent: number;
    createdAt: Date;
  };