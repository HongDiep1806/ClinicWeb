import axiosInstance from "../api/axiosInstance"

export const createMedicalRecord = (body) =>
  axiosInstance.post("/MedicalRecords", body)
export const getMedicalRecordByAppointment = (appointmentId) =>
  axiosInstance.get(`/MedicalRecords/appointment/${appointmentId}`)
export const getPrescriptionsByAppointment = (appointmentId) =>
  axiosInstance.get(`/MedicalRecords/appointment/${appointmentId}/prescriptions`)