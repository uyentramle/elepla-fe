import axios from 'axios';
import { PlanbookRequest } from '@/data/teacher/PlanbookData'; // Path to the interface

// const API_BASE_URL = 'http://localhost/api';
const API_BASE_URL = 'https://elepla-be-production.up.railway.app/api';


export const createPlanbook = async (planbookData: PlanbookRequest): Promise<void> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/Planbook/CreatePlanbook`, planbookData);
    if (response.data.success) {
      console.log('Planbook created successfully:', response.data);
    } else {
      console.error('Failed to create planbook:', response.data.message);
    }
  } catch (error) {
    console.error('Error creating planbook:', error);
    throw error; // Re-throw error to handle it in the calling component
  }
};
