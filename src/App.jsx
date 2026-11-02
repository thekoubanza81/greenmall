import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Catalogue from './pages/Catalogue'
import Panier from './pages/Panier'
import Connexion from './pages/Connexion'
import Inscription from './pages/Inscription'
import Admin from './pages/Admin'
import Validation from './pages/Commande/Validation'
import Infos from './pages/Commande/Infos'
import Paiement from './pages/Commande/Paiement'
import Confirmation from './pages/Commande/Confirmation'
import Navbar from './components/Navbar'
import NonTrouvee from './pages/NonTrouvee'

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Catalogue />} />
          <Route path="/panier" element={<Panier />} />
          <Route path="/connexion" element={<Connexion />} />
          <Route path="/inscription" element={<Inscription />} />

          <Route element={<ProtectedRoute roleRequis="admin" />}>
            <Route path="/admin" element={<Admin />} />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route path="/commande/validation" element={<Validation />} />
            <Route path="/commande/infos" element={<Infos />} />
            <Route path="/commande/paiement" element={<Paiement />} />
            <Route path="/commande/confirmation" element={<Confirmation />} />
          </Route>
          <Route path="*" element={<NonTrouvee />} />
        </Routes>
      </main>
    </>
  )
}