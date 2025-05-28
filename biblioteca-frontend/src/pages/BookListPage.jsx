// src/pages/BookListPage.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { BookOpenIcon, MagnifyingGlassIcon, ArrowRightIcon, PlusIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../config';

const BookListPage = () => {
  const [livros, setLivros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredLivros, setFilteredLivros] = useState([]);

  useEffect(() => {
    const fetchLivros = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/livros`);
        setLivros(response.data);
        setFilteredLivros(response.data);
      } catch (err) {
        console.error("Erro ao buscar livros:", err);
        setError("Não foi possível carregar os livros. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };
    fetchLivros();
  }, []);

  useEffect(() => {
    const results = livros.filter(livro =>
      livro.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      livro.autor.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredLivros(results);
  }, [searchTerm, livros]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
        <p className="ml-4 text-gray-700 dark:text-gray-300">Carregando livros...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded-lg">
        <p className="font-semibold mb-2">Ops!</p>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-8 flex items-center">
        <BookOpenIcon className="h-10 w-10 mr-4 text-indigo-600 dark:text-indigo-400" />
        Acervo Completo
      </h2>

      <div className="flex flex-col md:flex-row justify-between items-center mb-6 space-y-4 md:space-y-0">
        <div className="relative w-full md:w-1/2">
          <input
            type="text"
            placeholder="Pesquisar por título ou autor..."
            className="w-full p-3 pl-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
        <Link
          to="/novo/livro"
          className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-transform transform hover:scale-105 shadow-md"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Cadastrar Livro</span>
        </Link>
      </div>

      {filteredLivros.length === 0 && !loading && !error ? (
        <div className="text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-inner">
          <p className="text-lg text-gray-600 dark:text-gray-400">Nenhum livro encontrado com o termo de busca.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredLivros.map(livro => (
            <Link
              to={`/livros/${livro.id}`}
              key={livro.id}
              className="group block bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">
                  {livro.titulo}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Autor: {livro.autor}</p>
                <p className="text-gray-700 dark:text-gray-300 text-base line-clamp-3">
                  {livro.descricao || 'Nenhuma descrição disponível.'}
                </p>
                <div className="mt-4 text-indigo-600 dark:text-indigo-400 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <span>Ver Detalhes</span>
                  <ArrowRightIcon className="h-4 w-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookListPage;