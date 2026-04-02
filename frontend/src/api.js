import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export const getPatients = async () => {
  const response = await api.get("/patients/");
  return response.data;
};

export const createPatient = async (patientData) => {
  const response = await api.post("/patients/", patientData);
  return response.data;
};

export default api;
