import axiosInstance from "../api/axiosInstance";

// =========================================
// 🔵 GET USER BY ID (dùng cho Profile, Edit,…)
// =========================================
export const getUserById = (id) =>
  axiosInstance.get(`/User/get-user/${id}`);


// =========================================
// 🟡 UPDATE USER (Edit info, change password)
// BE: PUT /User/edit/{id}
// =========================================
export const updateUser = (id, data) =>
  axiosInstance.put(`/User/edit/${id}`, data);



// =========================================
// 🔴 DELETE USER (Soft delete → move to DeletedUsers)
// =========================================
export const deleteUser = (id) =>
  axiosInstance.delete(`/User/delete/${id}`);


// =========================================
// 🟣 TOGGLE ACTIVE / INACTIVE
// (doctor/patient/staff share one api)
// =========================================
export const toggleUserStatus = (id) =>
  axiosInstance.put(`/User/toggle-status/${id}`);


// =========================================
// 🔵 RESTORE USER WITH NEW EMAIL
// =========================================
export const restoreUserWithEmail = (id, newEmail) =>
  axiosInstance.put(`/User/restore-with-email/${id}`, { newEmail });



// =========================================
// 🔥 GET USERS BY ROLE (Doctor / Patient / Staff)
// roleName = "Doctor" | "Patient" | "Receptionist"
// =========================================
export const getUsersByRole = (roleName) =>
  axiosInstance.get(`/User/get-users-by-role`, {
    params: { roleName }
  });



// =========================================
// 🟢 GET ALL DOCTORS (with Active / Inactive status)
// =========================================
export const getAllDoctors = () =>
  axiosInstance.get(`/User/get-all-doctors`);


// =========================================
// 🟢 GET ALL PATIENTS (with Active / Inactive status)
// =========================================
export const getAllPatients = () =>
  axiosInstance.get(`/User/get-all-patients`);


// =========================================
// 🟢 GET ALL STAFF (Receptionists)
// =========================================
export const getAllStaff = () =>
  axiosInstance.get(`/User/get-all-staffs`);
export const changePassword = (userId, data) =>
  axiosInstance.put(`/User/change-password/${userId}`, data);

