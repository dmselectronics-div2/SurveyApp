import axiosInstance from './axios';

export const natureApi = {
  createNature: async (natureData) => {
    try {
      console.log('📤 Sending nature data to backend...');
      console.log('Data size:', JSON.stringify(natureData).length, 'bytes');
      
      const response = await axiosInstance.post('/nature', natureData);
      
      console.log('✅ Nature observation created successfully');
      return response.data;
    } catch (error) {
      console.error('❌ Nature API Error:', error.response?.data || error.message);
      throw error.response?.data || { 
        success: false, 
        message: error.message || 'Network error' 
      };
    }
  },

  getAllNature: async () => {
    try {
      const response = await axiosInstance.get('/nature');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  },

  getNatureById: async (id) => {
    try {
      const response = await axiosInstance.get(`/nature/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: error.message };
    }
  },

  updateNaturePhotoInfo: async (natureId, photoInfo) => {
    try {
      console.log('📤 Updating nature photo information...');
      const response = await axiosInstance.patch(`/nature/${natureId}/photo-info`, photoInfo);
      console.log('✅ Nature photo information updated successfully');
      return response.data;
    } catch (error) {
      console.error('❌ Update Nature Photo Info Error:', error.response?.data || error.message);
      throw error.response?.data || {
        success: false,
        message: error.message || 'Network error'
      };
    }
  },
};

console.log('✅ natureApi module loaded successfully');