import axios from '../citizen-module/api/axios';

interface PhotoInfo {
  contactInfo?: string;
  canUsePhoto: boolean;
  photoCredit?: string;
}

interface NatureObservation {
  natureType: string;
  photo: string;
  date: string;
  timeOfDay: string;
  description?: string;
  latitude?: number;
  longitude?: number;
}

export const natureApi = {
  // Submit a new nature observation
  submitNatureObservation: async (data: NatureObservation) => {
    const response = await axios.post('/citizen/nature', data);
    return response.data;
  },

  // Get all nature observations
  getNatureObservations: async () => {
    const response = await axios.get('/citizen/nature');
    return response.data;
  },

  // Get a single nature observation
  getNatureObservation: async (id: string) => {
    const response = await axios.get(`/citizen/nature/${id}`);
    return response.data;
  },

  // Update nature photo information
  updateNaturePhotoInfo: async (id: string, photoInfo: PhotoInfo) => {
    const response = await axios.patch(`/citizen/nature/${id}/photo-info`, photoInfo);
    return response.data;
  },

  // Delete a nature observation
  deleteNatureObservation: async (id: string) => {
    const response = await axios.delete(`/citizen/nature/${id}`);
    return response.data;
  },
};

export default natureApi;
