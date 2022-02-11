import React from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Login from "./components/views/pages/login/Login";
import Register from "./components/views/pages/register/Register";
import Dashboard from "./components/views/dashboard/dashboard";
import About from "./components/views/pages/about/about";
import RoomStyle from "./components/views/pages/room/roomStyle";
import RoomDetail from "./components/views/pages/room/roomDetail";
import Page404 from "./components/views/pages/page404/page404";
import { useStore } from "./context";
import "react-toastify/dist/ReactToastify.css";
import "./scss/style.scss";
const DefaultLayout = React.lazy(() => import("./layout/default"));

function RequireAuth({ children }) {
  const [state, dispatch] = useStore();
  console.log("state: ", state);
  // const {
  //   authState: { isAuthenticated },
  // } = useContext(AuthContext);
  const { isAuthenticated } = state;
  let location = useLocation();
  if (!isAuthenticated) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience
    // than dropping them off on the home page.
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
        </Route>

        <Route path="/login" element={<Login />} />
        <Route exact path="/register" element={<Register />} />
        <Route exact path="*" element={<Page404 />} />
      </Routes>
    </React.Suspense>
  );
}

export default App;
