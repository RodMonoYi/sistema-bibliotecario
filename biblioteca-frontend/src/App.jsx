// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BookListPage from './pages/BookListPage';
import BookDetailsPage from './pages/BookDetailsPage';
import MyBooksPage from './pages/MyBooksPage';
import AddBookPage from './pages/AddBookPage';
import EditBookPage from './pages/EditBookPage';
import UserProfilePage from './pages/UserProfilePage';
import AdminUserListPage from './pages/AdminUserListPage';
import NotFoundPage from './pages/NotFoundPage';

import { AuthProvider, useAuth } from './context/AuthContext';

function AppContent() {
  const { isAuthenticated, isAdmin, loadingInitial } = useAuth();

  if (loadingInitial) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
        <p className="ml-4 text-gray-700 dark:text-gray-300">Carregando autenticação...</p>
      </div>
    );
  }

  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registrar" element={<RegisterPage />} />
        <Route path="/livros" element={<BookListPage />} />
        <Route path="/livros/:id" element={<BookDetailsPage />} />
        <Route path="/novo/livro" element={<AddBookPage />} /> {/* Nova rota para adicionar */}
        {isAuthenticated ? (
          <>
            <Route path="/meus-livros" element={<MyBooksPage />} />

            <Route path="/perfil/:id" element={<UserProfilePage />} />
            <Route path="/livros/editar/:id" element={<EditBookPage />} /> {/* Nova rota para editar */}
            <Route path="/meu-perfil" element={<UserProfilePage />} />

          </>
        ) : (
          null
        )}
        {isAdmin ? (
          <>
            <Route path="/admin/usuarios" element={<AdminUserListPage />} />
          </>
        ) : (
          <Route path="/admin/*" element={<Navigate to="/" replace />} />
        )}

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AppLayout>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;