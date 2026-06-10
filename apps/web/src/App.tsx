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
import PaginaNoEncontrada from './pages/PaginaNoEncontrada/PaginaNoEncontrada'

export default function App() {

  return (
    <BrowserRouter>
      <Header />
      <main>
        <Routes>
          <Route path="/"               element={<Portada />} />
          <Route path="/buscar"         element={<Busqueda />} />
          <Route path="/articulo/:id"   element={<Articulo />} />
          <Route path="/resultados"     element={<Resultados />} />
          <Route path="/login"          element={<Login />} />
          <Route path="/registro"       element={<Registro />} />
          <Route path="/colecciones"    element={<Colecciones />} />
          <Route path="*"               element={<PaginaNoEncontrada />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}