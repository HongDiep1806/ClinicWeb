import axiosInstance from "../api/axiosInstance"

/* GET ALL MEDICINES */
export const getAllMedicines = () =>
axiosInstance.get("/Medicine")


/* CREATE MEDICINE (Admin) */
export const createMedicine = (body) =>
axiosInstance.post("/Medicine", body)


/* UPDATE MEDICINE */
export const updateMedicine = (body) =>
axiosInstance.put("/Medicine", body)


/* DELETE MEDICINE */
export const deleteMedicine = (id) =>
axiosInstance.delete(`/Medicine/${id}`)