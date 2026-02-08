import axios from '../citizen-module/api/axios';

interface PhotoInfo {
  contactInfo?: string;
  canUsePhoto: boolean;
  photoCredit?: string;
}

interface PlantObservation {
  plantType: string;
  photo: string;
  date: string;
  timeOfDay: string;
  description?: string;
  latitude?: number;
  longitude?: number;
}

export const plantApi = {
  // Submit a new plant observation
  submitPlantObservation: async (data: PlantObservation) => {
    const response = await axios.post('/citizen/plants', data);
    return response.data;
  },

  // Get all plant observations
  getPlantObservations: async () => {
    const response = await axios.get('/citizen/plants');
    return response.data;
  },

  // Get a single plant observation
  getPlantObservation: async (id: string) => {
    const response = await axios.get(`/citizen/plants/${id}`);
    return response.data;
  },

  // Update plant photo information
  updatePlantPhotoInfo: async (id: string, photoInfo: PhotoInfo) => {
    const response = await axios.patch(`/citizen/plants/${id}/photo-info`, photoInfo);
    return response.data;
  },

  // Delete a plant observation
  deletePlantObservation: async (id: string) => {
    const response = await axios.delete(`/citizen/plants/${id}`);
    return response.data;
  },
};

export default plantApi;
