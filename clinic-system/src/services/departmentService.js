import axiosInstance from "../api/axiosInstance";

export async function getDepartments() {
  const response = await axiosInstance.get("/Department/get-all-departments");
  return response.data;
}
