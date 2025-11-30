import axiosInstance from "../api/axiosInstance";

export const getAllDoctors = () => axiosInstance.get("/User/get-all-doctors");
export const getAllPatients = () => axiosInstance.get("/User/get-all-patients");