// src/pages/NotFoundPage.jsx
import { Link } from 'react-router-dom';
import { ExclamationTriangleIcon, HomeIcon } from '@heroicons/react/24/outline';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-160px)] text-center px-4 py-16">
      {/* Icone grande para impacto */}
      <ExclamationTriangleIcon className="h-32 w-32 text-indigo-500 dark:text-indigo-400 mb-8 animate-bounce-slow" />

      <h1 className="text-6xl md:text-8xl font-extrabold text-gray-900 dark:text-gray-100 mb-4">
        404
      </h1>
      <h2 className="text-3xl md:text-5xl font-bold text-gray-800 dark:text-gray-200 mb-6">
        Página Não Encontrada
      </h2>
      <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl">
        Parece que você se perdeu no BiblioVerse. A página que você está procurando não existe ou foi movida.
      </p>
      <Link
        to="/"
        className="inline-flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-transform transform hover:scale-105 shadow-lg font-medium text-lg"
      >
        <HomeIcon className="h-6 w-6" />
        <span>Voltar para a Home</span>
      </Link>
    </div>
  );
};

export default NotFoundPage;