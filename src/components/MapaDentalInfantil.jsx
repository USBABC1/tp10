import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Smile } from 'lucide-react';

const MapaDentalInfantil = ({ selectedTeeth = [], onTeethChange }) => {
  // Dentes decíduos superiores (direita para esquerda)
  const dentesSuperiores = [55, 54, 53, 52, 51, 61, 62, 63, 64, 65];
  
  // Dentes decíduos inferiores (direita para esquerda)
  const dentesInferiores = [85, 84, 83, 82, 81, 71, 72, 73, 74, 75];

  // Dentes permanentes que podem estar presentes
  const dentesPermanentesSuperiores = [16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26];
  const dentesPermanentesInferiores = [46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36];

  const handleToothClick = (toothNumber) => {
    const newSelectedTeeth = selectedTeeth.includes(toothNumber)
      ? selectedTeeth.filter(t => t !== toothNumber)
      : [...selectedTeeth, toothNumber];
    
    onTeethChange(newSelectedTeeth);
  };

  const renderTooth = (toothNumber, isDeciduous = true) => {
    const isSelected = selectedTeeth.includes(toothNumber);
    
    return (
      <div key={toothNumber} className="flex flex-col items-center">
        <div className="text-xs text-white/80 mb-1 font-medium">
          {toothNumber}
        </div>
        <button
          onClick={() => handleToothClick(toothNumber)}
          className={`w-8 h-10 rounded-lg border-2 transition-all duration-200 ${
            isSelected
              ? 'bg-red-500 border-red-600 shadow-lg'
              : isDeciduous
                ? 'bg-white/20 border-white/40 hover:bg-white/30'
                : 'bg-blue-100/20 border-blue-300/40 hover:bg-blue-100/30'
          }`}
          title={`Dente ${toothNumber} ${isDeciduous ? '(Decíduo)' : '(Permanente)'}`}
        >
          <div className={`w-full h-full rounded-md ${
            isSelected ? 'bg-red-600' : isDeciduous ? 'bg-white/10' : 'bg-blue-100/10'
          }`} />
        </button>
      </div>
    );
  };

  return (
    <Card className="glass-card rounded-2xl border-white/20">
      <CardHeader>
        <CardTitle className="flex items-center space-x-3 text-white">
          <Smile className="w-6 h-6 text-emerald-300" />
          <span>Mapa Dental Infantil</span>
        </CardTitle>
        <p className="text-emerald-100 text-sm">
          Clique nos dentes para marcar alterações. Azul = Permanentes, Branco = Decíduos
        </p>
      </CardHeader>
      
      <CardContent className="space-y-8">
        {/* Dentes Superiores */}
        <div className="space-y-4">
          <h3 className="text-white font-semibold text-center">Arcada Superior</h3>
          
          {/* Dentes Permanentes Superiores */}
          <div className="bg-white/5 rounded-lg p-4">
            <p className="text-xs text-blue-200 mb-2 text-center">Dentes Permanentes</p>
            <div className="flex justify-center space-x-2">
              {dentesPermanentesSuperiores.map(tooth => renderTooth(tooth, false))}
            </div>
          </div>
          
          {/* Dentes Decíduos Superiores */}
          <div className="bg-white/5 rounded-lg p-4">
            <p className="text-xs text-white/70 mb-2 text-center">Dentes Decíduos</p>
            <div className="flex justify-center space-x-2">
              {dentesSuperiores.map(tooth => renderTooth(tooth, true))}
            </div>
          </div>
        </div>

        {/* Linha divisória */}
        <div className="border-t border-white/20"></div>

        {/* Dentes Inferiores */}
        <div className="space-y-4">
          <h3 className="text-white font-semibold text-center">Arcada Inferior</h3>
          
          {/* Dentes Decíduos Inferiores */}
          <div className="bg-white/5 rounded-lg p-4">
            <p className="text-xs text-white/70 mb-2 text-center">Dentes Decíduos</p>
            <div className="flex justify-center space-x-2">
              {dentesInferiores.map(tooth => renderTooth(tooth, true))}
            </div>
          </div>
          
          {/* Dentes Permanentes Inferiores */}
          <div className="bg-white/5 rounded-lg p-4">
            <p className="text-xs text-blue-200 mb-2 text-center">Dentes Permanentes</p>
            <div className="flex justify-center space-x-2">
              {dentesPermanentesInferiores.map(tooth => renderTooth(tooth, false))}
            </div>
          </div>
        </div>

        {/* Legenda */}
        <div className="bg-white/5 rounded-lg p-4">
          <h4 className="text-white font-semibold mb-3 text-center">Legenda</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-red-500 rounded border"></div>
              <span className="text-white">Alteração/Problema</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-white/20 rounded border border-white/40"></div>
              <span className="text-white">Dente Decíduo Normal</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-100/20 rounded border border-blue-300/40"></div>
              <span className="text-white">Dente Permanente Normal</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-transparent rounded border border-white/20"></div>
              <span className="text-white">Não Presente</span>
            </div>
          </div>
        </div>

        {/* Resumo dos dentes selecionados */}
        {selectedTeeth.length > 0 && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-2">Dentes com Alterações:</h4>
            <div className="flex flex-wrap gap-2">
              {selectedTeeth.sort((a, b) => a - b).map(tooth => (
                <span
                  key={tooth}
                  className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium"
                >
                  {tooth}
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MapaDentalInfantil;