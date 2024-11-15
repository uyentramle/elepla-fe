export interface CollectionItem {
    collectionId: string;
    name: string;
    createDay: Date;
    updateDay: Date;
}

const collection_data: CollectionItem[] = [
    {
        collectionId: "1",
        name: "Giáo án môn toán",
        createDay: new Date("2024-09-01"),
        updateDay: new Date("2024-10-04")
    },
    {
        collectionId: "2",
        name: "Giáo án môn vật lý",
        createDay: new Date("2024-01-04"),
        updateDay: new Date("2024-02-04")
    },

];

export default collection_data;
