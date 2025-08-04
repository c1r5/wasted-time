import React from 'react';
import { useThemeContext } from '../../shared';

interface MetricsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MetricsModal: React.FC<MetricsModalProps> = ({ isOpen, onClose }) => {
  const { theme } = useThemeContext();

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
    >
      <div 
        className="rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        style={{
          backgroundColor: theme.colors.surface,
          border: `1px solid ${theme.colors.border}`,
          boxShadow: `0 10px 25px ${theme.colors.shadow}`
        }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 
            className="text-2xl font-semibold"
            style={{ color: theme.colors.text.primary }}
          >
            Métricas de Produtividade
          </h2>
          <button
            onClick={onClose}
            style={{ 
              color: theme.colors.text.secondary,
              transition: 'color 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = theme.colors.text.primary}
            onMouseLeave={(e) => e.currentTarget.style.color = theme.colors.text.secondary}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          {/* Placeholder para gráficos futuros */}
          <div 
            className="h-64 rounded-lg border-2 border-dashed flex items-center justify-center"
            style={{ 
              borderColor: theme.colors.border,
              backgroundColor: theme.colors.background 
            }}
          >
            <div className="text-center">
              <div 
                className="text-lg font-medium mb-2"
                style={{ color: theme.colors.text.primary }}
              >
                Gráficos em Desenvolvimento
              </div>
              <div 
                className="text-sm"
                style={{ color: theme.colors.text.secondary }}
              >
                Aqui serão exibidos gráficos de produtividade, tempo gasto por categoria, etc.
              </div>
            </div>
          </div>

          <div 
            className="h-64 rounded-lg border-2 border-dashed flex items-center justify-center"
            style={{ 
              borderColor: theme.colors.border,
              backgroundColor: theme.colors.background 
            }}
          >
            <div className="text-center">
              <div 
                className="text-lg font-medium mb-2"
                style={{ color: theme.colors.text.primary }}
              >
                Estatísticas Detalhadas
              </div>
              <div 
                className="text-sm"
                style={{ color: theme.colors.text.secondary }}
              >
                Tempo total trabalhado, gaps de produtividade, comparativos semanais/mensais
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-md focus:outline-none font-medium"
            style={{
              backgroundColor: theme.colors.primary,
              color: '#ffffff',
              border: `1px solid ${theme.colors.primary}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#475569';
              e.currentTarget.style.borderColor = '#475569';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = theme.colors.primary;
              e.currentTarget.style.borderColor = theme.colors.primary;
            }}
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};