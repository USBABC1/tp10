import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const PDFExporter = {
  generatePDF: async (formData, odontogramaRef) => {
    try {
      console.log('Iniciando geração de PDF...', formData);
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 15;
      const contentWidth = pageWidth - (margin * 2);
      
      let yPosition = margin;

      // Função para adicionar header
      const addHeader = () => {
        // Logo (simulado com retângulo)
        pdf.setFillColor(5, 150, 105);
        pdf.rect(margin, yPosition, 30, 20, 'F');
        
        // Título
        pdf.setFontSize(20);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(5, 150, 105);
        pdf.text('TIO PAULO', margin + 35, yPosition + 8);
        
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'normal');
        pdf.text('Ficha de Anamnese Odontológica', margin + 35, yPosition + 15);
        
        // Linha divisória
        pdf.setDrawColor(5, 150, 105);
        pdf.setLineWidth(0.5);
        pdf.line(margin, yPosition + 25, pageWidth - margin, yPosition + 25);
        
        return yPosition + 35;
      };

      // Função para adicionar rodapé
      const addFooter = (pageNum) => {
        const footerY = pageHeight - 20;
        
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(100, 100, 100);
        
        // Data de geração
        const today = new Date().toLocaleDateString('pt-BR');
        pdf.text(`Gerado em: ${today}`, margin, footerY);
        
        // Número da página
        pdf.text(`Página ${pageNum}`, pageWidth - margin - 20, footerY);
        
        // Linha divisória
        pdf.setDrawColor(200, 200, 200);
        pdf.setLineWidth(0.3);
        pdf.line(margin, footerY - 5, pageWidth - margin, footerY - 5);
      };

      // Função para verificar se precisa de nova página
      const checkNewPage = (requiredHeight) => {
        if (yPosition + requiredHeight > pageHeight - 30) {
          addFooter(pdf.internal.getNumberOfPages());
          pdf.addPage();
          yPosition = addHeader();
        }
      };

      // Função para adicionar seção
      const addSection = (title, content, isGrid = false) => {
        checkNewPage(30);
        
        // Título da seção
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(5, 150, 105);
        pdf.text(title, margin, yPosition);
        yPosition += 8;
        
        // Linha sob o título
        pdf.setDrawColor(5, 150, 105);
        pdf.setLineWidth(0.3);
        pdf.line(margin, yPosition, margin + 60, yPosition);
        yPosition += 8;
        
        // Conteúdo
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(0, 0, 0);
        
        if (isGrid) {
          // Layout em grid para dados pessoais
          const colWidth = contentWidth / 2;
          let col = 0;
          let startY = yPosition;
          
          content.forEach((item, index) => {
            if (item.value) {
              const x = margin + (col * colWidth);
              const y = startY + (Math.floor(index / 2) * 12);
              
              pdf.setFont('helvetica', 'bold');
              pdf.text(`${item.label}:`, x, y);
              pdf.setFont('helvetica', 'normal');
              pdf.text(String(item.value), x, y + 4);
              
              col = col === 0 ? 1 : 0;
            }
          });
          
          yPosition = startY + (Math.ceil(content.filter(item => item.value).length / 2) * 12) + 5;
        } else {
          // Layout normal
          content.forEach(item => {
            if (item.value) {
              checkNewPage(15);
              
              pdf.setFont('helvetica', 'bold');
              pdf.text(`${item.label}:`, margin, yPosition);
              pdf.setFont('helvetica', 'normal');
              
              const lines = pdf.splitTextToSize(String(item.value), contentWidth - 40);
              pdf.text(lines, margin + 40, yPosition);
              yPosition += lines.length * 4 + 3;
            }
          });
        }
        
        yPosition += 10;
      };

      // Página 1 - Header
      yPosition = addHeader();

      // Dados Pessoais
      addSection('DADOS PESSOAIS', [
        { label: 'Nome da Criança', value: formData.nome_crianca || '' },
        { label: 'Data de Nascimento', value: formData.data_nascimento || '' },
        { label: 'Idade', value: formData.idade || '' },
        { label: 'Celular', value: formData.cel || '' },
        { label: 'Endereço', value: formData.endereco || '' },
        { label: 'Bairro', value: formData.bairro || '' },
        { label: 'CEP', value: formData.cep || '' },
        { label: 'Cidade', value: formData.cidade || '' }
      ], true);

      // Dados dos Pais
      addSection('DADOS DOS PAIS', [
        { label: 'Nome da Mãe', value: formData.nome_mae || '' },
        { label: 'Idade da Mãe', value: formData.idade_mae || '' },
        { label: 'Profissão da Mãe', value: formData.profissao_mae || '' },
        { label: 'Nome do Pai', value: formData.nome_pai || '' },
        { label: 'Idade do Pai', value: formData.idade_pai || '' },
        { label: 'Profissão do Pai', value: formData.profissao_pai || '' }
      ], true);

      // Motivo da Consulta
      addSection('MOTIVO DA CONSULTA', [
        { label: 'Motivo da consulta', value: formData.motivo_consulta || '' },
        { label: 'Alterações durante a gestação', value: formData.alteracao_gestacao || '' }
      ]);

      // Nova página para necessidades especiais
      checkNewPage(50);

      // Necessidades Especiais
      const necessidadesContent = [
        { label: 'Necessidade especial', value: formData.necessidade_especial === true ? 'Sim' : formData.necessidade_especial === false ? 'Não' : '' },
        { label: 'Qual necessidade', value: formData.qual_necessidade || '' },
        { label: 'Comprometimento de coordenação', value: formData.comprometimento_coordenacao === true ? 'Sim' : formData.comprometimento_coordenacao === false ? 'Não' : '' },
        { label: 'Qual comprometimento', value: formData.qual_coordenacao || '' },
        { label: 'Comprometimento visual', value: formData.comprometimento_visual === true ? 'Sim' : formData.comprometimento_visual === false ? 'Não' : '' },
        { label: 'Qual comprometimento visual', value: formData.qual_visual || '' },
        { label: 'Comprometimento de comunicação', value: formData.comprometimento_comunicacao === true ? 'Sim' : formData.comprometimento_comunicacao === false ? 'Não' : '' },
        { label: 'Qual comprometimento comunicação', value: formData.qual_comunicacao || '' },
        { label: 'Reação quando contrariado', value: formData.reacao_contrariado || '' },
        { label: 'Reação com profissionais', value: formData.reacao_profissionais || '' }
      ];
      
      addSection('NECESSIDADES ESPECIAIS', necessidadesContent);

      // Histórico Médico
      const historicoMedico = [
        { label: 'Sofreu cirurgia', value: formData.sofreu_cirurgia === true ? 'Sim' : formData.sofreu_cirurgia === false ? 'Não' : '' },
        { label: 'Qual cirurgia', value: formData.qual_cirurgia || '' },
        { label: 'Alterações sanguíneas', value: formData.alteracoes_sanguineas === true ? 'Sim' : formData.alteracoes_sanguineas === false ? 'Não' : '' },
        { label: 'Problemas respiratórios', value: formData.problemas_respiratorios === true ? 'Sim' : formData.problemas_respiratorios === false ? 'Não' : '' },
        { label: 'Problemas hepáticos', value: formData.problemas_hepaticos === true ? 'Sim' : formData.problemas_hepaticos === false ? 'Não' : '' },
        { label: 'Cardiopatias', value: formData.cardiopatias === true ? 'Sim' : formData.cardiopatias === false ? 'Não' : '' },
        { label: 'Problemas gástricos', value: formData.problemas_gastricos === true ? 'Sim' : formData.problemas_gastricos === false ? 'Não' : '' },
        { label: 'Alergias a medicamentos', value: formData.alergias_medicamento || '' },
        { label: 'Alergias alimentares', value: formData.alergias_alimentar || '' },
        { label: 'Alergias respiratórias', value: formData.alergias_respiratoria || '' },
        { label: 'Tratamentos atuais', value: formData.tratamentos_atuais || '' }
      ];
      
      addSection('HISTÓRICO MÉDICO', historicoMedico);

      // Nova página para hábitos
      checkNewPage(50);

      // Hábitos
      const habitos = [
        { label: 'Mama no peito', value: formData.mama_peito === true ? 'Sim' : formData.mama_peito === false ? 'Não' : '' },
        { label: 'Já mamou no peito', value: formData.mamou_peito === true ? 'Sim' : formData.mamou_peito === false ? 'Não' : '' },
        { label: 'Até quando mamou', value: formData.ate_quando_mamou || '' },
        { label: 'Toma mamadeira', value: formData.toma_mamadeira === true ? 'Sim' : formData.toma_mamadeira === false ? 'Não' : '' },
        { label: 'Já tomou mamadeira', value: formData.tomou_mamadeira === true ? 'Sim' : formData.tomou_mamadeira === false ? 'Não' : '' },
        { label: 'Até quando mamadeira', value: formData.ate_quando_mamadeira || '' },
        { label: 'Engasga ou vomita', value: formData.engasga_vomita || '' },
        { label: 'Chupa dedo', value: formData.chupa_dedo || '' },
        { label: 'Chupa chupeta', value: formData.chupa_chupeta || '' },
        { label: 'Outros hábitos', value: formData.outros_habitos || '' },
        { label: 'Range os dentes', value: formData.range_dentes || '' }
      ];
      
      addSection('HÁBITOS', habitos);

      // Higiene Bucal
      const higieneBucal = [
        { label: 'Escova que usa', value: formData.escova_usa || '' },
        { label: 'Creme dental', value: formData.creme_dental || '' },
        { label: 'Quem faz higiene bucal', value: formData.higiene_bucal || '' },
        { label: 'Vezes por dia', value: formData.vezes_dia_higiene || '' },
        { label: 'Já tomou anestesia', value: formData.tomou_anestesia === true ? 'Sim' : formData.tomou_anestesia === false ? 'Não' : '' },
        { label: 'Gengiva sangra', value: formData.gengiva_sangra === true ? 'Sim' : formData.gengiva_sangra === false ? 'Não' : '' },
        { label: 'Extrações dentárias', value: formData.extracoes_dentarias === true ? 'Sim' : formData.extracoes_dentarias === false ? 'Não' : '' },
        { label: 'Escova a língua', value: formData.escova_lingua === true ? 'Sim' : formData.escova_lingua === false ? 'Não' : '' },
        { label: 'Usa fio dental', value: formData.usa_fio_dental === true ? 'Sim' : formData.usa_fio_dental === false ? 'Não' : '' }
      ];
      
      addSection('HIGIENE BUCAL', higieneBucal);

      // Mapa Dental
      if (formData.mapa_dental && formData.mapa_dental.length > 0) {
        checkNewPage(30);
        
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(5, 150, 105);
        pdf.text('MAPA DENTAL', margin, yPosition);
        yPosition += 15;
        
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(0, 0, 0);
        pdf.text('Dentes com alterações:', margin, yPosition);
        yPosition += 8;
        
        const dentesTexto = formData.mapa_dental.sort((a, b) => a - b).join(', ');
        const lines = pdf.splitTextToSize(dentesTexto, contentWidth);
        pdf.text(lines, margin, yPosition);
        yPosition += lines.length * 4 + 10;
      }

      // Informações Adicionais
      if (formData.alimentacao_notas || formData.informacoes_adicionais) {
        addSection('INFORMAÇÕES ADICIONAIS', [
          { label: 'Alimentação', value: formData.alimentacao_notas || '' },
          { label: 'Outras informações', value: formData.informacoes_adicionais || '' }
        ]);
      }

      // Responsável
      checkNewPage(30);
      addSection('RESPONSÁVEL', [
        { label: 'Nome do Responsável', value: formData.responsavel_nome || '' },
        { label: 'Data', value: new Date().toLocaleDateString('pt-BR') }
      ]);

      // Adicionar rodapé na última página
      addFooter(pdf.internal.getNumberOfPages());

      // Salvar o PDF
      const fileName = `ficha_anamnese_${(formData.nome_crianca || 'paciente').replace(/\s+/g, '_')}_${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.pdf`;
      
      console.log('PDF gerado com sucesso:', fileName);
      pdf.save(fileName);
      
      return true;

    } catch (error) {
      console.error('Erro detalhado ao gerar PDF:', error);
      throw new Error(`Erro ao gerar PDF: ${error.message}`);
    }
  }
};

export default PDFExporter;

