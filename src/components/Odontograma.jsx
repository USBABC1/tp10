import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { Download, Save, FileText, ArrowLeft, Users } from 'lucide-react';
import PDFGenerator from './PDFGenerator';
import PatientList from './PatientList';
import { patientService, odontogramaService } from '../lib/supabase';

const Odontograma = () => {
  const [currentView, setCurrentView] = useState('list'); // 'list' ou 'odontograma'
  const [currentPatient, setCurrentPatient] = useState(null);
  const [patientData, setPatientData] = useState({
    nome: '',
    idade: '',
    data: new Date().toLocaleDateString('pt-BR'),
    observacoes: ''
  });

  const [teethStatus, setTeethStatus] = useState({});
  const [saving, setSaving] = useState(false);
  const odontogramaRef = useRef(null);

  // Numeração dos dentes conforme padrão odontológico
  const upperTeeth = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
  const lowerTeeth = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];
  const upperChildTeeth = [55, 54, 53, 52, 51, 61, 62, 63, 64, 65];
  const lowerChildTeeth = [85, 84, 83, 82, 81, 71, 72, 73, 74, 75];

  const handleToothClick = (toothNumber, surface) => {
    const key = `${toothNumber}-${surface}`;
    setTeethStatus(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handlePatientDataChange = (field, value) => {
    setPatientData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSelectPatient = async (patient) => {
    setCurrentPatient(patient);
    setPatientData({
      nome: patient.nome || '',
      idade: patient.idade || '',
      data: patient.data || new Date().toLocaleDateString('pt-BR'),
      observacoes: patient.observacoes || ''
    });

    // Carregar último odontograma do paciente
    try {
      const latestOdontograma = await odontogramaService.getLatestOdontograma(patient.id);
      if (latestOdontograma) {
        setTeethStatus(latestOdontograma.teeth_status || {});
      } else {
        setTeethStatus({});
      }
    } catch (error) {
      console.error('Erro ao carregar odontograma:', error);
      setTeethStatus({});
    }

    setCurrentView('odontograma');
  };

  const handleNewPatient = () => {
    setCurrentPatient(null);
    setPatientData({
      nome: '',
      idade: '',
      data: new Date().toLocaleDateString('pt-BR'),
      observacoes: ''
    });
    setTeethStatus({});
    setCurrentView('odontograma');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setCurrentPatient(null);
  };

  const savePatientData = async () => {
    try {
      setSaving(true);
      
      let patient;
      if (currentPatient) {
        // Atualizar paciente existente
        patient = await patientService.updatePatient(currentPatient.id, patientData);
      } else {
        // Criar novo paciente
        patient = await patientService.createPatient(patientData);
        setCurrentPatient(patient);
      }

      // Salvar odontograma
      await odontogramaService.saveOdontograma(
        patient.id,
        teethStatus,
        patientData.observacoes
      );

      alert('Dados salvos com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar dados');
    } finally {
      setSaving(false);
    }
  };

  const generatePDF = () => {
    PDFGenerator.generatePDF(patientData, teethStatus, odontogramaRef);
  };

  const renderTooth = (toothNumber, isChild = false) => {
    const toothKey = toothNumber.toString();
    
    return (
      <div key={toothNumber} className="relative">
        {/* Número do dente */}
        <div className="text-xs text-center mb-1 font-medium">
          {toothNumber}
        </div>
        
        {/* Estrutura do dente */}
        <div className="relative w-12 h-16 border-2 border-gray-800 bg-white">
          {/* Coroa - parte superior */}
          <div className="relative h-8 border-b border-gray-800">
            {/* Superfícies da coroa */}
            <div className="grid grid-cols-3 h-full">
              {/* Vestibular */}
              <div 
                className={`border-r border-gray-400 cursor-pointer transition-colors ${
                  teethStatus[`${toothNumber}-vestibular`] ? 'bg-red-500' : 'hover:bg-gray-100'
                }`}
                onClick={() => handleToothClick(toothNumber, 'vestibular')}
              />
              {/* Oclusal/Incisal */}
              <div 
                className={`border-r border-gray-400 cursor-pointer transition-colors ${
                  teethStatus[`${toothNumber}-oclusal`] ? 'bg-red-500' : 'hover:bg-gray-100'
                }`}
                onClick={() => handleToothClick(toothNumber, 'oclusal')}
              />
              {/* Lingual */}
              <div 
                className={`cursor-pointer transition-colors ${
                  teethStatus[`${toothNumber}-lingual`] ? 'bg-red-500' : 'hover:bg-gray-100'
                }`}
                onClick={() => handleToothClick(toothNumber, 'lingual')}
              />
            </div>
          </div>
          
          {/* Raiz - parte inferior */}
          <div className="relative h-8">
            {/* Superfícies da raiz */}
            <div className="grid grid-cols-2 h-full">
              {/* Mesial */}
              <div 
                className={`border-r border-gray-400 cursor-pointer transition-colors ${
                  teethStatus[`${toothNumber}-mesial`] ? 'bg-red-500' : 'hover:bg-gray-100'
                }`}
                onClick={() => handleToothClick(toothNumber, 'mesial')}
              />
              {/* Distal */}
              <div 
                className={`cursor-pointer transition-colors ${
                  teethStatus[`${toothNumber}-distal`] ? 'bg-red-500' : 'hover:bg-gray-100'
                }`}
                onClick={() => handleToothClick(toothNumber, 'distal')}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      {/* Cabeçalho */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">ODONTOGRAMA</h1>
        <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
      </div>

      {/* Dados do Paciente */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Dados do Paciente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                value={patientData.nome}
                onChange={(e) => handlePatientDataChange('nome', e.target.value)}
                placeholder="Nome do paciente"
              />
            </div>
            <div>
              <Label htmlFor="idade">Idade</Label>
              <Input
                id="idade"
                value={patientData.idade}
                onChange={(e) => handlePatientDataChange('idade', e.target.value)}
                placeholder="Idade"
              />
            </div>
            <div>
              <Label htmlFor="data">Data</Label>
              <Input
                id="data"
                value={patientData.data}
                onChange={(e) => handlePatientDataChange('data', e.target.value)}
                type="date"
              />
            </div>
          </div>
          <div className="mt-4">
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              value={patientData.observacoes}
              onChange={(e) => handlePatientDataChange('observacoes', e.target.value)}
              placeholder="Observações clínicas..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Odontograma */}
      <Card>
        <CardHeader>
          <CardTitle>Odontograma</CardTitle>
          <p className="text-sm text-gray-600">
            Clique nas superfícies dos dentes para marcar alterações
          </p>
        </CardHeader>
        <CardContent>
          <div ref={odontogramaRef} className="bg-white p-6">
            {/* Dentes Superiores Permanentes */}
            <div className="mb-8">
              <h3 className="text-center font-semibold mb-4">Dentes Superiores</h3>
              <div className="flex justify-center gap-1">
                {upperTeeth.map(tooth => renderTooth(tooth))}
              </div>
            </div>

            {/* Dentes Superiores Decíduos */}
            <div className="mb-8">
              <h3 className="text-center font-semibold mb-4 text-sm">Dentes Decíduos Superiores</h3>
              <div className="flex justify-center gap-1">
                {upperChildTeeth.map(tooth => renderTooth(tooth, true))}
              </div>
            </div>

            {/* Dentes Inferiores Decíduos */}
            <div className="mb-8">
              <h3 className="text-center font-semibold mb-4 text-sm">Dentes Decíduos Inferiores</h3>
              <div className="flex justify-center gap-1">
                {lowerChildTeeth.map(tooth => renderTooth(tooth, true))}
              </div>
            </div>

            {/* Dentes Inferiores Permanentes */}
            <div className="mb-8">
              <h3 className="text-center font-semibold mb-4">Dentes Inferiores</h3>
              <div className="flex justify-center gap-1">
                {lowerTeeth.map(tooth => renderTooth(tooth))}
              </div>
            </div>
          </div>

          {/* Legenda */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold mb-2">Legenda:</h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span>Alteração</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-white border border-gray-400 rounded"></div>
                <span>Normal</span>
              </div>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex gap-4 mt-6">
            <Button onClick={generatePDF} className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Exportar PDF
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Save className="w-4 h-4" />
              Salvar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Odontograma;

