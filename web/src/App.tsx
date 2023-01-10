import { ThemeContext } from "@emotion/react";
import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './App.css'

const IndexPage = lazy(() => import('./pages/Index'));

const router = createBrowserRouter([
  {
    path: "/",
    element: <IndexPage />,
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
