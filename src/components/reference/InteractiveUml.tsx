import React, { useState } from 'react';
import { UML_NODES } from '../../data/quickReference';
import { DoubleBezelCard } from '../layout/DoubleBezelCard';
import { Sparkles } from 'lucide-react';

export const InteractiveUml: React.FC = () => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('handler');

  const selectedNode = UML_NODES.find((n) => n.id === selectedNodeId) || UML_NODES[1];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Diagrama SVG Interactivo (7 cols) */}
      <div className="lg:col-span-7">
        <DoubleBezelCard innerClassName="p-6">
          <div className="flex flex-wrap gap-2 items-center justify-between mb-4">
            <span className="text-[10px] font-mono uppercase tracking-wider text-french font-bold">
              Diagrama de Estructura de Clases (GoF)
            </span>
            <span className="text-xs text-french/60 font-mono">
              Selecciona una clase para inspeccionarla
            </span>
          </div>

          {/* Canvas SVG del Diagrama UML */}
          <div className="bg-porcelain p-4 sm:p-6 rounded-2xl border border-bone overflow-x-auto shadow-sm">
            <svg
              viewBox="0 0 650 380"
              className="w-full min-w-[550px] h-auto select-none"
            >
              <defs>
                {/* Marcador de Flecha de Asociación */}
                <marker
                  id="arrow-assoc"
                  viewBox="0 0 10 10"
                  refX="8"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto"
                >
                  <path d="M 0 1 L 8 5 L 0 9" fill="none" stroke="#B57DDA" />
                </marker>

                {/* Marcador de Herencia (Triángulo) */}
                <marker
                  id="arrow-inherit"
                  viewBox="0 0 10 10"
                  refX="8"
                  refY="5"
                  markerWidth="8"
                  markerHeight="8"
                  orient="auto"
                >
                  <polygon points="0 0, 8 5, 0 10" fill="#FFFFF6" stroke="#41478B" strokeWidth="1.5" />
                </marker>
              </defs>

              {/* Conexión: Client -> Handler */}
              <line
                x1="180"
                y1="80"
                x2="310"
                y2="80"
                stroke="#B57DDA"
                strokeWidth="2"
                strokeDasharray="4 4"
                markerEnd="url(#arrow-assoc)"
              />
              <text x="210" y="70" fill="#41478B" opacity="0.75" className="font-bold text-[10px]" fontFamily="monospace">
                invoca
              </text>

              {/* Autoasociación navegable: una referencia opcional al siguiente Handler. */}
              <path
                d="M 480 50 H 570 Q 580 50 580 60 V 100 Q 580 110 570 110 H 480"
                fill="none"
                stroke="#B57DDA"
                strokeWidth="2"
                markerEnd="url(#arrow-assoc)"
              />
              <text x="490" y="101" fill="#41478B" className="text-[10px]" fontFamily="monospace">
                0..1
              </text>
              <text x="495" y="132" fill="#41478B" className="font-bold text-[11px]" fontFamily="monospace">
                # successor
              </text>

              {/* Conexión: ConcreteHandlerA -> Handler (Herencia) */}
              <path
                d="M 270 230 L 270 170 L 390 170 L 390 135"
                fill="none"
                stroke="#41478B"
                strokeWidth="2"
                markerEnd="url(#arrow-inherit)"
              />

              {/* Conexión: ConcreteHandlerB -> Handler (Herencia) */}
              <path
                d="M 510 230 L 510 170 L 390 170"
                fill="none"
                stroke="#41478B"
                strokeWidth="2"
              />

              {/* NODO: Client */}
              <g
                role="button" tabIndex={0} aria-label="Inspeccionar client"
                onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setSelectedNodeId('client'); } }}
                onClick={() => setSelectedNodeId('client')}
                className="cursor-pointer transition-all hover:opacity-90"
              >
                <rect
                  x="20"
                  y="40"
                  width="160"
                  height="80"
                  rx="10"
                  strokeWidth={selectedNodeId === 'client' ? 2.5 : 1.5}
                  fill={selectedNodeId === 'client' ? '#F7F2FA' : '#FFFFF6'}
                  stroke={selectedNodeId === 'client' ? '#B57DDA' : '#E8E2D4'}
                />
                <text x="100" y="65" fill="#41478B" className="font-bold text-[13px]" textAnchor="middle" fontFamily="monospace">
                  Client
                </text>
                <line x1="20" y1="75" x2="180" y2="75" stroke="#E8E2D4" strokeWidth="1" />
                <text x="30" y="95" fill="#41478B" opacity="0.8" className="text-[9px]" fontFamily="monospace">
                  + sendRequest(req): void
                </text>
              </g>

              {/* NODO: Handler (Abstract) */}
              <g
                role="button" tabIndex={0} aria-label="Inspeccionar handler"
                onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setSelectedNodeId('handler'); } }}
                onClick={() => setSelectedNodeId('handler')}
                className="cursor-pointer transition-all hover:opacity-90"
              >
                <rect
                  x="310"
                  y="25"
                  width="170"
                  height="110"
                  rx="10"
                  strokeWidth={selectedNodeId === 'handler' ? 2.5 : 1.5}
                  fill={selectedNodeId === 'handler' ? '#F7F2FA' : '#FFFFF6'}
                  stroke={selectedNodeId === 'handler' ? '#B57DDA' : '#E8E2D4'}
                />
                <text x="395" y="45" fill="#B57DDA" className="text-[10px] font-bold" textAnchor="middle" fontFamily="monospace">
                  {'{abstract}'}
                </text>
                <text x="395" y="62" fill="#41478B" className="font-bold text-[14px]" textAnchor="middle" fontFamily="monospace">
                  Handler
                </text>
                <line x1="310" y1="70" x2="480" y2="70" stroke="#E8E2D4" strokeWidth="1" />
                <text x="320" y="86" fill="#41478B" className="text-[9px]" fontFamily="monospace">
                  {UML_NODES[1].attributes[0]}
                </text>
                <line x1="310" y1="94" x2="480" y2="94" stroke="#E8E2D4" strokeWidth="1" />
                <text x="320" y="110" fill="#41478B" opacity="0.85" className="text-[9px]" fontFamily="monospace">
                  + handleRequest(req): void
                </text>
                <text x="320" y="125" fill="#41478B" opacity="0.85" className="text-[9px]" fontFamily="monospace">
                  + setSuccessor(s): void
                </text>
              </g>

              {/* NODO: ConcreteHandlerA */}
              <g
                role="button" tabIndex={0} aria-label="Inspeccionar concrete_a"
                onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setSelectedNodeId('concrete_a'); } }}
                onClick={() => setSelectedNodeId('concrete_a')}
                className="cursor-pointer transition-all hover:opacity-90"
              >
                <rect
                  x="180"
                  y="230"
                  width="180"
                  height="100"
                  rx="10"
                  strokeWidth={selectedNodeId === 'concrete_a' ? 2.5 : 1.5}
                  fill={selectedNodeId === 'concrete_a' ? '#F7F2FA' : '#FFFFF6'}
                  stroke={selectedNodeId === 'concrete_a' ? '#B57DDA' : '#E8E2D4'}
                />
                <text x="270" y="255" fill="#41478B" className="font-bold text-[13px]" textAnchor="middle" fontFamily="monospace">
                  ConcreteHandlerA
                </text>
                <line x1="180" y1="265" x2="360" y2="265" stroke="#E8E2D4" strokeWidth="1" />
                <text x="190" y="282" fill="#41478B" className="text-[10px]" fontFamily="monospace">
                  - threshold: int
                </text>
                <line x1="180" y1="290" x2="360" y2="290" stroke="#E8E2D4" strokeWidth="1" />
                <text x="190" y="306" fill="#41478B" opacity="0.85" className="text-[9px]" fontFamily="monospace">
                  + handleRequest(req): void
                </text>
                <text x="190" y="321" fill="#41478B" opacity="0.85" className="text-[9px]" fontFamily="monospace">
                  - canHandle(req): boolean
                </text>
              </g>

              {/* NODO: ConcreteHandlerB */}
              <g
                role="button" tabIndex={0} aria-label="Inspeccionar concrete_b"
                onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setSelectedNodeId('concrete_b'); } }}
                onClick={() => setSelectedNodeId('concrete_b')}
                className="cursor-pointer transition-all hover:opacity-90"
              >
                <rect
                  x="420"
                  y="230"
                  width="180"
                  height="100"
                  rx="10"
                  strokeWidth={selectedNodeId === 'concrete_b' ? 2.5 : 1.5}
                  fill={selectedNodeId === 'concrete_b' ? '#F7F2FA' : '#FFFFF6'}
                  stroke={selectedNodeId === 'concrete_b' ? '#B57DDA' : '#E8E2D4'}
                />
                <text x="510" y="255" fill="#41478B" className="font-bold text-[13px]" textAnchor="middle" fontFamily="monospace">
                  ConcreteHandlerB
                </text>
                <line x1="420" y1="265" x2="600" y2="265" stroke="#E8E2D4" strokeWidth="1" />
                <text x="430" y="282" fill="#41478B" className="text-[10px]" fontFamily="monospace">
                  - threshold: int
                </text>
                <line x1="420" y1="290" x2="600" y2="290" stroke="#E8E2D4" strokeWidth="1" />
                <text x="430" y="306" fill="#41478B" opacity="0.85" className="text-[9px]" fontFamily="monospace">
                  + handleRequest(req): void
                </text>
                <text x="430" y="321" fill="#41478B" opacity="0.85" className="text-[9px]" fontFamily="monospace">
                  - canHandle(req): boolean
                </text>
              </g>
            </svg>
          </div>

          <p className="text-[11px] text-french/70 mt-3 italic text-center">
            Diagrama conceptual adaptado de Chain of Responsibility. La referencia opcional <code className="text-french font-mono font-bold bg-bone/30 px-1 rounded">successor</code> se representa mediante una autoasociación navegable con multiplicidad 0..1. La autoasociación y el atributo del bloque Handler representan la misma propiedad; el inspector muestra su detalle. setSuccessor es de la variante mutable; umbrales y canHandle pertenecen al ejemplo. Las firmas abreviadas del dibujo se detallan con sus tipos en el inspector.
          </p>
        </DoubleBezelCard>
      </div>

      {/* Inspector del Nodo UML Seleccionado (5 cols) */}
      <div className="lg:col-span-5">
        <DoubleBezelCard innerClassName="p-6">
          <div className="flex items-center justify-between gap-2 mb-2 pb-3 border-b border-bone">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-lavender block font-bold">
                {selectedNode.stereotype}
              </span>
              <h3 className="text-lg font-bold text-french font-mono">
                {selectedNode.name}
              </h3>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-bone/40 border border-bone text-french">
              Inspector UML
            </span>
          </div>

          {/* Descripción del Rol */}
          <div className="mb-4">
            <span className="text-[11px] font-bold text-french uppercase tracking-wider block mb-1">
              Responsabilidad Arquitectónica:
            </span>
            <p className="text-xs text-french/80 leading-relaxed font-medium">
              {selectedNode.roleDescription}
            </p>
          </div>

          {/* Atributos y Métodos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 font-mono text-xs">
            <div className="p-3 rounded-xl bg-bone/25 border border-bone">
              <span className="text-[10px] uppercase text-french/60 block mb-1 font-bold">
                Atributos:
              </span>
              <ul className="space-y-1 text-french">
                {selectedNode.attributes.map((attr, idx) => (
                  <li key={idx} className="text-[11px] text-french font-semibold">
                    {attr}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3 rounded-xl bg-bone/25 border border-bone">
              <span className="text-[10px] uppercase text-french/60 block mb-1 font-bold">
                Métodos:
              </span>
              <ul className="space-y-1 text-french">
                {selectedNode.methods.map((method, idx) => (
                  <li key={idx} className="text-[11px] text-french font-semibold">
                    {method}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Principios SOLID favorecidos */}
          <div className="p-3 rounded-xl bg-lavender/15 border border-lavender/35">
            <span className="text-[10px] uppercase font-mono font-bold text-french block mb-1.5 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-lavender" /> Principios que puede favorecer:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {selectedNode.solidPrinciples.map((p, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md text-[10px] font-mono font-semibold bg-porcelain text-french border border-lavender/40 shadow-xs"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        </DoubleBezelCard>
      </div>

    </div>
  );
};
