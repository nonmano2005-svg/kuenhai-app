import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import AllItemsPage from './pages/AllItemsPage';
import SearchResultsPage from './pages/SearchResultsPage';
import ItemDetailPage from './pages/ItemDetailPage';
import ReportLostPage from './pages/ReportLostPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VerificationPage from './pages/VerificationPage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  return (
    <div className="min-h-screen bg-navy font-kanit">
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/category/:type" element={<CategoryPage />} />
        <Route path="/all-items" element={<AllItemsPage />} />
        <Route path="/search" element={<SearchResultsPage />} />
        <Route path="/item/:id" element={<ItemDetailPage />} />
        <Route path="/report" element={<ReportLostPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verification" element={<VerificationPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </div>
  );
}
