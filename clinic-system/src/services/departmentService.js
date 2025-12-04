import axiosInstance from "../api/axiosInstance";

export async function getDepartments() {
  const response = await axiosInstance.get("/Department/get-all-departments");
  return response.data;
}

export async function getDepartmentById(id) {
  const response = await axiosInstance.get(`/Department/get-by-id/${id}`);
  return response.data;
}

export async function createDepartment(dept) {
  // MUST send departmentId = 0 because backend model requires it
  const payload = {
    departmentId: 0,
    name: dept.name,
    description: dept.description
  };

  const response = await axiosInstance.post("/Department/create", payload);
  return response.data;
}

export async function updateDepartment(id, data) {
  return axiosInstance.put(`/Department/update/${id}`, {
    departmentId: id,
    name: data.name,
    description: data.description,
    users: []
  });
}


export async function deleteDepartment(id) {
  const response = await axiosInstance.delete(`/Department/delete/${id}`);
  return response.data;
}
