import { BrowserRouter, Routes, Route } from "react-router-dom";
import {Login} from "./componentes/componente-login/login";
import {Registro} from "./componentes/componente-registro/registro";
import { Prueba } from "./componentes/componente-prueba/prueba";
function App(){
   return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/prueba" element={<Prueba />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;