import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import {
  LOAD_USER,
  LOCAL_STORAGE_TOKEN_NAME,
  LOGIN,
  apiUrl,
  ADD_ROOM_STYLE,
  LOAD_ROOM_STYLE,
  LOGOUT,
  DELETE_ROOM_STYLE,
  FIND_ROOM,
  UPDATE_ROOM,
  UPDATE_BLOG,
  DELETE_BLOG,
  LOAD_COMMENT,
  UPDATE_COMMENT,
  DEL_COMMENT,
  DEL_FOOD,
  ADD_BLOG,
  LOAD_BLOG,
} from "./constant";
const initState = {
  user: null,
  isAuthenticated: false,
  loginStatus: false,
  loginMessage: "",
  addMessage: "",
  rooms: [],
  roomStyles: [],
  roomStyle: {},
  blogs: [],
  blog: {},
  comments: [],
  foods: [],
};

const roomStyleState = {
  roomStyles: [],
  roomStyle: {},
};

function Reducer(state, action) {
  switch (action.type) {
    case UPDATE_ROOM:
      return {
        ...state,
        roomStyles: [...state.roomStyles],
        rooms: [...state.rooms],
      };
    case FIND_ROOM:
      return {
        ...state,
        roomStyle: action.payload,
      };
    case DELETE_ROOM_STYLE:
      return {
        ...state,
        roomStyles: state.roomStyles.filter(
          (room) => room._id !== action.payload
        ),
        rooms: state.rooms.filter((room) => room.id !== action.payload),
      };

    case LOAD_BLOG:
      return {
        ...state,
        blogs: action.payload,
      };
    case ADD_BLOG:
      return {
        ...state,
        blogs: [...state.blogs, action.payload],
      };

    case DELETE_BLOG:
      return {
        ...state,
        blogs: state.blogs.filter((blog) => blog._id !== action.payload),
      };
    case UPDATE_BLOG:
      return {
        ...state,
        blogs: state.blogs.map((blog) =>
          blog._id === action.payload._id ? action.payload : blog
        ),
      };
    case LOAD_ROOM_STYLE:
      return {
        ...state,
        roomStyles: action.payload,
        rooms: action.payload,
      };

    case ADD_ROOM_STYLE:
      return {
        ...state,
        addMessage: action.payload.message,
        rooms: [...state.rooms, action.payload],
      };

    case LOAD_USER:
      return {
        ...state,
        isAuthenticated: action.payload.isAuthenticated,
        user: action.payload.user,
      };
    case LOGIN:
      return {
        ...state,
        isAuthenticated: true,
        loginMessage: action.payload.message,
        loginStatus: action.payload.success,
      };
    case LOGOUT:
      localStorage.removeItem(LOCAL_STORAGE_TOKEN_NAME);
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };

    case LOAD_COMMENT:
      return {
        ...state,
        comments: action.payload,
      };

    case UPDATE_COMMENT:
      return {
        ...state,
        comments: state.comments.map((comment) =>
          comment._id === action.payload._id ? action.payload : comment
        ),
      };
    case DEL_COMMENT:
      return {
        ...state,
        comments: state.comments.filter((x) => x._id !== action.payload),
      };

    case DEL_FOOD:
      return {
        ...state,
        foods: state.foods.filter((x) => x._id !== action.payload),
      };
    default:
      break;
  }
}

const loadUser = async () => {
  if (localStorage[LOCAL_STORAGE_TOKEN_NAME])
    setAuthToken(localStorage[LOCAL_STORAGE_TOKEN_NAME]);
  try {
    const response = await axios.get(`${apiUrl}/auth`);
    if (response.data.success) {
      return {
        ...initState,
        isAuthenticated: true,
        user: response.data.user,
      };
    }
  } catch (error) {
    localStorage.removeItem(LOCAL_STORAGE_TOKEN_NAME);
    setAuthToken(null);
    return {
      ...initState,
      isAuthenticated: false,
      user: null,
    };
  }
};

export { initState, roomStyleState, loadUser };
export default Reducer;
