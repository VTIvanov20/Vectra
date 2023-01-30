import { ThemeContext } from "@emotion/react";
import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './App.css'

import { Applet } from "./pages/Applet";
import { EditorView } from "./pages/Editor";
import Signup from "./pages/Signup";
import Login from "./pages/Login";

const IndexPage = lazy(() => import('./pages/Index'));

const router = createBrowserRouter([
  {
    path: "/",
    element: <IndexPage />,
    children: []
  },
  {
    path: "/applet",
    element: <Applet />,
    children: []
  },
  {
    path: "/editor",
    element: <EditorView />,
    children: []
  },
  {
    path: "/signup",
    element: <Signup />,
    children: []
  },
  {
    path: "/login",
    element: <Login />,
    children: []
  }
])

function App() {
  return (
    // TODO: change the loading element
    <Suspense fallback={<div>loading...</div>}>
      <RouterProvider router={router} />
    </Suspense>
  )
}

export default App
