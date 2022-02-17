import {
  ADD_ROOM_STYLE,
  LOAD_ROOM_STYLE,
  LOAD_USER,
  LOGIN,
  LOGOUT,
  REGISTER,
  DELETE_ROOM_STYLE,
  FIND_ROOM,
  UPDATE_ROOM,
  UPDATE_BLOG,
  DELETE_BLOG,
} from "./constant";

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

export const logOut = (payload) => ({
  type: LOGOUT,
  payload,
});

export const loadRoomStyle = (payload) => ({
  type: LOAD_ROOM_STYLE,
  payload,
});

export const addRoomStyle = (payload) => ({
  type: ADD_ROOM_STYLE,
  payload,
});

export const delRoomStyle = (payload) => ({
  type: DELETE_ROOM_STYLE,
  payload,
});

export const findRoom = (payload) => ({
  type: FIND_ROOM,
  payload,
});

export const updateRoom = (payload) => ({
  type: UPDATE_ROOM,
  payload,
});

export const updateBlog = (payload) => ({
  type: UPDATE_BLOG,
  payload,
});

export const delBlog = (payload) => ({
  type: DELETE_BLOG,
  payload,
});
