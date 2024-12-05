export interface CollectionItem {
    collectionId: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}

const collection_data: CollectionItem[] = [
    {
        collectionId: "1",
        name: "Giáo án môn toán",
        createdAt: new Date("2024-09-01"),
        updatedAt: new Date("2024-10-04")
    },
    {
        collectionId: "2",
        name: "Giáo án môn vật lý",
        createdAt: new Date("2024-01-04"),
        updatedAt: new Date("2024-02-04")
    },

];

export default collection_data;
