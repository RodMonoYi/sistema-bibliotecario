// src/pages/BookDetailsPage.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { PencilIcon, TrashIcon, ArrowLeftIcon, BookOpenIcon, StarIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config';

const BookDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin } = useAuth();

  const [livro, setLivro] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLivro = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_BASE_URL}/livros/${id}`);
        setLivro(response.data);
      } catch (err) {
        console.error("Erro ao buscar livro:", err);
        setError("Não foi possível encontrar este livro.");
      } finally {
        setLoading(false);
      }
    };
    fetchLivro();
  }, [id]);

  const isMyBook = livro && isAuthenticated && user?.id === livro.usuario.id;
  const canEditOrDelete = isMyBook || isAdmin;

  const handleDelete = async () => {
    if (window.confirm("Tem certeza que deseja excluir este livro?")) {
      try {
        const token = localStorage.getItem('token');
        if (!isAuthenticated || !token) { // Verifica se está autenticado e tem token
          alert('Você precisa estar logado para excluir livros.');
          return;
        }
        await axios.delete(`${API_BASE_URL}/livros/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        alert('Livro excluído com sucesso!');
        navigate('/livros');
      } catch (err) {
        console.error("Erro ao excluir livro:", err);
        alert(err.response?.data?.message || 'Erro ao excluir o livro. Verifique suas permissões.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
        <p className="ml-4 text-gray-700 dark:text-gray-300">Carregando detalhes do livro...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded-lg">
        <p className="font-semibold mb-2">Erro!</p>
        <p>{error}</p>
        <button
          onClick={() => navigate('/livros')}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
        >
          Voltar para Livros
        </button>
      </div>
    );
  }

  if (!livro) {
    return <div className="text-center p-8 text-gray-700 dark:text-gray-300">Livro não encontrado.</div>;
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 animate-fade-in ${isMyBook ? 'border-4 border-indigo-500 dark:border-indigo-400' : ''}`}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 flex items-center">
          {livro.titulo}
          {isMyBook && (
            <span className="ml-4 px-3 py-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 text-sm font-semibold rounded-full flex items-center">
              <StarIcon className="h-4 w-4 mr-1" /> Seu Livro
            </span>
          )}
        </h1>
        <button
          onClick={() => navigate('/livros')}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          <span>Voltar</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
            <span className="font-semibold">Autor:</span> {livro.autor}
          </p>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
            <span className="font-semibold">Ano de Publicação:</span> {livro.anoPublicacao || 'N/A'}
          </p>
          {livro.genero && (
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
              <span className="font-semibold">Gênero:</span> {livro.genero}
            </p>
          )}
          {livro.usuario && (
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
              <span className="font-semibold">Cadastrado por:</span>{' '}
              <Link to={`/perfil/${livro.usuario.id}`} className="text-indigo-600 hover:underline dark:text-indigo-400">
                {livro.usuario.nome}
              </Link>
            </p>
          )}
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
            <span className="font-semibold">Descrição:</span> {livro.descricao || 'Nenhuma descrição detalhada disponível.'}
          </p>

          {canEditOrDelete && (
            <div className="flex space-x-4 mt-6">
              <button
                onClick={() => navigate(`/livros/editar/${livro.id}`)}
                className="flex items-center space-x-2 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105 shadow-md"
              >
                <PencilIcon className="h-5 w-5" />
                <span>Editar Livro</span>
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center space-x-2 px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-transform transform hover:scale-105 shadow-md"
              >
                <TrashIcon className="h-5 w-5" />
                <span>Excluir Livro</span>
              </button>
            </div>
          )}
        </div>
        <div className="flex justify-center items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-inner">
          {livro.capaUrl ? (
            <img src={livro.capaUrl} alt={`Capa do livro ${livro.titulo}`} className="max-w-full h-auto rounded-md shadow-lg" />
          ) : (
            <div className="text-center text-gray-400 dark:text-gray-500 text-lg">
              <BookOpenIcon className="h-24 w-24 mx-auto mb-4" />
              Nenhuma capa disponível
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetailsPage;