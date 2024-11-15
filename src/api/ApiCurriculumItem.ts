// src/api/ApiCurriculumItem.ts
import axios from 'axios';
import { CurriculumItem } from '../data/teacher/CurriculumData'; // Update path if necessary

// Interface for data returned from the API
interface ApiCurriculumItem {
    curriculumId: string;
    name: string;
}

// Function to fetch grade data from the API
const fetchCurriculum = async (): Promise<CurriculumItem[]> => {
  try {
    // Send request to fetch data from the API
    const response = await axios.get<{
      success: boolean;
      message: string;
      data: {
        items: ApiCurriculumItem[]; // Update to match API data structure
      };
    // }>(`http://localhost/api/CurriculumFramework/GetAllCurriculumFramework?pageIndex=0&pageSize=10`);// link api local
    }>(`https://elepla-be-production.up.railway.app/api/CurriculumFramework/GetAllCurriculumFramework?pageIndex=0&pageSize=10`);// link api server


    if (response.data.success) {
      // Map API data to match the GradeItem interface
      const curriculum: CurriculumItem[] = response.data.data.items.map((item) => ({
        curriculumId: item.curriculumId,
        name: item.name,
      }));
      return curriculum;
    } else {
      console.error('Error fetching data from API:', response.data.message);
      return [];
    }
  } catch (error) {
    console.error('Error calling API:', error);
    return [];
  }
};

export default fetchCurriculum;
