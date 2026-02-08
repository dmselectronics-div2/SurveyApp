import axios from '../citizen-module/api/axios';

interface PhotoInfo {
  contactInfo?: string;
  canUsePhoto: boolean;
  photoCredit?: string;
}

interface AnimalObservation {
  animalType: string;
  photo: string;
  date: string;
  timeOfDay: string;
  description?: string;
  latitude?: number;
  longitude?: number;
}

export const animalApi = {
  // Submit a new animal observation
  submitAnimalObservation: async (data: AnimalObservation) => {
    const response = await axios.post('/citizen/animals', data);
    return response.data;
  },

  // Get all animal observations
  getAnimalObservations: async () => {
    const response = await axios.get('/citizen/animals');
    return response.data;
  },

  // Get a single animal observation
  getAnimalObservation: async (id: string) => {
    const response = await axios.get(`/citizen/animals/${id}`);
    return response.data;
  },

  // Update animal photo information
  updateAnimalPhotoInfo: async (id: string, photoInfo: PhotoInfo) => {
    const response = await axios.patch(`/citizen/animals/${id}/photo-info`, photoInfo);
    return response.data;
  },

  // Delete an animal observation
  deleteAnimalObservation: async (id: string) => {
    const response = await axios.delete(`/citizen/animals/${id}`);
    return response.data;
  },
};

export default animalApi;
