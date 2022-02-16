import axios from "axios";
import { apiUrl, HEADERS } from "../context/constant";

const getById = async (id) => {
  return await axios.get(`${apiUrl}/blogs/${id}`);
};

const getAll = async () => {
  return await axios.get(`${apiUrl}/blogs/`);
};

const addEntity = async (entity) => {
  return await axios.post(`${apiUrl}/blogs/add`, entity, {
    headers: {
      HEADERS,
    },
  });
};

const updateEntity = async (id, entity) => {
  return await axios.put(`${apiUrl}/blogs/${id}`, entity, {
    headers: {
      HEADERS,
    },
  });
};

const deleteById = async (id) => {
  return await axios.delete(`${apiUrl}/blogs/${id}`);
};

export { getById, getAll, updateEntity, addEntity, deleteById };
