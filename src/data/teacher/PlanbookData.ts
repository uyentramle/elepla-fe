export interface Activity {
    title: string;
    objective: string;
    content: string;
    product: string;
    implementation: string;
  }
  
  export interface PlanbookRequest {
    title: string;
    schoolName: string;
    teacherName: string;
    subject: string;
    className: string;
    durationInPeriods: number;
    knowledgeObjective: string;
    skillsObjective: string;
    qualitiesObjective: string;
    teachingTools: string;
    notes: string;
    isDefault: boolean;
    collectionId: string;
    lessonId: string;
    activities: Activity[];
  }
  