import apiClient from "@/data/apiClient"; // Import your configured apiClient

// Interface for ChapterItem
export interface ChapterItem {
    chapterId: string;
    subjectInCurriculumId: string;
    name: string;
    description: string;
}

// Function to fetch chapters by subjectInCurriculumId
const fetchChaptersBySubjectInCurriculumId = async (
    subjectInCurriculumId: string
): Promise<ChapterItem[]> => {
    try {
        // Construct the API URL with the subjectInCurriculumId query parameter
        // const url = `http://localhost/api/Chapter/GetAllChapterBySubjectInCurriculumId?subjectInCurriculumId=${subjectInCurriculumId}`; // api local
        const url = `https://elepla-be-production.up.railway.app/api/Chapter/GetAllChapterBySubjectInCurriculumId?subjectInCurriculumId=${subjectInCurriculumId}`; //api server

        // Make the GET request
        const response = await apiClient.get<{
            success: boolean;
            message: string;
            data: ChapterItem[];
        }>(url);

        if (response.data.success) {
            return response.data.data; // Return the array of chapters
        } else {
            console.error('Error fetching chapters:', response.data.message);
            return [];
        }
    } catch (error) {
        console.error('Error calling Chapter API:', error);
        return [];
    }
};

export default fetchChaptersBySubjectInCurriculumId;
