// WorkAreaData.ts

interface WorkArea {
   id: number;
   icon: string;
   title: string;
   description: string;
}

const work_data: WorkArea[] = [
   {
      id: 1,
      icon: "/assets/img/icon/12.png", 
      title: "Sign up",
      description: "Ipsum yorem dolor amet sit elit. Duis at est id leosco for it",
   },
   {
      id: 2,
      icon: "/assets/img/icon/13.png",
      title: "Select course",
      description: "Ipsum yorem dolor amet sit elit. Duis at est id leosco for it",
   },
   {
      id: 3,
      icon: "/assets/img/icon/14.png",
      title: "Start Learning",
      description: "Ipsum yorem dolor amet sit elit. Duis at est id leosco for it",
   },
   {
      id: 4,
      icon: "/assets/img/icon/15.png",
      title: "Get Certificate",
      description: "Ipsum yorem dolor amet sit elit. Duis at est id leosco for it",
   },
];

export default work_data;
