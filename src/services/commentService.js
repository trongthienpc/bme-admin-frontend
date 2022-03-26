import axios from "axios";
import { apiUrl, HEADERS } from "../context/constant";

// get all comment
const getAll = async () => {
  return axios.get(`${apiUrl}/comments/`);
};

// add new comment
const addEntity = async (entity) => {
  console.log(entity);

  return axios.post(`${apiUrl}/comments/add`, entity, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// get comment by id
const getById = async (id) => {
  return await axios.get(`${apiUrl}/comments/${id}`);
};

// edit comment by id
const updateById = async (id, entity) => {
  return await axios.put(`${apiUrl}/comments/${id}`, entity, {
    headers: {
      HEADERS,
    },
  });
};

// delete comment by id
const deleteById = async (id) => {
  return await axios.delete(`${apiUrl}/comments/${id}`);
};
export { getAll, getById, updateById, addEntity, deleteById };
