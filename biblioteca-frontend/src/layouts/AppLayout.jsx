// src/layouts/AppLayout.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SunIcon, MoonIcon, BookOpenIcon, UserCircleIcon, Cog6ToothIcon, ArrowRightEndOnRectangleIcon, ArrowLeftEndOnRectangleIcon } from '@heroicons/react/24/solid';
import { useAuth } from '../context/AuthContext';
import BackgroundImage from '../assets/imgs/blurred_library_background-20B.png';

const AppLayout = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });

  const { isAuthenticated, user, isAdmin, logout } = useAuth();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 bg-cover bg-center bg-scroll"
      style={{ backgroundImage: `url(${BackgroundImage})` }}>
      <header className="bg-white dark:bg-gray-800 shadow-md p-4">
        <nav className="container mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2 text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            <BookOpenIcon className="h-8 w-8" />
            <span>BiblioVerse</span>
          </Link>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <SunIcon className="h-6 w-6 text-yellow-500" />
              ) : (
                <MoonIcon className="h-6 w-6 text-gray-600" />
              )}
            </button>

            {/* Navegação condicional */}
            <div className="hidden md:flex space-x-4">
              <Link to="/livros" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200">
                Livros
              </Link>
              {isAuthenticated && (
                <Link to="/meus-livros" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200">
                  Meus Livros
                </Link>
              )}
              {isAdmin && ( // Mostra apenas se for admin
                <Link to="/admin/usuarios" className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200">
                  Gerenciar Usuários
                </Link>
              )}
            </div>

            {/* Botões de Login/Logout */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-2">
                <span className="text-gray-700 dark:text-gray-300 hidden sm:inline">Olá, {user?.nome || 'Usuário'}!</span>
                <Link to={`/meu-perfil`} className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200">
                  <UserCircleIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                >
                  <ArrowLeftEndOnRectangleIcon className="h-5 w-5" />
                  <span>Sair</span>
                </button>
              </div>
            ) : (
              <Link to="/login" className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200">
                <ArrowRightEndOnRectangleIcon className="h-5 w-5" />
                <span>Login</span>
              </Link>
            )}
          </div>
        </nav>
      </header>

      <div className="flex-grow relative grid items-center">
        {/* <div className="absolute inset-0 bg-black opacity-30 w-full h-full"></div> */}
        <main className="flex-grow container mx-auto px-4 py-8 ">
          {children}
        </main>

      </div>

      <footer className="bg-white dark:bg-gray-800 shadow-inner p-4">
        <div className="container mx-auto text-center text-gray-600 dark:text-gray-400">
          © {new Date().getFullYear()} BiblioVerse. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;