import axios from 'axios';

// Interface for SubjectInCurriculumItem
export interface SubjectInCurriculumItem {
    curriculumId: string;
    gradeId: string;
    subjectInCurriculumId: string;
    subject: string;
}

// Function to fetch subjects based on gradeId and curriculumId
const fetchSubjectsByGradeAndCurriculum = async (
    gradeId: string,
    curriculumId: string
): Promise<SubjectInCurriculumItem[]> => {
    try {
        // Construct the API URL with query parameters
        // const url = `http://localhost/api/SubjectInCurriculum/GetAllSubjectInCurriculumByCurriculumAndGrade?curriculum=${curriculumId}&grade=${gradeId}`;
        const url = ` https://elepla-be-production.up.railway.app/api/SubjectInCurriculum/GetAllSubjectInCurriculumByCurriculumAndGrade?curriculum=${curriculumId}&grade=${gradeId}`;

       
        // Make the GET request
        const response = await axios.get<{
            success: boolean;
            message: string;
            data: SubjectInCurriculumItem[];
        }>(url);

        if (response.data.success) {
            return response.data.data; // Return the array of subjects
        } else {
            console.error('Error fetching subjects:', response.data.message);
            return [];
        }
    } catch (error) {
        console.error('Error calling SubjectInCurriculum API:', error);
        return [];
    }
};

export default fetchSubjectsByGradeAndCurriculum;
