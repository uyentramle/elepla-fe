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
    {
        collectionId: "3",
        name: "Giáo án môn hóa học",
        createDay: new Date("2024-03-04"),
        updateDay: new Date("2024-06-04")
    },
    {
        collectionId: "4",
        name: "Giáo án môn sinh học",
        createDay: new Date("2024-10-04"),
        updateDay: new Date("2024-12-04")
    },
    {
        collectionId: "5",
        name: "Giáo án môn lịch sử",
        createDay: new Date("2024-01-04"),
        updateDay: new Date("2024-02-04")
    }
];

export default collection_data;
