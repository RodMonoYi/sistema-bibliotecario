// src/pages/AdminUserListPage.jsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { UserGroupIcon, TrashIcon, ArrowPathIcon, PencilIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../config';

const AdminUserListPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError("Acesso negado: Você precisa ser administrador e estar logado.");
        setLoading(false);
        return;
      }
      const response = await axios.get(`${API_BASE_URL}/usuarios`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUsers(response.data);
    } catch (err) {
      console.error("Erro ao buscar usuários (Admin):", err);
      setError(err.response?.data?.message || "Não foi possível carregar a lista de usuários. Verifique suas permissões de administrador.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Tem certeza que deseja excluir este usuário? Esta ação é irreversível.")) {
      return;
    }
    setDeletingId(userId);
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/usuarios/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUsers(users.filter(user => user.id !== userId));
      alert('Usuário excluído com sucesso!');
    } catch (err) {
      console.error("Erro ao excluir usuário:", err);
      setError(err.response?.data?.message || 'Erro ao excluir o usuário. Verifique suas permissões de administrador.');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
        <p className="ml-4 text-gray-700 dark:text-gray-300">Carregando usuários...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded-lg">
        <p className="font-semibold mb-2">Ops! Erro de Acesso.</p>
        <p>{error}</p>
        <Link to="/login" className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200">
          Fazer Login como Admin
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-900 rounded-lg shadow-lg max-w-6xl mx-auto py-8 px-6">
      <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-8 flex items-center">
        <UserGroupIcon className="h-10 w-10 mr-4 text-indigo-600 dark:text-indigo-400" />
        Gerenciamento de Usuários
      </h2>

      <div className="mb-6 flex justify-end">
        <button
          onClick={fetchUsers}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
        >
          <ArrowPathIcon className="h-5 w-5" />
          <span>Atualizar Lista</span>
        </button>
      </div>

      {users.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-inner">
          <p className="text-lg text-gray-600 dark:text-gray-400">Nenhum usuário cadastrado no sistema.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-lg">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Nome
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                    <a href={`/perfil/${user.id}`} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200">{user.id}</a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 ">
                    <a href={`/perfil/${user.id}`} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200">{user.nome || 'N/A'}</a>

                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    <a href={`/perfil/${user.id}`} className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200">{user.email}</a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-3">
                      <Link
                        to={`/perfil/${user.id}`}
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200 transition-colors duration-200"
                        title="Ver/Editar Perfil"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </Link>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={deletingId === user.id}
                        title="Excluir Usuário"
                      >
                        {deletingId === user.id ? (
                          <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-500"></span>
                        ) : (
                          <TrashIcon className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUserListPage;