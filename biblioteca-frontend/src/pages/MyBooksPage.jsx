// src/pages/MyBooksPage.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpenIcon, PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config';

const MyBooksPage = () => {
  const { isAuthenticated, token, logout } = useAuth();
  const navigate = useNavigate();

  const [myBooks, setMyBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const fetchMyBooks = async () => {
      setLoading(true);
      setError(null);

      if (!isAuthenticated || !token) {
        setError("Você precisa estar logado para ver seus livros.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/livros/meus`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setMyBooks(response.data);
      } catch (err) {
        console.error("Erro ao buscar meus livros:", err);
        setError(err.response?.data?.erro || "Não foi possível carregar seus livros. Verifique sua autenticação.");
        if (err.response?.status === 401 || err.response?.status === 403) {
          logout();
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchMyBooks();
  }, [isAuthenticated, token, logout, navigate]);

  const handleDelete = async (bookId) => {
    if (!window.confirm("Tem certeza que deseja excluir este livro? Esta ação é irreversível.")) {
      return;
    }
    setDeletingId(bookId);

    if (!isAuthenticated || !token) {
      setError("Você precisa estar logado para excluir livros.");
      setDeletingId(null);
      logout();
      navigate('/login');
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/livros/${bookId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setMyBooks(myBooks.filter(book => book.id !== bookId));
      setSuccess('Livro excluído com sucesso!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Erro ao excluir livro:", err);
      setError(err.response?.data?.erro || 'Erro ao excluir o livro. Verifique suas permissões.');
      if (err.response?.status === 401 || err.response?.status === 403) {
        logout();
        navigate('/login');
      }
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
        <p className="ml-4 text-gray-700 dark:text-gray-300">Carregando seus livros...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded-lg">
        <p className="font-semibold mb-2">Ops!</p>
        <p>{error}</p>
        <Link to="/login" className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200">
          Fazer Login
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-8 flex items-center">
        <BookOpenIcon className="h-10 w-10 mr-4 text-indigo-600 dark:text-indigo-400" />
        Meus Livros Cadastrados
      </h2>

      <div className="flex justify-end mb-6">
        <Link
          to="/novo/livro/"
          className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-transform transform hover:scale-105 shadow-md"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Cadastrar Livro</span>
        </Link>
      </div>

      {success && ( // Exibir mensagem de sucesso
        <div className="bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-200 px-4 py-3 rounded relative mb-6" role="alert">
          <span className="block sm:inline">{success}</span>
        </div>
      )}

      {myBooks.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-inner">
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">Você ainda não cadastrou nenhum livro.</p>
          <Link
            to="novo/livro/"
            className="inline-flex items-center space-x-2 px-5 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Cadastrar meu primeiro livro</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {myBooks.map(livro => (
            <div
              key={livro.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 truncate">
                  {livro.titulo}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Autor: {livro.autor}</p>
                <p className="text-gray-700 dark:text-gray-300 text-base line-clamp-2">
                  {livro.descricao || 'Nenhuma descrição disponível.'}
                </p>
                <div className="mt-4 flex space-x-3 justify-end">
                  <Link
                    to={`/livros/editar/${livro.id}`}
                    className="p-2 rounded-full text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors duration-200"
                    title="Editar Livro"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </Link>
                  <button
                    onClick={() => handleDelete(livro.id)}
                    className="p-2 rounded-full text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 transition-colors duration-200"
                    disabled={deletingId === livro.id}
                    title="Excluir Livro"
                  >
                    {deletingId === livro.id ? (
                      <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-500"></span>
                    ) : (
                      <TrashIcon className="h-5 w-5" />
                    )}
                  </button>
                  <Link
                    to={`/livros/${livro.id}`}
                    className="p-2 rounded-full text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors duration-200"
                    title="Ver Detalhes"
                  >
                    <BookOpenIcon className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBooksPage;