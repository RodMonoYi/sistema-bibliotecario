// src/pages/UserProfilePage.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { UserCircleIcon, EnvelopeIcon, PencilIcon, ArrowLeftIcon, LockClosedIcon, BookOpenIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext';
import { API_BASE_URL } from '../config';

const UserProfilePage = () => {
  const { id: paramId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, token, user: loggedInUser, logout } = useAuth();

  const [userProfile, setUserProfile] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [userBooks, setUserBooks] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const profileId = paramId || (loggedInUser ? loggedInUser.id : null);
  const isOwnProfile = loggedInUser && loggedInUser.id === parseInt(profileId);
  const isAdmin = loggedInUser && loggedInUser.tipo === 'ADMINISTRADOR';
  const canEdit = isOwnProfile || isAdmin;

  useEffect(() => {
    if (!profileId && !isAuthenticated) {
      setError("Você precisa estar logado para ver seu perfil.");
      setLoading(false);
      return;
    }

    const fetchProfileData = async () => {
      setLoading(true);
      setError(null);
      setUserProfile(null);
      setUserBooks([]);
      setIsEditing(false); // Reseta o modo de edição ao carregar um novo perfil

      if (!token) {
        setError("Token de autenticação não encontrado. Faça login novamente.");
        setLoading(false);
        logout();
        navigate('/login');
        return;
      }

      try {
        // Buscar dados do perfil do usuário
        const userResponse = await axios.get(`${API_BASE_URL}/usuarios/${profileId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserProfile(userResponse.data);
        setName(userResponse.data.nome || '');
        setEmail(userResponse.data.email || '');

        // Buscar livros cadastrados por este usuário
        const booksResponse = await axios.get(`${API_BASE_URL}/livros/usuario/${profileId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserBooks(booksResponse.data);

      } catch (err) {
        console.error("Erro ao buscar dados do perfil ou livros:", err);
        setError(err.response?.data?.erro || "Não foi possível carregar o perfil ou os livros do usuário.");
        if (err.response?.status === 401 || err.response?.status === 403) {
          logout();
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    if (profileId) {
      fetchProfileData();
    }
  }, [profileId, isAuthenticated, token, loggedInUser, logout, navigate]);

  const handleEditClick = () => {
    setIsEditing(true);
    setSuccess(null);
    setError(null);
  };

  const handleCancelEdit = () => {
    // Reverter para os dados originais do perfil
    if (userProfile) {
      setName(userProfile.nome || '');
      setEmail(userProfile.email || '');
      setNewPassword('');
      setConfirmNewPassword('');
    }
    setIsEditing(false);
    setSuccess(null);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!window.confirm("Tem certeza que deseja salvar as alterações no perfil?")) {
      return;
    }

    setError(null);
    setSuccess(null);
    setSubmitting(true);

    if (newPassword && newPassword !== confirmNewPassword) {
      setError('As novas senhas não coincidem.');
      setSubmitting(false);
      return;
    }

    const userData = {
      nome: name,
      email,
      ...(newPassword && { senha: newPassword }),
    };

    try {
      if (!token) {
        setError("Você precisa estar logado para atualizar perfis.");
        setSubmitting(false);
        logout();
        navigate('/login');
        return;
      }
      await axios.put(`${API_BASE_URL}/usuarios/${profileId}`, userData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess('Perfil atualizado com sucesso!');
      setNewPassword('');
      setConfirmNewPassword('');
      setIsEditing(false);
    } catch (err) {
      console.error("Erro ao atualizar perfil:", err.response?.data || err);
      setError(err.response?.data?.erro || 'Erro ao atualizar o perfil. Verifique os dados e suas permissões.');
      if (err.response?.status === 401 || err.response?.status === 403) {
        logout();
        navigate('/login');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
        <p className="ml-4 text-gray-700 dark:text-gray-300">Carregando perfil...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded-lg">
        <p className="font-semibold mb-2">Erro!</p>
        <p>{error}</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
        >
          Voltar
        </button>
      </div>
    );
  }

  if (!userProfile) {
    return <div className="text-center p-8 text-gray-700 dark:text-gray-300">Usuário não encontrado.</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 flex items-center">
          <UserCircleIcon className="h-10 w-10 mr-3 text-indigo-600 dark:text-indigo-400" />
          Perfil de {userProfile.nome} {isOwnProfile && "(Seu Perfil)"}
        </h1>
        <div className="flex space-x-2"> {/* Container para os botões */}
          {canEdit && !isEditing && (
            <button
              onClick={handleEditClick}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 shadow-md"
            >
              <PencilIcon className="h-5 w-5" />
              <span>Habilitar Edição</span>
            </button>
          )}
          {isEditing && (
            <button
              onClick={handleCancelEdit}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors duration-200 shadow-md"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              <span>Cancelar edição</span>
            </button>
          )}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <span>Voltar</span>
          </button>
        </div>
      </div>

      {success && (
        <div className="bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-200 px-4 py-3 rounded relative mb-6" role="alert">
          <span className="block sm:inline">{success}</span>
        </div>
      )}
      {error && ( // Exibir mensagens de erro também
        <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded relative mb-6" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Formulário de Edição/Visualização do Perfil */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-gray-700 dark:text-gray-300 text-lg font-semibold mb-2">
            Nome
          </label>
          <div className="relative">
            <input
              type="text"
              id="name"
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!isEditing} // Desabilitado se não estiver editando
            />
            <UserCircleIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 text-lg font-semibold mb-2">
            Email
          </label>
          <div className="relative">
            <input
              type="email"
              id="email"
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!isEditing} // Desabilitado se não estiver editando
            />
            <EnvelopeIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {isEditing && ( // Campos de senha só aparecem no modo de edição
          <>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                <LockClosedIcon className="h-6 w-6 mr-2 text-indigo-500 dark:text-indigo-400" />
                Alterar Senha
              </h3>
              <div>
                <label htmlFor="newPassword" className="block text-gray-700 dark:text-gray-300 text-lg font-semibold mb-2">
                  Nova Senha
                </label>
                <div className="relative">
                  <input
                    type="password"
                    id="newPassword"
                    className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                    placeholder="Deixe em branco para não alterar"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={!isEditing}
                  />
                  <LockClosedIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>
              <div className="mt-4">
                <label htmlFor="confirmNewPassword" className="block text-gray-700 dark:text-gray-300 text-lg font-semibold mb-2">
                  Confirmar Nova Senha
                </label>
                <div className="relative">
                  <input
                    type="password"
                    id="confirmNewPassword"
                    className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                    placeholder="Confirme a nova senha"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    disabled={!isEditing}
                  />
                  <LockClosedIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>
          </>
        )}

        <div className="flex justify-end mt-8">
          {isEditing && ( // Botão de submissão só aparece no modo de edição
            <button
              type="submit"
              className="flex items-center space-x-2 px-8 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-transform transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></span>
                  Atualizando...
                </>
              ) : (
                <>
                  <PencilIcon className="h-5 w-5 mr-2" />
                  Atualizar Perfil
                </>
              )}
            </button>
          )}
        </div>
      </form>

      {/* Seção de Livros Cadastrados pelo Usuário */}
      <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
          <BookOpenIcon className="h-8 w-8 mr-3 text-indigo-600 dark:text-indigo-400" />
          Livros Cadastrados por {userProfile.nome}
        </h2>
        {userBooks.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">Este usuário ainda não cadastrou nenhum livro.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userBooks.map(book => (
              <div key={book.id} className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2 truncate">{book.titulo}</h3>
                <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">Autor: {book.autor}</p>
                <p className="text-gray-600 dark:text-gray-400 text-base line-clamp-2">{book.descricao || 'Sem descrição.'}</p>
                <div className="mt-4 text-right">
                  <Link
                    to={`/livros/${book.id}`}
                    className="inline-flex items-center space-x-1 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200 font-medium"
                  >
                    Ver Livro <ArrowLeftIcon className="h-4 w-4 rotate-180 ml-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;