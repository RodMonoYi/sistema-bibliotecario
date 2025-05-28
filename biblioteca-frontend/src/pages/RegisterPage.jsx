// src/pages/RegisterPage.jsx
import { useState } from 'react'; // Não precisa mais de useEffect para validação em tempo real aqui
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { UserIcon, LockClosedIcon, EnvelopeIcon, CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { API_BASE_URL } from '../config';

const RegisterPage = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const [isNameTouched, setIsNameTouched] = useState(false);
  const [isEmailTouched, setIsEmailTouched] = useState(false);
  const [isPasswordTouched, setIsPasswordTouched] = useState(false);
  const [isConfirmPasswordTouched, setIsConfirmPasswordTouched] = useState(false);

  const navigate = useNavigate();
  const validateName = (nameValue) => {
    if (!nameValue.trim()) {
      return 'O nome é obrigatório.';
    }
    if (nameValue.trim().length < 3) {
      return 'O nome deve ter no mínimo 3 caracteres.';
    }
    return '';
  };

  const validateEmail = (emailValue) => {
    if (!emailValue.trim()) {
      return 'O email é obrigatório.';
    }
    if (!/\S+@\S+\.\S+/.test(emailValue)) {
      return 'Formato de email inválido.';
    }
    return '';
  };

  const validatePassword = (passwordValue) => {
    if (!passwordValue) {
      return 'A senha é obrigatória.';
    }
    if (passwordValue.length < 6) {
      return 'A senha deve ter no mínimo 6 caracteres.';
    }
    return '';
  };

  const validateConfirmPassword = (confirmPasswordValue, passwordValue) => {
    if (!confirmPasswordValue) {
      return 'A confirmação de senha é obrigatória.';
    }
    if (confirmPasswordValue !== passwordValue) {
      return 'As senhas não coincidem.';
    }
    return '';
  };

  const handleNameChange = (e) => {
    setNome(e.target.value);
    if (isNameTouched) setNameError(validateName(e.target.value));
  };
  const handleNameBlur = () => {
    setIsNameTouched(true);
    setNameError(validateName(nome));
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (isEmailTouched) setEmailError(validateEmail(e.target.value));
  };
  const handleEmailBlur = () => {
    setIsEmailTouched(true);
    setEmailError(validateEmail(email));
  };

  const handlePasswordChange = (e) => {
    setSenha(e.target.value);
    if (isPasswordTouched) setPasswordError(validatePassword(e.target.value));
    if (isConfirmPasswordTouched) setConfirmPasswordError(validateConfirmPassword(confirmarSenha, e.target.value));
  };
  const handlePasswordBlur = () => {
    setIsPasswordTouched(true);
    setPasswordError(validatePassword(senha));
    if (isConfirmPasswordTouched) setConfirmPasswordError(validateConfirmPassword(confirmarSenha, senha));
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmarSenha(e.target.value);
    if (isConfirmPasswordTouched) setConfirmPasswordError(validateConfirmPassword(e.target.value, senha));
  };
  const handleConfirmPasswordBlur = () => {
    setIsConfirmPasswordTouched(true);
    setConfirmPasswordError(validateConfirmPassword(confirmarSenha, senha));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');
    setSuccess('');
    setLoading(true);

    setIsNameTouched(true);
    setIsEmailTouched(true);
    setIsPasswordTouched(true);
    setIsConfirmPasswordTouched(true);

    const finalNameError = validateName(nome);
    const finalEmailError = validateEmail(email);
    const finalPasswordError = validatePassword(senha);
    const finalConfirmPasswordError = validateConfirmPassword(confirmarSenha, senha);

    setNameError(finalNameError);
    setEmailError(finalEmailError);
    setPasswordError(finalPasswordError);
    setConfirmPasswordError(finalConfirmPasswordError);

    if (finalNameError || finalEmailError || finalPasswordError || finalConfirmPasswordError) {
      setGeneralError('Por favor, corrija os erros no formulário.');
      setLoading(false);
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/usuarios/registrar`, {
        nome,
        email,
        senha,
      });
      setSuccess('Cadastro realizado com sucesso! Você pode fazer login agora.');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      console.error("Erro no registro:", err);
      setGeneralError(err.response?.data?.erro || 'Erro ao registrar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = !nameError && !emailError && !passwordError && !confirmPasswordError &&
    nome.trim() !== '' && email.trim() !== '' && senha.trim() !== '' && confirmarSenha.trim() !== '';

  return (
    <div className="flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 w-full max-w-md animate-fade-in">
        <h2 className="text-3xl font-bold text-center text-indigo-600 dark:text-indigo-400 mb-8">
          Criar Conta no BiblioVerse
        </h2>

        {generalError && (
          <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded relative mb-6 flex items-center animate-fade-in">
            <ExclamationCircleIcon className="h-5 w-5 mr-2" />
            <span className="block sm:inline">{generalError}</span>
          </div>
        )}

        {success && (
          <div className="bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-200 px-4 py-3 rounded relative mb-6 flex items-center animate-fade-in">
            <CheckCircleIcon className="h-5 w-5 mr-2" />
            <span className="block sm:inline">{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="nome" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Nome de Usuário
            </label>
            <div className="relative">
              <input
                type="text"
                id="nome"
                className={`shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 ${isNameTouched && nameError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'focus:ring-indigo-500 dark:border-gray-600'
                  }`}
                placeholder="Seu nome"
                value={nome}
                onChange={handleNameChange}
                onBlur={handleNameBlur}
                required
              />
              <UserIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            {isNameTouched && nameError && <p className="text-red-500 text-xs italic mt-2">{nameError}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                id="email"
                className={`shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 ${isEmailTouched && emailError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'focus:ring-indigo-500 dark:border-gray-600'
                  }`}
                placeholder="seuemail@exemplo.com"
                value={email}
                onChange={handleEmailChange}
                onBlur={handleEmailBlur}
                required
              />
              <EnvelopeIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            {isEmailTouched && emailError && <p className="text-red-500 text-xs italic mt-2">{emailError}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Senha
            </label>
            <div className="relative">
              <input
                type="password"
                id="password"
                className={`shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 ${isPasswordTouched && passwordError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'focus:ring-indigo-500 dark:border-gray-600'
                  }`}
                placeholder="******"
                value={senha}
                onChange={handlePasswordChange}
                onBlur={handlePasswordBlur}
                required
              />
              <LockClosedIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            {isPasswordTouched && passwordError && <p className="text-red-500 text-xs italic mt-2">{passwordError}</p>}
          </div>

          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Confirmar Senha
            </label>
            <div className="relative">
              <input
                type="password"
                id="confirmPassword"
                className={`shadow appearance-none border rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 ${isConfirmPasswordTouched && confirmPasswordError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'focus:ring-indigo-500 dark:border-gray-600'
                  }`}
                placeholder="******"
                value={confirmarSenha}
                onChange={handleConfirmPasswordChange}
                onBlur={handleConfirmPasswordBlur}
                required
              />
              <LockClosedIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            {isConfirmPasswordTouched && confirmPasswordError && <p className="text-red-500 text-xs italic mt-2">{confirmPasswordError}</p>}
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-200 w-full disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
              disabled={loading || !isFormValid}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></span>
                  Cadastrando...
                </span>
              ) : (
                'Registrar'
              )}
            </button>
          </div>
        </form>
        <p className="text-center text-gray-600 dark:text-gray-400 text-sm mt-6">
          Já tem uma conta?{' '}
          <Link to="/login" className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold">
            Faça login aqui
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;