import axiosInstance from "../api/axiosInstance";

export const getAllAppointments = () => 
    axiosInstance.get("/Appointment/get-all-appointments");
