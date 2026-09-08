import React, { useState, useEffect } from 'react';
import { HandlerNode, OperatorType } from '../../types';
import { X, Save, Plus, HelpCircle } from 'lucide-react';
import { ButtonInButton } from '../layout/ButtonInButton';

interface EditHandlerModalProps {
  isOpen: boolean;
  isNew: boolean;
  unit: string;
  handler: HandlerNode | null;
  onClose: () => void;
  onSave: (handler: HandlerNode) => void;
}

export const EditHandlerModal: React.FC<EditHandlerModalProps> = ({
  isOpen,
  isNew,
  unit,
  handler,
  onClose,
  onSave,
}) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [operator, setOperator] = useState<OperatorType>('lte');
  const [threshold, setThreshold] = useState(1000);
  const [description, setDescription] = useState('');
  const [actionSummary, setActionSummary] = useState('');

  useEffect(() => {
    if (handler) {
      setName(handler.name);
      setRole(handler.role);
      setOperator(handler.operator);
      setThreshold(handler.threshold);
      setDescription(handler.description);
      setActionSummary(handler.actionSummary);
    } else {
      setName('Nuevo Manejador');
      setRole('Custom Approver');
      setOperator('lte');
      setThreshold(5000);
      setDescription('Regla personalizada creada para este ejercicio de laboratorio.');
      setActionSummary('Procesa y resuelve la petición de acuerdo a este umbral.');
    }
  }, [handler, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedHandler: HandlerNode = {
      id: handler ? handler.id : `h-custom-${Date.now()}`,
      name,
      role,
      operator,
      threshold: Number(threshold),
      unit,
      canHandleConditionText: `${operator === 'lte' ? '<=' : operator === 'gte' ? '>=' : '=='} ${threshold}`,
      description,
      actionSummary,
      stopOnHandle: true,
      avatarIcon: handler ? handler.avatarIcon : 'CheckCircle2',
    };
    onSave(updatedHandler);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-[#2D2A4A]/65 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
      style={{ backgroundColor: 'rgba(45, 42, 74, 0.65)' }}
    >
      <div 
        className="relative bg-[#E8E2D4] ring-1 ring-[#AAA0BB]/50 p-2 rounded-[2rem] max-w-lg w-full shadow-2xl transition-all"
        style={{ backgroundColor: '#E8E2D4' }}
      >
        <div 
          className="relative bg-[#FFFFF6] shadow-xl rounded-[calc(2rem-0.5rem)] p-6 sm:p-7 border border-[#E8E2D4]/70"
          style={{ backgroundColor: '#FFFFF6' }}
        >
          
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#E8E2D4] mb-4">
            <h3 className="font-bold text-base text-[#41478B] flex items-center gap-2">
              {isNew ? <Plus className="w-4 h-4 text-[#B57DDA]" /> : <Save className="w-4 h-4 text-[#B57DDA]" />}
              <span>{isNew ? 'Añadir Nuevo Manejador (Eslabón)' : 'Configurar Manejador'}</span>
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#E8E2D4]/50 hover:bg-[#E8E2D4] text-[#41478B] flex items-center justify-center transition-colors cursor-pointer border border-[#AAA0BB]/30"
              title="Cerrar modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[#41478B] font-bold mb-1">
                  Nombre del Eslabón
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#FFFFF6] border border-[#E8E2D4] rounded-xl px-3 py-2 text-[#41478B] font-medium placeholder-[#AAA0BB] focus:border-[#B57DDA] focus:ring-2 focus:ring-[#B57DDA]/30 focus:outline-none transition-all shadow-xs"
                  placeholder="Ej: Gerente Regional"
                  style={{ backgroundColor: '#FFFFF6' }}
                />
              </div>

              <div>
                <label className="block text-[#41478B] font-bold mb-1">
                  Rol / Título
                </label>
                <input
                  type="text"
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-[#FFFFF6] border border-[#E8E2D4] rounded-xl px-3 py-2 text-[#41478B] font-medium placeholder-[#AAA0BB] focus:border-[#B57DDA] focus:ring-2 focus:ring-[#B57DDA]/30 focus:outline-none transition-all shadow-xs"
                  placeholder="Ej: Regional Director"
                  style={{ backgroundColor: '#FFFFF6' }}
                />
              </div>
            </div>

            {/* Condición y Umbral */}
            <div 
              className="p-3.5 rounded-xl bg-[#FAF8FD] border border-[#E8E2D4] space-y-2.5 shadow-xs"
              style={{ backgroundColor: '#FAF8FD' }}
            >
              <span className="font-bold text-[#41478B] flex items-center gap-1.5 text-xs">
                <HelpCircle className="w-4 h-4 text-[#B57DDA]" />
                Criterio canHandle(request)
              </span>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[#41478B]/70 text-[10px] mb-1 font-bold uppercase tracking-wider">Operador</label>
                  <select
                    value={operator}
                    onChange={(e) => setOperator(e.target.value as OperatorType)}
                    className="w-full bg-[#FFFFF6] border border-[#E8E2D4] rounded-lg px-2.5 py-1.5 text-[#41478B] font-semibold text-xs focus:border-[#B57DDA] focus:ring-2 focus:ring-[#B57DDA]/30 focus:outline-none transition-all cursor-pointer"
                    style={{ backgroundColor: '#FFFFF6' }}
                  >
                    <option value="lte">Menor o igual que (≤)</option>
                    <option value="gte">Mayor o igual que (≥)</option>
                    <option value="eq">Exactamente igual (=)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#41478B]/70 text-[10px] mb-1 font-bold uppercase tracking-wider">
                    Umbral ({unit})
                  </label>
                  <input
                    type="number"
                    required
                    value={threshold}
                    onChange={(e) => setThreshold(Number(e.target.value))}
                    className="w-full bg-[#FFFFF6] border border-[#E8E2D4] rounded-lg px-2.5 py-1.5 text-[#41478B] font-mono font-bold text-xs focus:border-[#B57DDA] focus:ring-2 focus:ring-[#B57DDA]/30 focus:outline-none transition-all"
                    style={{ backgroundColor: '#FFFFF6' }}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-[#41478B] font-bold mb-1">
                Descripción de Responsabilidad
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#FFFFF6] border border-[#E8E2D4] rounded-xl px-3 py-2 text-[#41478B] font-medium placeholder-[#AAA0BB] focus:border-[#B57DDA] focus:ring-2 focus:ring-[#B57DDA]/30 focus:outline-none transition-all shadow-xs"
                placeholder="Explica qué tipo de peticiones atiende este eslabón..."
                style={{ backgroundColor: '#FFFFF6' }}
              />
            </div>

            <div>
              <label className="block text-[#41478B] font-bold mb-1">
                Acción al Procesar (executeApproval)
              </label>
              <input
                type="text"
                value={actionSummary}
                onChange={(e) => setActionSummary(e.target.value)}
                className="w-full bg-[#FFFFF6] border border-[#E8E2D4] rounded-xl px-3 py-2 text-[#41478B] font-medium placeholder-[#AAA0BB] focus:border-[#B57DDA] focus:ring-2 focus:ring-[#B57DDA]/30 focus:outline-none transition-all shadow-xs"
                placeholder="Ej: Emite resolución administrativa y archiva la orden."
                style={{ backgroundColor: '#FFFFF6' }}
              />
            </div>

            {/* Acciones */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E8E2D4]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-full text-[#41478B]/70 hover:text-[#41478B] hover:bg-[#E8E2D4]/50 font-semibold transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <ButtonInButton
                type="submit"
                variant="primary"
                size="sm"
                icon={<Save className="w-3.5 h-3.5 text-[#FFFFF6]" />}
              >
                Guardar Eslabón
              </ButtonInButton>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};
