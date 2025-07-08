import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { Smile, RotateCcw, Save } from 'lucide-react';

const MapaDentalAvancado = ({ selectedTeeth = [], onTeethChange, observations = '', onObservationsChange }) => {
  const [selectedCondition, setSelectedCondition] = useState('carie');
  
  // Dentes permanentes
  const dentesSuperiores = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
  const dentesInferiores = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];
  
  // Dentes decíduos
  const dentesDeciduosSuperiores = [55, 54, 53, 52, 51, 61, 62, 63, 64, 65];
  const dentesDeciduosInferiores = [85, 84, 83, 82, 81, 71, 72, 73, 74, 75];

  const condicoes = {
    carie: { color: 'bg-red-500', label: 'Cárie', symbol: '●' },
    restauracao: { color: 'bg-blue-500', label: 'Restauração', symbol: '■' },
    extraido: { color: 'bg-gray-800', label: 'Extraído', symbol: '✕' },
    tratamento: { color: 'bg-yellow-500', label: 'Em Tratamento', symbol: '◐' },
    coroa: { color: 'bg-purple-500', label: 'Coroa', symbol: '◆' },
    implante: { color: 'bg-green-500', label: 'Implante', symbol: '⬢' },
    ausente: { color: 'bg-gray-400', label: 'Ausente', symbol: '○' },
    fratura: { color: 'bg-orange-500', label: 'Fratura', symbol: '⚡' }
  };

  const handleToothClick = (toothNumber) => {
    const existingIndex = selectedTeeth.findIndex(item => item.tooth === toothNumber);
    
    if (existingIndex >= 0) {
      // Se o dente já tem uma condição, atualiza ou remove
      const currentCondition = selectedTeeth[existingIndex].condition;
      if (currentCondition === selectedCondition) {
        // Remove se for a mesma condição
        const newSelectedTeeth = selectedTeeth.filter(item => item.tooth !== toothNumber);
        onTeethChange(newSelectedTeeth);
      } else {
        // Atualiza a condição
        const newSelectedTeeth = [...selectedTeeth];
        newSelectedTeeth[existingIndex] = { tooth: toothNumber, condition: selectedCondition };
        onTeethChange(newSelectedTeeth);
      }
    } else {
      // Adiciona nova condição
      const newSelectedTeeth = [...selectedTeeth, { tooth: toothNumber, condition: selectedCondition }];
      onTeethChange(newSelectedTeeth);
    }
  };

  const getToothCondition = (toothNumber) => {
    const toothData = selectedTeeth.find(item => item.tooth === toothNumber);
    return toothData ? toothData.condition : null;
  };

  const clearAllTeeth = () => {
    onTeethChange([]);
  };

  const renderTooth = (toothNumber, isDeciduous = false) => {
    const condition = getToothCondition(toothNumber);
    const conditionData = condition ? condicoes[condition] : null;
    
    return (
      <div key={toothNumber} className="flex flex-col items-center group">
        <div className="text-xs text-white/80 mb-1 font-medium">
          {toothNumber}
        </div>
        <button
          onClick={() => handleToothClick(toothNumber)}
          className={`
            relative w-10 h-12 rounded-lg border-2 transition-all duration-200 transform hover:scale-110
            ${conditionData 
              ? `${conditionData.color} border-white/50 shadow-lg` 
              : isDeciduous 
                ? 'bg-white/20 border-white/40 hover:bg-white/30' 
                : 'bg-blue-100/20 border-blue-300/40 hover:bg-blue-100/30'
            }
          `}
          title={`Dente ${toothNumber} ${isDeciduous ? '(Decíduo)' : '(Permanente)'} ${conditionData ? `- ${conditionData.label}` : ''}`}
        >
          {/* Representação visual do dente */}
          <div className="absolute inset-1 rounded-md bg-white/10 flex items-center justify-center">
            {conditionData && (
              <span className="text-white font-bold text-lg">
                {conditionData.symbol}
              </span>
            )}
          </div>
          
          {/* Superfícies do dente */}
          <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-0.5 p-1">
            {/* Vestibular */}
            <div className="col-span-3 bg-white/5 rounded-t-md"></div>
            {/* Mesial, Oclusal, Distal */}
            <div className="bg-white/5"></div>
            <div className="bg-white/5"></div>
            <div className="bg-white/5"></div>
            {/* Lingual */}
            <div className="col-span-3 bg-white/5 rounded-b-md"></div>
          </div>
        </button>
      </div>
    );
  };

  return (
    <Card className="glass-card rounded-2xl border-white/20">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-white">
          <div className="flex items-center space-x-3">
            <Smile className="w-6 h-6 text-emerald-300" />
            <span>Mapa Dental Avançado</span>
          </div>
          <Button
            onClick={clearAllTeeth}
            className="glass-button px-4 py-2 text-white hover:bg-red-500/30"
            size="sm"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Limpar
          </Button>
        </CardTitle>
        <p className="text-emerald-100 text-sm">
          Selecione uma condição e clique nos dentes para marcar
        </p>
      </CardHeader>
      
      <CardContent className="space-y-8">
        {/* Seletor de Condições */}
        <div className="bg-white/5 rounded-lg p-4">
          <h3 className="text-white font-semibold mb-3">Condições Dentárias</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {Object.entries(condicoes).map(([key, condition]) => (
              <button
                key={key}
                onClick={() => setSelectedCondition(key)}
                className={`
                  flex items-center space-x-2 p-2 rounded-md border transition-all
                  ${selectedCondition === key 
                    ? 'border-white bg-white/20' 
                    : 'border-white/30 hover:bg-white/10'
                  }
                `}
              >
                <div className={`w-4 h-4 rounded ${condition.color} flex items-center justify-center`}>
                  <span className="text-white text-xs font-bold">{condition.symbol}</span>
                </div>
                <span className="text-white text-xs">{condition.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Odontograma Visual */}
        <div className="bg-white/5 rounded-lg p-6">
          {/* Dentes Superiores */}
          <div className="space-y-6">
            <h3 className="text-white font-semibold text-center">Arcada Superior</h3>
            
            {/* Dentes Permanentes Superiores */}
            <div className="bg-white/5 rounded-lg p-4">
              <p className="text-xs text-blue-200 mb-3 text-center">Dentes Permanentes</p>
              <div className="flex justify-center space-x-1 overflow-x-auto pb-2">
                {dentesSuperiores.map(tooth => renderTooth(tooth, false))}
              </div>
            </div>
            
            {/* Dentes Decíduos Superiores */}
            <div className="bg-white/5 rounded-lg p-4">
              <p className="text-xs text-white/70 mb-3 text-center">Dentes Decíduos</p>
              <div className="flex justify-center space-x-2">
                {dentesDeciduosSuperiores.map(tooth => renderTooth(tooth, true))}
              </div>
            </div>
          </div>

          {/* Linha divisória com imagem de referência */}
          <div className="my-8 flex items-center justify-center">
            <div className="border-t border-white/20 flex-1"></div>
            <div className="mx-4 p-2 bg-white/10 rounded-lg">
              <img 
                src="/src/assets/odontograma.jpg" 
                alt="Referência Odontograma" 
                className="w-16 h-10 object-cover rounded opacity-70"
              />
            </div>
            <div className="border-t border-white/20 flex-1"></div>
          </div>

          {/* Dentes Inferiores */}
          <div className="space-y-6">
            <h3 className="text-white font-semibold text-center">Arcada Inferior</h3>
            
            {/* Dentes Decíduos Inferiores */}
            <div className="bg-white/5 rounded-lg p-4">
              <p className="text-xs text-white/70 mb-3 text-center">Dentes Decíduos</p>
              <div className="flex justify-center space-x-2">
                {dentesDeciduosInferiores.map(tooth => renderTooth(tooth, true))}
              </div>
            </div>
            
            {/* Dentes Permanentes Inferiores */}
            <div className="bg-white/5 rounded-lg p-4">
              <p className="text-xs text-blue-200 mb-3 text-center">Dentes Permanentes</p>
              <div className="flex justify-center space-x-1 overflow-x-auto pb-2">
                {dentesInferiores.map(tooth => renderTooth(tooth, false))}
              </div>
            </div>
          </div>
        </div>

        {/* Legenda Detalhada */}
        <div className="bg-white/5 rounded-lg p-4">
          <h4 className="text-white font-semibold mb-3 text-center">Legenda Completa</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            {Object.entries(condicoes).map(([key, condition]) => (
              <div key={key} className="flex items-center space-x-2">
                <div className={`w-4 h-4 ${condition.color} rounded border flex items-center justify-center`}>
                  <span className="text-white text-xs font-bold">{condition.symbol}</span>
                </div>
                <span className="text-white">{condition.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Resumo dos dentes marcados */}
        {selectedTeeth.length > 0 && (
          <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-3">Resumo do Diagnóstico:</h4>
            <div className="space-y-2">
              {Object.entries(condicoes).map(([conditionKey, conditionData]) => {
                const teethWithCondition = selectedTeeth.filter(item => item.condition === conditionKey);
                if (teethWithCondition.length === 0) return null;
                
                return (
                  <div key={conditionKey} className="flex items-center space-x-2">
                    <div className={`w-4 h-4 ${conditionData.color} rounded flex items-center justify-center`}>
                      <span className="text-white text-xs font-bold">{conditionData.symbol}</span>
                    </div>
                    <span className="text-white font-medium">{conditionData.label}:</span>
                    <div className="flex flex-wrap gap-1">
                      {teethWithCondition.map(item => (
                        <span
                          key={item.tooth}
                          className="bg-white/20 text-white px-2 py-1 rounded text-xs font-medium"
                        >
                          {item.tooth}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Observações Clínicas */}
        <div className="bg-white/5 rounded-lg p-4">
          <h4 className="text-white font-semibold mb-3">Observações Clínicas</h4>
          <Textarea
            value={observations}
            onChange={(e) => onObservationsChange(e.target.value)}
            className="glass-input text-white placeholder-white/60 h-24 resize-none"
            placeholder="Descreva observações sobre o estado dental, tratamentos necessários, prioridades..."
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default MapaDentalAvancado;