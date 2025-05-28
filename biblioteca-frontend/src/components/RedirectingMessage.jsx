import React from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'; // Ícone de aviso

const RedirectingMessage = ({ message, timer }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl text-center">
      <ExclamationTriangleIcon className="h-16 w-16 text-yellow-500 dark:text-yellow-400 mb-6 animate-bounce-slow" />
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Acesso Restrito</h2>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
        {message}
        {timer > 0 && (
          <span className="font-semibold text-indigo-600 dark:text-indigo-400"> {timer} segundos.</span>
        )}
      </p>
      <div className="relative w-24 h-24">
        {/* Animação do Loader - Estilo Spinner mais moderno */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full border-4 border-t-4 border-indigo-200 dark:border-indigo-700 animate-spin"
               style={{ borderColor: 'transparent', borderTopColor: 'var(--color-indigo-600)', borderRightColor: 'var(--color-indigo-600)' }}>
          </div>
        </div>
        {/* Círculo interno para a contagem */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-xl font-bold text-indigo-700 dark:text-indigo-300">{timer}</div>
        </div>
      </div>
      {/* Estilos para Tailwind CSS para a animação. Adicione ao seu arquivo CSS global (ex: index.css) */}
      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s infinite ease-in-out;
        }
        .dark .animate-spin {
          border-top-color: var(--color-indigo-400) !important;
          border-right-color: var(--color-indigo-400) !important;
        }
      `}</style>
    </div>
  );
};

export default RedirectingMessage;