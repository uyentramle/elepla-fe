// WorkAreaData.ts

interface WorkArea {
   id: number;
   icon: string;
   title: string;
   // description: string;
}

const work_data: WorkArea[] = [
   {
      id: 1,
      icon: "/assets/img/icon/12.png", 
      title: "Khối lớp",
      // description: "Ipsum yorem dolor amet sit elit. Duis at est id leosco for it",
   },
   {
      id: 2,
      icon: "/assets/img/icon/13.png",
      title: "Môn học",
      // description: "Ipsum yorem dolor amet sit elit. Duis at est id leosco for it",
   },
   {
      id: 3,
      icon: "/assets/img/icon/14.png",
      title: "Chương học",
      // description: "Ipsum yorem dolor amet sit elit. Duis at est id leosco for it",
   },
   {
      id: 4,
      icon: "/assets/img/icon/15.png",
      title: "Bài học",
      // description: "Ipsum yorem dolor amet sit elit. Duis at est id leosco for it",
   },
];

export default work_data;
