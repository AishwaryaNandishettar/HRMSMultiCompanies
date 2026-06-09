import api from "./axios";

/**
 * Upload file for a task
 * @param {File} file - The file to upload
 * @param {string} taskId - The task ID
 * @returns {Promise} Response with file URL
 */
export const uploadTaskFile = async (file, taskId) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("taskId", taskId);

  const response = await api.post("/api/files/upload-task", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

/**
 * Upload file to general uploads directory
 * @param {File} file - The file to upload  
 * @returns {Promise} Response with file URL
 */
export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post("/api/files/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
