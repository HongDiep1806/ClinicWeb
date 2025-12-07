import axiosInstance from "../api/axiosInstance";

// 🟢 CREATE STAFF (Receptionist)
export const createStaff = (data) => {
  return axiosInstance.post("/User/register", {
    ...data,
    roleId: 3 // Receptionist
  });
};

// 🟢 GET ALL STAFF
export const getAllStaff = () => axiosInstance.get("/User/get-all-staffs");


// 🟡 GET STAFF BY ID
export const getStaffById = (id) => {
  return axiosInstance.get(`/User/get-user/${id}`);
};

// 🟣 EDIT STAFF
export const editStaff = (id, data) => {
  return axiosInstance.put(`/User/edit/${id}`, data);
};

// 🔴 TOGGLE STATUS STAFF (DEACTIVATE / ACTIVATE)
export const toggleStaffStatus = (id) => {
  return axiosInstance.put(`/User/toggle-status/${id}`);
};
