import axios from "axios";
import { apiUrl, HEADERS } from "../context/constant";

const getRoomById = async (id) => {
  const response = await axios.get(`${apiUrl}/rooms/${id}`);
  return response;
};

const getAllRoom = async () => {
  const response = await axios.get(`${apiUrl}/rooms/all`);
  return response;
};

const updateRoomById = async (roomId, formData) => {
  const response = await axios.put(`${apiUrl}/rooms/${roomId}`, formData, {
    headers: {
      HEADERS,
    },
  });
  return response;
};

const deleteRoomById = async (roomId) => {
  const response = await axios.delete(`${apiUrl}/rooms/${roomId}`);
  return response;
};

const addEntity = async (entity) => {
  return await axios.post(`${apiUrl}/rooms/add`, entity, {
    headers: {
      HEADERS,
    },
  });
};
export { getRoomById, getAllRoom, updateRoomById, deleteRoomById, addEntity };
