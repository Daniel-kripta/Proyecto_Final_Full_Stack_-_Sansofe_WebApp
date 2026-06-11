import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'

import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import Portada from './pages/Portada/Portada'
import Busqueda from './pages/Busqueda/Busqueda'
import {Articulo} from './pages/Articulo/Articulo'
import Resultados from './pages/Resultados/Resultados'
import Login from './pages/Auth/Login'
import Registro from './pages/Auth/Registro'
import Colecciones from './pages/Colecciones/Colecciones'
import BusquedaAsistida from './pages/BusquedaAsistida/BusquedaAsistida'
import Ajustes from './pages/Ajustes/Ajustes'
import Perfil from './pages/Perfil/Perfil'
import PaginaNoEncontrada from './pages/PaginaNoEncontrada/PaginaNoEncontrada'
import { AuthProvider } from './context/AuthContext'
import { RutaProtegida } from './components/RutaProtegida/RutaProtegida'

export default function App() {

  return (
    <BrowserRouter>
      <AuthProvider>
        <Header />
        <main>
          <Routes>
            <Route path="/"                   element={<Portada />} />
            <Route path="/buscar"             element={<Busqueda />} />
            <Route path="/articulo/:id"       element={<Articulo />} />
            <Route path="/resultados"         element={<Resultados />} />
            <Route path="/login"              element={<Login />} />
            <Route path="/registro"           element={<Registro />} />
            <Route element={<RutaProtegida />}>
              <Route path="/colecciones"        element={<Colecciones />} />
              <Route path="/busqueda-asistida"  element={<BusquedaAsistida />} />
              <Route path="/ajustes"            element={<Ajustes />} />
              <Route path="/perfil"             element={<Perfil />} />
            </Route>
            <Route path="*"                   element={<PaginaNoEncontrada />} />
          </Routes>
        </main>
        <Footer />
      </AuthProvider>
    </BrowserRouter>
  )
}