import { GradeItem } from '../data/teacher/GradeData'; // Update path if necessary
import apiClient from "@/data/apiClient"; // Import your configured apiClient

// Interface for data returned from the API
interface ApiGradeItem {
    gradeId: string;
    name: string;
}

// Function to fetch grade data from the API
const fetchgrade = async (): Promise<GradeItem[]> => {
  try {
    // Send request to fetch data from the API
    const response = await apiClient.get<{
      success: boolean;
      message: string;
      data: {
        items: ApiGradeItem[]; // Update to match API data structure
      };
    // }>(`http://localhost/api/Grade/GetAllGrade?pageIndex=0&pageSize=10`);// link local
    }>(`https://elepla-be-production.up.railway.app/api/Grade/GetAllGrade?pageIndex=0&pageSize=10`);// link server


    if (response.data.success) {
      // Map API data to match the GradeItem interface
      const grade: GradeItem[] = response.data.data.items.map((item) => ({
        gradeId: item.gradeId,
        name: item.name,
      }));
      return grade;
    } else {
      console.error('Error fetching data from API:', response.data.message);
      return [];
    }
  } catch (error) {
    console.error('Error calling API:', error);
    return [];
  }
};

export default fetchgrade;
