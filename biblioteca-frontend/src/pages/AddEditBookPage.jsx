// src/pages/AddEditBookPage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BookOpenIcon, PlusIcon, PencilIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config';

const AddEditBookPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, isAuthenticated, logout } = useAuth();

  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [descricao, setDescricao] = useState('');
  const [anoPublicacao, setAnoPublicacao] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const isEditing = Boolean(id);

  // Redireciona se não estiver autenticado.
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (isEditing && isAuthenticated && token) {
      setLoading(true);
      const fetchBook = async () => {
        try {
          const response = await axios.get(`${API_BASE_URL}/livros/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const book = response.data;
          setTitulo(book.titulo || '');
          setAutor(book.autor || '');
          setDescricao(book.descricao || '');
          setAnoPublicacao(book.anoPublicacao ? String(book.anoPublicacao) : '');
        } catch (err) {
          console.error("Erro ao buscar livro para edição:", err);
          setError(err.response?.data?.erro || "Não foi possível carregar os dados do livro para edição.");
          if (err.response?.status === 401 || err.response?.status === 403) {
            logout();
            navigate('/login');
          }
        } finally {
          setLoading(false);
        }
      };
      fetchBook();
    }
  }, [id, isEditing, isAuthenticated, token, logout, navigate]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    if (!isAuthenticated || !token) {
      setError("Você precisa estar logado para realizar esta operação.");
      setLoading(false);
      logout();
      navigate('/login');
      return;
    }

    const bookData = {
      titulo,
      autor,
      descricao,
      anoPublicacao: anoPublicacao ? parseInt(anoPublicacao) : null,
    };

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      if (isEditing) {
        await axios.put(`${API_BASE_URL}/livros/${id}`, bookData, config);
        setSuccess('Livro atualizado com sucesso!');
      } else {
        await axios.post(`${API_BASE_URL}/livros`, bookData, config);
        setSuccess('Livro cadastrado com sucesso!');
        setTitulo('');
        setAutor('');
        setDescricao('');
        setAnoPublicacao('');
      }
      setTimeout(() => navigate(isEditing ? `/livros/${id}` : '/meus-livros'), 1500);
    } catch (err) {
      console.error(`Erro ao ${isEditing ? 'atualizar' : 'cadastrar'} livro:`, err.response?.data || err);
      setError(err.response?.data?.erro || `Erro ao ${isEditing ? 'atualizar' : 'cadastrar'} o livro. Verifique os dados e suas permissões.`);
      if (err.response?.status === 401 || err.response?.status === 403) {
        logout();
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 flex items-center">
          {isEditing ? (
            <>
              <PencilIcon className="h-10 w-10 mr-3 text-blue-600 dark:text-blue-400" />
              Editar Livro
            </>
          ) : (
            <>
              <PlusIcon className="h-10 w-10 mr-3 text-green-600 dark:text-green-400" />
              Cadastrar Novo Livro
            </>
          )}
        </h1>
        <button
          onClick={() => navigate(isEditing ? `/livros/${id}` : '/meus-livros')}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          <span>Voltar</span>
        </button>
      </div>

      {loading && !error && (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
          <p className="ml-4 text-gray-700 dark:text-gray-300">Carregando dados do livro...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded relative mb-6" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-200 px-4 py-3 rounded relative mb-6" role="alert">
          <span className="block sm:inline">{success}</span>
        </div>
      )}

      {!loading && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="titulo" className="block text-gray-700 dark:text-gray-300 text-lg font-semibold mb-2">
              Título do Livro <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="titulo"
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
              placeholder="Ex: O Senhor dos Anéis"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="autor" className="block text-gray-700 dark:text-gray-300 text-lg font-semibold mb-2">
              Autor <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="autor"
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
              placeholder="Ex: J.R.R. Tolkien"
              value={autor}
              onChange={(e) => setAutor(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="descricao" className="block text-gray-700 dark:text-gray-300 text-lg font-semibold mb-2">
              Descrição
            </label>
            <textarea
              id="descricao"
              rows="5"
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 resize-y"
              placeholder="Uma breve descrição sobre o livro..."
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            ></textarea>
          </div>

          <div>
            <label htmlFor="anoPublicacao" className="block text-gray-700 dark:text-gray-300 text-lg font-semibold mb-2">
              Ano de Publicação
            </label>
            <input
              type="number"
              id="anoPublicacao"
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
              placeholder="Ex: 1954"
              value={anoPublicacao}
              onChange={(e) => setAnoPublicacao(e.target.value)}
              min="1000"
              max={new Date().getFullYear()}
            />
          </div>

          <div className="flex justify-end mt-8">
            <button
              type="submit"
              className="flex items-center space-x-2 px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-transform transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></span>
                  {isEditing ? 'Atualizando...' : 'Cadastrando...'}
                </>
              ) : (
                <>
                  {isEditing ? (
                    <PencilIcon className="h-5 w-5 mr-2" />
                  ) : (
                    <PlusIcon className="h-5 w-5 mr-2" />
                  )}
                  {isEditing ? 'Atualizar Livro' : 'Adicionar Livro'}
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AddEditBookPage;