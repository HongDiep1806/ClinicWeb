import axiosInstance from "../api/axiosInstance";

export const getAllAppointments = () =>
  axiosInstance.get("/Appointment/get-all-appointments");

export const bookAppointment = (payload) =>
  axiosInstance.post("/Appointment/book", {
    patientId: payload.patientId,
    doctorId: payload.doctorId,
    date: payload.date,
    reason: payload.reason || null
  });

export const getDoctorsByWeekday = (weekday) =>
  axiosInstance.get(`/Schedule/doctors-by-weekday/${weekday}`);
export const updateAppointmentStatus = (body) =>
  axiosInstance.put("/Appointment/update-status", body);



