import React, { useEffect } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Login from "./components/views/pages/login/Login";
import Register from "./components/views/pages/register/Register";
import Dashboard from "./components/views/dashboard/dashboard";
import About from "./components/views/pages/about/about";
import RoomStyle from "./components/views/pages/room/roomStyle";
import RoomDetail from "./components/views/pages/room/roomDetail";
import Page404 from "./components/views/pages/page404/page404";
import "react-toastify/dist/ReactToastify.css";
import "./scss/style.scss";
import { LOCAL_STORAGE_TOKEN_NAME } from "./context/constant";

import { loadUser } from "./context/Reducer";
import Blog from "./components/views/pages/blog/blog";
import Comment from "./components/views/pages/comment/comment";
const DefaultLayout = React.lazy(() => import("./layout/default"));

// check authorized
function RequireAuth({ children }) {
  const accessToken = localStorage.getItem([LOCAL_STORAGE_TOKEN_NAME]);
  let location = useLocation();
  if (!accessToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}
const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
);
function App() {
  useEffect(() => {
    loadUser();
  }, []);

  // todo app
  // const [storeState, dispatch] = useStore();
  // const { todos, todoInput } = storeState;

  // const handleAdd = () => {
  //   dispatch(actions.addTodo(todoInput));
  // };

  // // theme
  // const [theme, setTheme] = useState("dark");

  return (
    // todo app
    // <div>
    //   <input value={todoInput}
    //     placeholder='enter here'
    //     onChange={e => {
    //       dispatch(actions.setTodoInput(e.target.value))
    //     }} />

    //   <button onClick={handleAdd}>Add</button>

    //   <div style={{ margin: 50 }}>
    //     <button>Toggle Theme</button>
    //     <Content theme={theme} />
    //   </div>

    // </div>

    <React.Suspense fallback={loading}>
      <Routes>
        <Route
          exact
          path="/"
          element={
            <RequireAuth>
              <DefaultLayout />
            </RequireAuth>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="/about" element={<About />} />
          <Route path="/roomStyle" element={<RoomStyle />} />
          <Route path="/roomDetail" element={<RoomDetail />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/comment" element={<Comment />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route exact path="/register" element={<Register />} />
        <Route exact path="*" element={<Page404 />} />
      </Routes>
    </React.Suspense>
  );
}

export default App;
