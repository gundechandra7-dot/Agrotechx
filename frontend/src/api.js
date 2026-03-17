import axios from "axios";

const API = "https://agrotechx-backend.onrender.com";

export const detectDisease = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post(`${API}/detect-disease`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const suggestCrop = async (soil, temperature, rainfall) => {
  const response = await axios.get(`${API}/suggest-crop`, {
    params: { soil, temperature, rainfall },
  });

  return response.data;
};
