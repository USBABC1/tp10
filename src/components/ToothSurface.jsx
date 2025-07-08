import React from 'react';

const ToothSurface = ({ toothNumber, surfaces, onSurfaceClick, isChildTooth = false }) => {
  // Superfícies padrão para dentes permanentes
  const defaultSurfaces = ['V', 'M', 'D', 'L', 'O'];
  
  // Para dentes decíduos, usar as mesmas superfícies
  const toothSurfaces = defaultSurfaces;

  const getSurfaceColor = (surface) => {
    if (surfaces && surfaces[surface]) {
      return 'bg-red-500 border-red-600';
    }
    return 'bg-white border-gray-300 hover:bg-gray-100';
  };

  const handleSurfaceClick = (surface) => {
    onSurfaceClick(toothNumber, surface);
  };

  return (
    <div className="flex flex-col items-center">
      {/* Número do dente */}
      <div className="text-xs font-bold text-white mb-1">
        {toothNumber}
      </div>
      
      {/* Grid de superfícies do dente */}
      <div className="grid grid-cols-3 gap-0.5 border border-white/30 bg-white/10 backdrop-blur-sm rounded-lg p-1">
        {/* Linha superior: V (Vestibular) */}
        <div className="col-span-3">
          <button
            onClick={() => handleSurfaceClick('V')}
            className={`w-full h-3 text-xs font-bold border transition-all duration-200 rounded-sm ${getSurfaceColor('V')}`}
            title={`${toothNumber} - Vestibular`}
          >
            V
          </button>
        </div>
        
        {/* Linha do meio: M (Mesial), O (Oclusal), D (Distal) */}
        <button
          onClick={() => handleSurfaceClick('M')}
          className={`w-6 h-4 text-xs font-bold border transition-all duration-200 rounded-sm ${getSurfaceColor('M')}`}
          title={`${toothNumber} - Mesial`}
        >
          M
        </button>
        <button
          onClick={() => handleSurfaceClick('O')}
          className={`w-6 h-4 text-xs font-bold border transition-all duration-200 rounded-sm ${getSurfaceColor('O')}`}
          title={`${toothNumber} - Oclusal`}
        >
          O
        </button>
        <button
          onClick={() => handleSurfaceClick('D')}
          className={`w-6 h-4 text-xs font-bold border transition-all duration-200 rounded-sm ${getSurfaceColor('D')}`}
          title={`${toothNumber} - Distal`}
        >
          D
        </button>
        
        {/* Linha inferior: L (Lingual) */}
        <div className="col-span-3">
          <button
            onClick={() => handleSurfaceClick('L')}
            className={`w-full h-3 text-xs font-bold border transition-all duration-200 rounded-sm ${getSurfaceColor('L')}`}
            title={`${toothNumber} - Lingual`}
          >
            L
          </button>
        </div>
      </div>
    </div>
  );
};

export default ToothSurface;

