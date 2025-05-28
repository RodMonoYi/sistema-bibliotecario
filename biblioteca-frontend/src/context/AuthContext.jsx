// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { API_BASE_URL } from '../config';

// Cria o contexto
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);

  const processToken = (newToken) => {
    if (newToken) {
      try {
        const decoded = jwtDecode(newToken);
        const userId = decoded.id;
        const userType = decoded.tipo; 
        const fetchUserData = async () => {
          try {
            const response = await axios.get(`${API_BASE_URL}/usuarios/${userId}`, {
              headers: { Authorization: `Bearer ${newToken}` }
            });
            const fetchedUser = response.data;
            setUser({
              id: fetchedUser.id,
              nome: fetchedUser.nome,
              email: fetchedUser.email,
              tipo: userType 
            });
            setIsAuthenticated(true);
            setIsAdmin(userType === 'ADMINISTRADOR');
          } catch (error) {
            console.error("Erro ao buscar dados do usuário após decodificar token:", error);
            logout();
          } finally {
            setLoadingInitial(false);
          }
        };

        fetchUserData();
        
      } catch (error) {
        console.error("Erro ao decodificar token:", error);
        logout();
      }
    } else {
      setIsAuthenticated(false);
      setIsAdmin(false);
      setToken(null);
      setUser(null);
      setLoadingInitial(false);
    }
  };

  // Efeito para verificar o token e carregar dados do usuário ao iniciar/atualizar a página
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    processToken(storedToken);
  }, []);

  const login = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    processToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
  };

  const authContextValue = {
    token,
    user,
    isAuthenticated,
    isAdmin,
    loadingInitial,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook pra usar o context 
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};