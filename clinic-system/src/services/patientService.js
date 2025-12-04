// services/patientService.js
import axiosInstance from "../api/axiosInstance";

export const getAllPatients = () => axiosInstance.get("/User/get-all-patients");

export const deletePatient = (id) =>
  axiosInstance.delete(`/User/delete/${id}`);

export const createPatient = (data) =>
  axiosInstance.post("/User/register", data);
export const editPatient = (userId, data) => {
  return axiosInstance.put(`/User/edit/${userId}`, data);
  
};
export const togglePatientStatus = (id) =>
    axiosInstance.put(`/User/toggle-status/${id}`);

