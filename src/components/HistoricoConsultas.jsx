import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { Calendar, Plus, Trash2 } from 'lucide-react';

const HistoricoConsultas = ({ consultas = [], onAddConsulta }) => {
  const [showForm, setShowForm] = useState(false);
  const [novaConsulta, setNovaConsulta] = useState({
    data: new Date().toISOString().split('T')[0],
    peso: '',
    observacoes: '',
    procedimentos: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddConsulta(novaConsulta);
    setNovaConsulta({
      data: new Date().toISOString().split('T')[0],
      peso: '',
      observacoes: '',
      procedimentos: ''
    });
    setShowForm(false);
  };

  const handleInputChange = (field, value) => {
    setNovaConsulta(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Card className="glass-card rounded-2xl border-white/20">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-white">
          <div className="flex items-center space-x-3">
            <Calendar className="w-6 h-6 text-emerald-300" />
            <span>Histórico de Consultas</span>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="glass-button px-4 py-2 text-white hover:bg-emerald-500/30"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Consulta
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Formulário para nova consulta */}
        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white/5 rounded-lg p-4 space-y-4">
            <h3 className="text-white font-semibold">Nova Consulta</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-white font-medium text-sm mb-2 block">
                  Data da Consulta
                </label>
                <Input
                  type="date"
                  value={novaConsulta.data}
                  onChange={(e) => handleInputChange('data', e.target.value)}
                  className="glass-input text-white"
                  required
                />
              </div>
              
              <div>
                <label className="text-white font-medium text-sm mb-2 block">
                  Peso (kg)
                </label>
                <Input
                  type="number"
                  step="0.1"
                  value={novaConsulta.peso}
                  onChange={(e) => handleInputChange('peso', e.target.value)}
                  className="glass-input text-white placeholder-white/60"
                  placeholder="Ex: 25.5"
                />
              </div>
            </div>
            
            <div>
              <label className="text-white font-medium text-sm mb-2 block">
                Procedimentos Realizados
              </label>
              <Textarea
                value={novaConsulta.procedimentos}
                onChange={(e) => handleInputChange('procedimentos', e.target.value)}
                className="glass-input text-white placeholder-white/60 h-20 resize-none"
                placeholder="Descreva os procedimentos realizados..."
              />
            </div>
            
            <div>
              <label className="text-white font-medium text-sm mb-2 block">
                Observações
              </label>
              <Textarea
                value={novaConsulta.observacoes}
                onChange={(e) => handleInputChange('observacoes', e.target.value)}
                className="glass-input text-white placeholder-white/60 h-20 resize-none"
                placeholder="Observações gerais da consulta..."
              />
            </div>
            
            <div className="flex space-x-3">
              <Button
                type="submit"
                className="glass-button px-4 py-2 text-white hover:bg-emerald-500/30"
              >
                Salvar Consulta
              </Button>
              <Button
                type="button"
                onClick={() => setShowForm(false)}
                className="glass-button px-4 py-2 text-white hover:bg-red-500/30"
              >
                Cancelar
              </Button>
            </div>
          </form>
        )}

        {/* Lista de consultas */}
        <div className="space-y-4">
          {consultas.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-white/30 mx-auto mb-3" />
              <p className="text-white/70">Nenhuma consulta registrada</p>
              <p className="text-white/50 text-sm">Clique em "Nova Consulta" para adicionar</p>
            </div>
          ) : (
            consultas.map((consulta, index) => (
              <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="text-white font-semibold">
                      Consulta - {new Date(consulta.data).toLocaleDateString('pt-BR')}
                    </h4>
                    {consulta.peso && (
                      <p className="text-emerald-200 text-sm">Peso: {consulta.peso} kg</p>
                    )}
                  </div>
                </div>
                
                {consulta.procedimentos && (
                  <div className="mb-3">
                    <h5 className="text-white font-medium text-sm mb-1">Procedimentos:</h5>
                    <p className="text-white/80 text-sm">{consulta.procedimentos}</p>
                  </div>
                )}
                
                {consulta.observacoes && (
                  <div>
                    <h5 className="text-white font-medium text-sm mb-1">Observações:</h5>
                    <p className="text-white/80 text-sm">{consulta.observacoes}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default HistoricoConsultas;