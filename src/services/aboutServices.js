import axios from "axios";
import { apiUrl, HEADERS } from "../context/constant";

const getAll = async () => {
  return await axios.get(`${apiUrl}/about/`);
};

const getById = async (id) => {
  return await axios.get(`${apiUrl}/about/${id}`);
};

const updateEntity = async (id, obj) => {
  return await axios.put(`${apiUrl}/about/${id}`, obj, {
    headers: {
      HEADERS,
    },
  });
};

const deleteById = async (id) => {
  return axios.delete(`${apiUrl}/about/${id}`);
};

const addEntity = async (entity) => {
  return axios.post(`${apiUrl}/about/add`, entity, {
    headers: {
      HEADERS,
    },
  });
};

export { getAll, getById, updateEntity, deleteById, addEntity };
