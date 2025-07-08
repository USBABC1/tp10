import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Textarea } from '@/components/ui/textarea.jsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx';
import { User, FileText, Bluetooth as Tooth, History, Download, Save } from 'lucide-react';
import GoogleAuth from './GoogleAuth';
import CampoSimNao from './CampoSimNao';
import MapaDentalInfantil from './MapaDentalInfantil';
import MapaDentalAvancado from './MapaDentalAvancado';
import HistoricoConsultas from './HistoricoConsultas';
import PDFExporter from './PDFExporter';

const OdontogramaUpdated = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dados-pessoais');
  const [saving, setSaving] = useState(false);

  // Estado do formulário
  const [formData, setFormData] = useState({
    // Dados Pessoais
    nome_crianca: '',
    data_nascimento: '',
    idade: '',
    cel: '',
    endereco: '',
    bairro: '',
    cep: '',
    cidade: '',
    
    // Dados dos Pais
    nome_mae: '',
    idade_mae: '',
    profissao_mae: '',
    nome_pai: '',
    idade_pai: '',
    profissao_pai: '',
    
    // Motivo da Consulta
    motivo_consulta: '',
    alteracao_gestacao: '',
    
    // Necessidades Especiais
    necessidade_especial: null,
    qual_necessidade: '',
    comprometimento_coordenacao: null,
    qual_coordenacao: '',
    comprometimento_visual: null,
    qual_visual: '',
    comprometimento_comunicacao: null,
    qual_comunicacao: '',
    reacao_contrariado: '',
    reacao_profissionais: '',
    
    // Histórico Médico
    sofreu_cirurgia: null,
    qual_cirurgia: '',
    alteracoes_sanguineas: null,
    problemas_respiratorios: null,
    problemas_hepaticos: null,
    cardiopatias: null,
    problemas_gastricos: null,
    alergias_medicamento: '',
    alergias_alimentar: '',
    alergias_respiratoria: '',
    tratamentos_atuais: '',
    
    // Hábitos
    mama_peito: null,
    mamou_peito: null,
    ate_quando_mamou: '',
    toma_mamadeira: null,
    tomou_mamadeira: null,
    ate_quando_mamadeira: '',
    engasga_vomita: '',
    chupa_dedo: '',
    chupa_chupeta: '',
    outros_habitos: '',
    range_dentes: '',
    
    // Higiene Bucal
    escova_usa: '',
    creme_dental: '',
    higiene_bucal: '',
    vezes_dia_higiene: '',
    tomou_anestesia: null,
    gengiva_sangra: null,
    extracoes_dentarias: null,
    escova_lingua: null,
    usa_fio_dental: null,
    
    // Mapa Dental
    mapa_dental: [],
    observacoes_dentais: '',
    
    // Informações Adicionais
    alimentacao_notas: '',
    informacoes_adicionais: '',
    responsavel_nome: ''
  });

  const [consultas, setConsultas] = useState([]);

  const handleLogin = (userData) => {
    console.log('Login realizado:', userData);
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    setFormData({
      nome_crianca: '',
      data_nascimento: '',
      idade: '',
      cel: '',
      endereco: '',
      bairro: '',
      cep: '',
      cidade: '',
      nome_mae: '',
      idade_mae: '',
      profissao_mae: '',
      nome_pai: '',
      idade_pai: '',
      profissao_pai: '',
      motivo_consulta: '',
      alteracao_gestacao: '',
      necessidade_especial: null,
      qual_necessidade: '',
      comprometimento_coordenacao: null,
      qual_coordenacao: '',
      comprometimento_visual: null,
      qual_visual: '',
      comprometimento_comunicacao: null,
      qual_comunicacao: '',
      reacao_contrariado: '',
      reacao_profissionais: '',
      sofreu_cirurgia: null,
      qual_cirurgia: '',
      alteracoes_sanguineas: null,
      problemas_respiratorios: null,
      problemas_hepaticos: null,
      cardiopatias: null,
      problemas_gastricos: null,
      alergias_medicamento: '',
      alergias_alimentar: '',
      alergias_respiratoria: '',
      tratamentos_atuais: '',
      mama_peito: null,
      mamou_peito: null,
      ate_quando_mamou: '',
      toma_mamadeira: null,
      tomou_mamadeira: null,
      ate_quando_mamadeira: '',
      engasga_vomita: '',
      chupa_dedo: '',
      chupa_chupeta: '',
      outros_habitos: '',
      range_dentes: '',
      escova_usa: '',
      creme_dental: '',
      higiene_bucal: '',
      vezes_dia_higiene: '',
      tomou_anestesia: null,
      gengiva_sangra: null,
      extracoes_dentarias: null,
      escova_lingua: null,
      usa_fio_dental: null,
      mapa_dental: [],
      alimentacao_notas: '',
      informacoes_adicionais: '',
      responsavel_nome: ''
    });
    setConsultas([]);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTeethChange = (selectedTeeth) => {
    setFormData(prev => ({
      ...prev,
      mapa_dental: selectedTeeth
    }));
  };

  const handleObservationsChange = (observations) => {
    setFormData(prev => ({
      ...prev,
      observacoes_dentais: observations
    }));
  };

  const handleAddConsulta = (novaConsulta) => {
    setConsultas(prev => [novaConsulta, ...prev]);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      // Aqui você pode implementar a lógica de salvamento no Supabase
      console.log('Salvando dados:', formData);
      
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Dados salvos com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar dados');
    } finally {
      setSaving(false);
    }
  };

  const handleExportPDF = async () => {
    try {
      await PDFExporter.generatePDF(formData);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar PDF');
    }
  };

  if (!user) {
    return <GoogleAuth onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-cover bg-center bg-no-repeat" 
         style={{backgroundImage: 'url(/src/assets/bg.png)'}}>
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/80 via-teal-700/80 to-cyan-800/80"></div>
      
      {/* Floating Particles */}
      <div className="floating-particles">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20">
              <img 
                src="/assets/logo.png" 
                alt="Tio Paulo Logo" 
                className="w-10 h-10 object-contain"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Tio Paulo</h1>
              <p className="text-emerald-100">Ficha de Anamnese Odontológica</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <img 
                src={user.picture} 
                alt={user.name}
                className="w-8 h-8 rounded-full"
              />
              <span className="text-white font-medium">{user.name}</span>
            </div>
            <Button
              onClick={handleLogout}
              className="glass-button px-4 py-2 text-white hover:bg-red-500/30"
            >
              Sair
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="glass-card rounded-2xl border-white/20">
              <CardHeader>
                <CardTitle className="text-white">Navegação</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical">
                  <TabsList className="flex flex-col h-auto w-full bg-white/10 p-1">
                    <TabsTrigger 
                      value="dados-pessoais" 
                      className="w-full justify-start text-white data-[state=active]:bg-emerald-500/30"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Dados Pessoais
                    </TabsTrigger>
                    <TabsTrigger 
                      value="anamnese" 
                      className="w-full justify-start text-white data-[state=active]:bg-emerald-500/30"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Anamnese
                    </TabsTrigger>
                    <TabsTrigger 
                      value="mapa-dental" 
                      className="w-full justify-start text-white data-[state=active]:bg-emerald-500/30"
                    >
                      <Tooth className="w-4 h-4 mr-2" />
                      Mapa Dental
                    </TabsTrigger>
                    <TabsTrigger 
                      value="historico" 
                      className="w-full justify-start text-white data-[state=active]:bg-emerald-500/30"
                    >
                      <History className="w-4 h-4 mr-2" />
                      Histórico
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              {/* Dados Pessoais */}
              <TabsContent value="dados-pessoais">
                <Card className="glass-card rounded-2xl border-white/20">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-3 text-white">
                      <User className="w-6 h-6 text-emerald-300" />
                      <span>Dados Pessoais</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Dados da Criança */}
                    <div>
                      <h3 className="text-white font-semibold mb-4">Dados da Criança</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-white font-medium text-sm mb-2 block">
                            Nome da Criança
                          </label>
                          <Input
                            value={formData.nome_crianca}
                            onChange={(e) => handleInputChange('nome_crianca', e.target.value)}
                            className="glass-input text-white placeholder-white/60"
                            placeholder="Nome completo"
                          />
                        </div>
                        <div>
                          <label className="text-white font-medium text-sm mb-2 block">
                            Data de Nascimento
                          </label>
                          <Input
                            type="date"
                            value={formData.data_nascimento}
                            onChange={(e) => handleInputChange('data_nascimento', e.target.value)}
                            className="glass-input text-white"
                          />
                        </div>
                        <div>
                          <label className="text-white font-medium text-sm mb-2 block">
                            Idade
                          </label>
                          <Input
                            value={formData.idade}
                            onChange={(e) => handleInputChange('idade', e.target.value)}
                            className="glass-input text-white placeholder-white/60"
                            placeholder="Ex: 8 anos"
                          />
                        </div>
                        <div>
                          <label className="text-white font-medium text-sm mb-2 block">
                            Celular
                          </label>
                          <Input
                            value={formData.cel}
                            onChange={(e) => handleInputChange('cel', e.target.value)}
                            className="glass-input text-white placeholder-white/60"
                            placeholder="(00) 00000-0000"
                          />
                        </div>
                        <div>
                          <label className="text-white font-medium text-sm mb-2 block">
                            Endereço
                          </label>
                          <Input
                            value={formData.endereco}
                            onChange={(e) => handleInputChange('endereco', e.target.value)}
                            className="glass-input text-white placeholder-white/60"
                            placeholder="Rua, número"
                          />
                        </div>
                        <div>
                          <label className="text-white font-medium text-sm mb-2 block">
                            Bairro
                          </label>
                          <Input
                            value={formData.bairro}
                            onChange={(e) => handleInputChange('bairro', e.target.value)}
                            className="glass-input text-white placeholder-white/60"
                            placeholder="Nome do bairro"
                          />
                        </div>
                        <div>
                          <label className="text-white font-medium text-sm mb-2 block">
                            CEP
                          </label>
                          <Input
                            value={formData.cep}
                            onChange={(e) => handleInputChange('cep', e.target.value)}
                            className="glass-input text-white placeholder-white/60"
                            placeholder="00000-000"
                          />
                        </div>
                        <div>
                          <label className="text-white font-medium text-sm mb-2 block">
                            Cidade
                          </label>
                          <Input
                            value={formData.cidade}
                            onChange={(e) => handleInputChange('cidade', e.target.value)}
                            className="glass-input text-white placeholder-white/60"
                            placeholder="Nome da cidade"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Dados dos Pais */}
                    <div>
                      <h3 className="text-white font-semibold mb-4">Dados dos Pais</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h4 className="text-emerald-200 font-medium">Mãe</h4>
                          <div>
                            <label className="text-white font-medium text-sm mb-2 block">
                              Nome da Mãe
                            </label>
                            <Input
                              value={formData.nome_mae}
                              onChange={(e) => handleInputChange('nome_mae', e.target.value)}
                              className="glass-input text-white placeholder-white/60"
                              placeholder="Nome completo"
                            />
                          </div>
                          <div>
                            <label className="text-white font-medium text-sm mb-2 block">
                              Idade
                            </label>
                            <Input
                              value={formData.idade_mae}
                              onChange={(e) => handleInputChange('idade_mae', e.target.value)}
                              className="glass-input text-white placeholder-white/60"
                              placeholder="Idade"
                            />
                          </div>
                          <div>
                            <label className="text-white font-medium text-sm mb-2 block">
                              Profissão
                            </label>
                            <Input
                              value={formData.profissao_mae}
                              onChange={(e) => handleInputChange('profissao_mae', e.target.value)}
                              className="glass-input text-white placeholder-white/60"
                              placeholder="Profissão"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-4">
                          <h4 className="text-emerald-200 font-medium">Pai</h4>
                          <div>
                            <label className="text-white font-medium text-sm mb-2 block">
                              Nome do Pai
                            </label>
                            <Input
                              value={formData.nome_pai}
                              onChange={(e) => handleInputChange('nome_pai', e.target.value)}
                              className="glass-input text-white placeholder-white/60"
                              placeholder="Nome completo"
                            />
                          </div>
                          <div>
                            <label className="text-white font-medium text-sm mb-2 block">
                              Idade
                            </label>
                            <Input
                              value={formData.idade_pai}
                              onChange={(e) => handleInputChange('idade_pai', e.target.value)}
                              className="glass-input text-white placeholder-white/60"
                              placeholder="Idade"
                            />
                          </div>
                          <div>
                            <label className="text-white font-medium text-sm mb-2 block">
                              Profissão
                            </label>
                            <Input
                              value={formData.profissao_pai}
                              onChange={(e) => handleInputChange('profissao_pai', e.target.value)}
                              className="glass-input text-white placeholder-white/60"
                              placeholder="Profissão"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Motivo da Consulta */}
                    <div>
                      <h3 className="text-white font-semibold mb-4">Motivo da Consulta</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="text-white font-medium text-sm mb-2 block">
                            Motivo da consulta
                          </label>
                          <Textarea
                            value={formData.motivo_consulta}
                            onChange={(e) => handleInputChange('motivo_consulta', e.target.value)}
                            className="glass-input text-white placeholder-white/60 h-20 resize-none"
                            placeholder="Descreva o motivo da consulta..."
                          />
                        </div>
                        <div>
                          <label className="text-white font-medium text-sm mb-2 block">
                            Alterações durante a gestação
                          </label>
                          <Textarea
                            value={formData.alteracao_gestacao}
                            onChange={(e) => handleInputChange('alteracao_gestacao', e.target.value)}
                            className="glass-input text-white placeholder-white/60 h-20 resize-none"
                            placeholder="Descreva alterações durante a gestação..."
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Anamnese */}
              <TabsContent value="anamnese">
                <div className="space-y-6">
                  {/* Necessidades Especiais */}
                  <Card className="glass-card rounded-2xl border-white/20">
                    <CardHeader>
                      <CardTitle className="text-white">Necessidades Especiais</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <CampoSimNao
                        label="A criança possui alguma necessidade especial?"
                        value={formData.necessidade_especial}
                        onChange={(value) => handleInputChange('necessidade_especial', value)}
                        textField="Qual?"
                        textValue={formData.qual_necessidade}
                        onTextChange={(value) => handleInputChange('qual_necessidade', value)}
                      />
                      
                      <CampoSimNao
                        label="Possui comprometimento de coordenação motora?"
                        value={formData.comprometimento_coordenacao}
                        onChange={(value) => handleInputChange('comprometimento_coordenacao', value)}
                        textField="Qual?"
                        textValue={formData.qual_coordenacao}
                        onTextChange={(value) => handleInputChange('qual_coordenacao', value)}
                      />
                      
                      <CampoSimNao
                        label="Possui comprometimento visual?"
                        value={formData.comprometimento_visual}
                        onChange={(value) => handleInputChange('comprometimento_visual', value)}
                        textField="Qual?"
                        textValue={formData.qual_visual}
                        onTextChange={(value) => handleInputChange('qual_visual', value)}
                      />
                      
                      <CampoSimNao
                        label="Possui comprometimento de comunicação?"
                        value={formData.comprometimento_comunicacao}
                        onChange={(value) => handleInputChange('comprometimento_comunicacao', value)}
                        textField="Qual?"
                        textValue={formData.qual_comunicacao}
                        onTextChange={(value) => handleInputChange('qual_comunicacao', value)}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-white font-medium text-sm mb-2 block">
                            Como reage quando é contrariado?
                          </label>
                          <Textarea
                            value={formData.reacao_contrariado}
                            onChange={(e) => handleInputChange('reacao_contrariado', e.target.value)}
                            className="glass-input text-white placeholder-white/60 h-20 resize-none"
                            placeholder="Descreva a reação..."
                          />
                        </div>
                        <div>
                          <label className="text-white font-medium text-sm mb-2 block">
                            Como reage com profissionais da saúde?
                          </label>
                          <Textarea
                            value={formData.reacao_profissionais}
                            onChange={(e) => handleInputChange('reacao_profissionais', e.target.value)}
                            className="glass-input text-white placeholder-white/60 h-20 resize-none"
                            placeholder="Descreva a reação..."
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Histórico Médico */}
                  <Card className="glass-card rounded-2xl border-white/20">
                    <CardHeader>
                      <CardTitle className="text-white">Histórico Médico</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <CampoSimNao
                        label="A criança já sofreu alguma cirurgia?"
                        value={formData.sofreu_cirurgia}
                        onChange={(value) => handleInputChange('sofreu_cirurgia', value)}
                        textField="Qual?"
                        textValue={formData.qual_cirurgia}
                        onTextChange={(value) => handleInputChange('qual_cirurgia', value)}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <CampoSimNao
                            label="Alterações sanguíneas?"
                            value={formData.alteracoes_sanguineas}
                            onChange={(value) => handleInputChange('alteracoes_sanguineas', value)}
                          />
                          <CampoSimNao
                            label="Problemas respiratórios?"
                            value={formData.problemas_respiratorios}
                            onChange={(value) => handleInputChange('problemas_respiratorios', value)}
                          />
                          <CampoSimNao
                            label="Problemas hepáticos?"
                            value={formData.problemas_hepaticos}
                            onChange={(value) => handleInputChange('problemas_hepaticos', value)}
                          />
                        </div>
                        <div className="space-y-4">
                          <CampoSimNao
                            label="Cardiopatias?"
                            value={formData.cardiopatias}
                            onChange={(value) => handleInputChange('cardiopatias', value)}
                          />
                          <CampoSimNao
                            label="Problemas gástricos?"
                            value={formData.problemas_gastricos}
                            onChange={(value) => handleInputChange('problemas_gastricos', value)}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="text-white font-medium text-sm mb-2 block">
                            Alergias a medicamentos
                          </label>
                          <Input
                            value={formData.alergias_medicamento}
                            onChange={(e) => handleInputChange('alergias_medicamento', e.target.value)}
                            className="glass-input text-white placeholder-white/60"
                            placeholder="Quais medicamentos?"
                          />
                        </div>
                        <div>
                          <label className="text-white font-medium text-sm mb-2 block">
                            Alergias alimentares
                          </label>
                          <Input
                            value={formData.alergias_alimentar}
                            onChange={(e) => handleInputChange('alergias_alimentar', e.target.value)}
                            className="glass-input text-white placeholder-white/60"
                            placeholder="Quais alimentos?"
                          />
                        </div>
                        <div>
                          <label className="text-white font-medium text-sm mb-2 block">
                            Alergias respiratórias
                          </label>
                          <Input
                            value={formData.alergias_respiratoria}
                            onChange={(e) => handleInputChange('alergias_respiratoria', e.target.value)}
                            className="glass-input text-white placeholder-white/60"
                            placeholder="Quais alérgenos?"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-white font-medium text-sm mb-2 block">
                          Tratamentos atuais
                        </label>
                        <Textarea
                          value={formData.tratamentos_atuais}
                          onChange={(e) => handleInputChange('tratamentos_atuais', e.target.value)}
                          className="glass-input text-white placeholder-white/60 h-20 resize-none"
                          placeholder="Descreva tratamentos em andamento..."
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Hábitos */}
                  <Card className="glass-card rounded-2xl border-white/20">
                    <CardHeader>
                      <CardTitle className="text-white">Hábitos</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <CampoSimNao
                            label="A criança mama no peito?"
                            value={formData.mama_peito}
                            onChange={(value) => handleInputChange('mama_peito', value)}
                          />
                          <CampoSimNao
                            label="Já mamou no peito?"
                            value={formData.mamou_peito}
                            onChange={(value) => handleInputChange('mamou_peito', value)}
                            textField="Até quando?"
                            textValue={formData.ate_quando_mamou}
                            onTextChange={(value) => handleInputChange('ate_quando_mamou', value)}
                          />
                          <CampoSimNao
                            label="A criança toma mamadeira?"
                            value={formData.toma_mamadeira}
                            onChange={(value) => handleInputChange('toma_mamadeira', value)}
                          />
                          <CampoSimNao
                            label="Já tomou mamadeira?"
                            value={formData.tomou_mamadeira}
                            onChange={(value) => handleInputChange('tomou_mamadeira', value)}
                            textField="Até quando?"
                            textValue={formData.ate_quando_mamadeira}
                            onTextChange={(value) => handleInputChange('ate_quando_mamadeira', value)}
                          />
                        </div>
                        <div className="space-y-4">
                          <div>
                            <label className="text-white font-medium text-sm mb-2 block">
                              Engasga ou vomita com facilidade?
                            </label>
                            <Input
                              value={formData.engasga_vomita}
                              onChange={(e) => handleInputChange('engasga_vomita', e.target.value)}
                              className="glass-input text-white placeholder-white/60"
                              placeholder="Descreva..."
                            />
                          </div>
                          <div>
                            <label className="text-white font-medium text-sm mb-2 block">
                              Chupa o dedo?
                            </label>
                            <Input
                              value={formData.chupa_dedo}
                              onChange={(e) => handleInputChange('chupa_dedo', e.target.value)}
                              className="glass-input text-white placeholder-white/60"
                              placeholder="Qual dedo? Com que frequência?"
                            />
                          </div>
                          <div>
                            <label className="text-white font-medium text-sm mb-2 block">
                              Chupa chupeta?
                            </label>
                            <Input
                              value={formData.chupa_chupeta}
                              onChange={(e) => handleInputChange('chupa_chupeta', e.target.value)}
                              className="glass-input text-white placeholder-white/60"
                              placeholder="Com que frequência?"
                            />
                          </div>
                          <div>
                            <label className="text-white font-medium text-sm mb-2 block">
                              Outros hábitos
                            </label>
                            <Input
                              value={formData.outros_habitos}
                              onChange={(e) => handleInputChange('outros_habitos', e.target.value)}
                              className="glass-input text-white placeholder-white/60"
                              placeholder="Descreva outros hábitos..."
                            />
                          </div>
                          <div>
                            <label className="text-white font-medium text-sm mb-2 block">
                              Range os dentes?
                            </label>
                            <Input
                              value={formData.range_dentes}
                              onChange={(e) => handleInputChange('range_dentes', e.target.value)}
                              className="glass-input text-white placeholder-white/60"
                              placeholder="Durante o dia/noite?"
                            />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Higiene Bucal */}
                  <Card className="glass-card rounded-2xl border-white/20">
                    <CardHeader>
                      <CardTitle className="text-white">Higiene Bucal</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-white font-medium text-sm mb-2 block">
                            Qual escova usa?
                          </label>
                          <Input
                            value={formData.escova_usa}
                            onChange={(e) => handleInputChange('escova_usa', e.target.value)}
                            className="glass-input text-white placeholder-white/60"
                            placeholder="Tipo de escova"
                          />
                        </div>
                        <div>
                          <label className="text-white font-medium text-sm mb-2 block">
                            Qual creme dental usa?
                          </label>
                          <Input
                            value={formData.creme_dental}
                            onChange={(e) => handleInputChange('creme_dental', e.target.value)}
                            className="glass-input text-white placeholder-white/60"
                            placeholder="Marca/tipo"
                          />
                        </div>
                        <div>
                          <label className="text-white font-medium text-sm mb-2 block">
                            Quem faz a higiene bucal?
                          </label>
                          <Input
                            value={formData.higiene_bucal}
                            onChange={(e) => handleInputChange('higiene_bucal', e.target.value)}
                            className="glass-input text-white placeholder-white/60"
                            placeholder="Criança/responsável"
                          />
                        </div>
                        <div>
                          <label className="text-white font-medium text-sm mb-2 block">
                            Quantas vezes ao dia?
                          </label>
                          <Input
                            value={formData.vezes_dia_higiene}
                            onChange={(e) => handleInputChange('vezes_dia_higiene', e.target.value)}
                            className="glass-input text-white placeholder-white/60"
                            placeholder="Número de vezes"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <CampoSimNao
                            label="Já tomou anestesia?"
                            value={formData.tomou_anestesia}
                            onChange={(value) => handleInputChange('tomou_anestesia', value)}
                          />
                          <CampoSimNao
                            label="A gengiva sangra com facilidade?"
                            value={formData.gengiva_sangra}
                            onChange={(value) => handleInputChange('gengiva_sangra', value)}
                          />
                          <CampoSimNao
                            label="Já realizou extrações dentárias?"
                            value={formData.extracoes_dentarias}
                            onChange={(value) => handleInputChange('extracoes_dentarias', value)}
                          />
                        </div>
                        <div className="space-y-4">
                          <CampoSimNao
                            label="Escova a língua?"
                            value={formData.escova_lingua}
                            onChange={(value) => handleInputChange('escova_lingua', value)}
                          />
                          <CampoSimNao
                            label="Usa fio dental?"
                            value={formData.usa_fio_dental}
                            onChange={(value) => handleInputChange('usa_fio_dental', value)}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Mapa Dental */}
              <TabsContent value="mapa-dental">
                <div className="space-y-6">
                  <MapaDentalAvancado
                    selectedTeeth={formData.mapa_dental}
                    onTeethChange={handleTeethChange}
                    observations={formData.observacoes_dentais}
                    onObservationsChange={handleObservationsChange}
                  />
                  
                  <Card className="glass-card rounded-2xl border-white/20">
                    <CardHeader>
                      <CardTitle className="text-white">Informações Adicionais</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-white font-medium text-sm mb-2 block">
                          Hábitos alimentares
                        </label>
                        <Textarea
                          value={formData.alimentacao_notas}
                          onChange={(e) => handleInputChange('alimentacao_notas', e.target.value)}
                          className="glass-input text-white placeholder-white/60 h-24 resize-none"
                          placeholder="Hábitos alimentares, preferências, restrições..."
                        />
                      </div>
                      <div>
                        <label className="text-white font-medium text-sm mb-2 block">
                          Informações complementares
                        </label>
                        <Textarea
                          value={formData.informacoes_adicionais}
                          onChange={(e) => handleInputChange('informacoes_adicionais', e.target.value)}
                          className="glass-input text-white placeholder-white/60 h-24 resize-none"
                          placeholder="Qualquer informação adicional importante..."
                        />
                      </div>
                      <div>
                        <label className="text-white font-medium text-sm mb-2 block">
                          Nome do Responsável
                        </label>
                        <Input
                          value={formData.responsavel_nome}
                          onChange={(e) => handleInputChange('responsavel_nome', e.target.value)}
                          className="glass-input text-white placeholder-white/60"
                          placeholder="Nome completo do responsável"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Histórico */}
              <TabsContent value="historico">
                <HistoricoConsultas
                  consultas={consultas}
                  onAddConsulta={handleAddConsulta}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="fixed bottom-6 right-6 flex space-x-3">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="glass-button px-6 py-3 text-white hover:bg-emerald-500/30 shadow-lg"
          >
            {saving ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
            ) : (
              <Save className="w-5 h-5 mr-2" />
            )}
            {saving ? 'Salvando...' : 'Salvar'}
          </Button>
          
          <Button
            onClick={handleExportPDF}
            className="glass-button px-6 py-3 text-white hover:bg-blue-500/30 shadow-lg"
          >
            <Download className="w-5 h-5 mr-2" />
            Exportar PDF
          </Button>
        </div>
      </div>

      <style jsx>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .glass-input {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
        
        .glass-input:focus {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(16, 185, 129, 0.5);
        }
        
        .glass-button {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .floating-particles {
          position: absolute;
          width: 100%;
          height: 100%;
          overflow: hidden;
          pointer-events: none;
        }
        
        .particle {
          position: absolute;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          animation: float 6s ease-in-out infinite;
        }
        
        .particle:nth-child(1) {
          width: 20px;
          height: 20px;
          left: 10%;
          animation-delay: 0s;
        }
        
        .particle:nth-child(2) {
          width: 15px;
          height: 15px;
          left: 20%;
          animation-delay: 2s;
        }
        
        .particle:nth-child(3) {
          width: 25px;
          height: 25px;
          left: 70%;
          animation-delay: 4s;
        }
        
        .particle:nth-child(4) {
          width: 18px;
          height: 18px;
          left: 80%;
          animation-delay: 1s;
        }
        
        .particle:nth-child(5) {
          width: 12px;
          height: 12px;
          left: 90%;
          animation-delay: 3s;
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default OdontogramaUpdated;