import axiosInstance from "../api/axiosInstance"

export const createMedicalRecord = (body) =>
  axiosInstance.post("/MedicalRecords", body)
export const getMedicalRecordByAppointment = (appointmentId) =>
  axiosInstance.get(`/MedicalRecords/appointment/${appointmentId}`)
export const getPrescriptionsByAppointment = (appointmentId) =>
  axiosInstance.get(`/MedicalRecords/appointment/${appointmentId}/prescriptions`)
export const getMedicalRecordById = (id) =>
  axiosInstance.get(`/MedicalRecords/${id}/details`)
export const updateMedicalRecord = (id, body) =>
  axiosInstance.put(`/MedicalRecords/${id}`, body)
export const getDoctorMedicalRecords = () =>
  axiosInstance.get("/MedicalRecords/doctor/my-records")
export const getPatientMedicalRecords = () =>
  axiosInstance.get("/MedicalRecords/my-medical-records")