import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./styles/index.css";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx"


const router = createBrowserRouter([
  //Rotas possiveis na aplicação
  {
    path:"/",
    element:<Home/>
  },
  {
    path: "/users",
    element: <Login />
  },
]);

//Renderiza as rotas da aplicação
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
