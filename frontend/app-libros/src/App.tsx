import { RouterProvider } from "react-router-dom";
import { router } from "./routes"; // Importamos la configuración que acabamos de crear

function App() {
  // RouterProvider es el encargado de renderizar la ruta actual
  return <RouterProvider router={router} />;
}

export default App;