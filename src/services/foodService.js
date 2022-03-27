// get all
// get by id
// put by id
// post new
// delete by id

import axios from "axios";
import { apiUrl, HEADERS } from "../context/constant";

const getAll = async () => {
  return await axios.get(`${apiUrl}/foods/`);
};

const getById = async (id) => {
  return await axios.get(`${apiUrl}/foods/${id}`);
};

const updateById = async (id, entity) => {
  return await axios.put(`${apiUrl}/foods/${id}`, entity, {
    headers: {
      HEADERS,
    },
  });
};

const addEntity = async (entity) => {
  return await axios.post(`${apiUrl}/foods/add`, entity, {
    headers: {
      HEADERS,
    },
  });
};

const deleteById = async (id) => {
  return await axios.delete(`${apiUrl}/foods/${id}`, {
    headers: {
      HEADERS,
    },
  });
};

export { getAll, getById, deleteById, addEntity, updateById };
