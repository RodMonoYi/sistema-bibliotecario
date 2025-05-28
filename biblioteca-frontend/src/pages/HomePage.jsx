// src/pages/HomePage.jsx
import { Link } from 'react-router-dom';
import { ArrowRightIcon, PlusIcon, UserIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import BackgroundImage from '../assets/imgs/blurred_library_background.png';

const HomePage = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="relative flex flex-col items-center justify-center text-center">
      <div className="relative z-10 flex flex-col items-center justify-center py-16 px-4">
        {/* Hero */}
        <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6 animate-fade-in-down drop-shadow-md"> {/* Texto branco para contraste */}
          Descubra Seu Próximo Livro Favorito
        </h1>
        <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-3xl animate-fade-in-up drop-shadow-sm"> {/* Texto cinza claro para contraste */}
          Milhares de títulos ao seu alcance. Cadastre-se, adicione seus próprios livros e explore um universo de conhecimento.
        </p>

        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 z-10">
          <Link
            to="/livros"
            className="group relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-lg font-bold text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 transition-all duration-300 ease-in-out transform hover:-translate-y-1 shadow-lg"
          >
            <span className="relative px-6 py-3 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0 flex items-center">
              Explorar Livros
              <ArrowRightIcon className="inline-block ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform duration-200" />
            </span>
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to={`/perfil/${user?.id}`}
                className="group relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-lg font-bold text-gray-900 rounded-lg group bg-gradient-to-br from-teal-500 to-green-500 hover:from-teal-600 hover:to-green-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 transition-all duration-300 ease-in-out transform hover:-translate-y-1 shadow-lg"
              >
                <span className="relative px-6 py-3 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0 flex items-center">
                  <UserIcon className="h-6 w-6 mr-3" /> Meu Perfil
                </span>
              </Link>
              <Link
                to="/adicionar-livro"
                className="group relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-lg font-bold text-gray-900 rounded-lg group bg-gradient-to-br from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-yellow-300 dark:focus:ring-orange-800 transition-all duration-300 ease-in-out transform hover:-translate-y-1 shadow-lg"
              >
                <span className="relative px-6 py-3 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0 flex items-center">
                  <PlusIcon className="h-6 w-6 mr-3" /> Adicionar Livro
                </span>
              </Link>
            </>
          ) : (
            <Link
              to="/registrar"
              className="group relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-lg font-bold text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 hover:from-green-500 hover:to-blue-700 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 transition-all duration-300 ease-in-out transform hover:-translate-y-1 shadow-lg"
            >
              <span className="relative px-6 py-3 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0 flex items-center">
                Criar Conta
              </span>
            </Link>
          )}
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300 flex flex-col items-center justify-center text-center border border-white/20"> {/* BG semi-transparente com blur e borda */}
            <h3 className="text-4xl font-extrabold text-white mb-2">100K+</h3>
            <p className="text-gray-200 text-lg">Livros Cadastrados</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300 flex flex-col items-center justify-center text-center border border-white/20">
            <h3 className="text-4xl font-extrabold text-white mb-2">50K+</h3>
            <p className="text-gray-200 text-lg">Usuários Ativos</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300 flex flex-col items-center justify-center text-center border border-white/20">
            <h3 className="text-4xl font-extrabold text-white mb-2">24/7</h3>
            <p className="text-gray-200 text-lg">Acesso Online</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;