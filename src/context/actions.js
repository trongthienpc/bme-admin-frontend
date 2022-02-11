import { ADD_ROOM_STYLE, LOAD_USER, LOGIN, REGISTER } from "./constant";

export const login = (payload) => ({
  type: LOGIN,
  payload,
});

export const register = (payload) => ({
  type: REGISTER,
  payload,
});

export const loadUser = (payload) => ({
  type: LOAD_USER,
  payload,
});

export const loadRoomStyle = (payload) => ({
  type: ADD_ROOM_STYLE,
  payload,
});

export const addRoomStyle = (payload) => ({
  type: ADD_ROOM_STYLE,
  payload,
});
