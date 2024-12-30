import apiClient from "@/data/apiClient"; // Import your configured apiClient


export interface lessonItem {
    chapterId : string;
    lessonId: string;
    name: string,
}

// Function to fetch subjects based on gradeId and curriculumId
const fetchLessonByChapter = async (
    chapterId: string,
): Promise<lessonItem[]> => {
    try {
        // Construct the API URL with query parameters
        const url = `https://elepla-be-production.up.railway.app/api/Lesson/GetAllLessonByChapterId?chapterId=${chapterId}`;// api server
        // Make the GET request
        const response = await apiClient.get<{
            success: boolean;
            message: string;
            data: lessonItem[];
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

export default fetchLessonByChapter;
