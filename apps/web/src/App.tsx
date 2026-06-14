import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'

import Header from './components/Layout/Header/Header'
import Footer from './components/Layout/Footer/Footer'
import Portada from './pages/Portada/Portada'
import Busqueda from './pages/Busqueda/Busqueda'
import {Articulo} from './pages/Articulo/Articulo'
import Login from './pages/Auth/Login'
import Registro from './pages/Auth/Registro'
import Colecciones from './pages/Colecciones/Colecciones'
import BusquedaAsistida from './pages/BusquedaAsistida/BusquedaAsistida'
import Ajustes from './pages/Ajustes/Ajustes'
import Perfil from './pages/Perfil/Perfil'
import Seccion from './pages/Seccion/Seccion'
import PaginaNoEncontrada from './pages/PaginaNoEncontrada/PaginaNoEncontrada'
import { AuthProvider } from './context/AuthContext'
import { RutaProtegida } from './components/RutaProtegida/RutaProtegida'
import { ScrollToTop } from './components/UX/ScrollToTop/ScrollToTop'

export default function App() {

  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <Header />
        <main id="main">
          <Routes>
            <Route path="/"                   element={<Portada />} />
            <Route path="/buscar"             element={<Busqueda />} />
            <Route path="/articulo/:id"       element={<Articulo />} />
            <Route path="/seccion/:seccion"    element={<Seccion />} />
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