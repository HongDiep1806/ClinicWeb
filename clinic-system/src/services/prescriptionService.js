import axiosInstance from "../api/axiosInstance";

export const createPrescription = (body) =>
  axiosInstance.post("/Prescription", body);
export const getPrescriptionsByRecord = (recordId) =>
  axiosInstance.get(`/Prescription/record/${recordId}`);
