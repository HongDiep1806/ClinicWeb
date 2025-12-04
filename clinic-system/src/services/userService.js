import axiosInstance from "../api/axiosInstance";

// Doctor APIs
export const getAllDoctors = () => axiosInstance.get("/User/get-all-doctors");

// Patient APIs
export const getAllPatients = () => axiosInstance.get("/User/get-all-patients");
export const deletePatient = (id) =>
    axiosInstance.delete(`/User/delete/${id}`);
export const getUserById = (id) =>
  axiosInstance.get(`/User/get-user/${id}`);
