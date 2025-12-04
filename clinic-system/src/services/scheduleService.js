import axiosInstance from "../api/axiosInstance";

// Tạo lịch mới
export const createSchedule = (data) => {
  return axiosInstance.post("/Schedule", data);
};


// Lấy lịch theo bác sĩ
export const getScheduleByDoctor = (doctorId) => {
  return axiosInstance.get(`/Schedule/doctor/${doctorId}`);
};


// Xoá lịch
export const deleteSchedule = (scheduleId) => {
  return axiosInstance.delete(`/Schedule/delete/${scheduleId}`);
};

export const getDoctorsByWeekday = (weekday) =>
  axiosInstance.get(`/Schedule/doctors-by-weekday/${weekday}`);
