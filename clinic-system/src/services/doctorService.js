import axiosInstance from "../api/axiosInstance";

export const createDoctor = (data) => {
  return axiosInstance.post("/User/register", data);
};

// Nếu sau này bạn cần:
export const getAllDoctors = () => {
  return axiosInstance.get("/User/get-all-doctors"); // tuỳ backend bạn có route này hay không
};

export const editDoctor = (userId, data) => {
  return axiosInstance.put(`/User/edit/${userId}`, data);
};