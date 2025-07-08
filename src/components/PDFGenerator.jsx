import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import logoImg from '../assets/logo.png';
import bgImg from '../assets/bg.png';

const PDFGenerator = {
  generatePDF: async (patientData, teethStatus, odontogramaRef) => {
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = 210;
      const pageHeight = 297;

      // Função para carregar imagem
      const loadImage = (src) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = src;
        });
      };

      // Carregar imagens
      const logo = await loadImage(logoImg);
      const bg = await loadImage(bgImg);

      // Página 1 - Dados Pessoais e Anamnese
      pdf.addImage(bg, 'PNG', 0, 0, pageWidth, pageHeight);
      pdf.addImage(logo, 'PNG', 15, 15, 180, 40);

      // Título
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(255, 255, 255);
      pdf.text('FICHA DE ANAMNESE', pageWidth/2, 70, { align: 'center' });

      // Dados Pessoais
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(255, 255, 255);
      pdf.text('DADOS PESSOAIS', 15, 85);

      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      let yPos = 95;

      const personalFields = [
        { label: 'Nome da Criança:', value: patientData.nome || '' },
        { label: 'Data de Nascimento:', value: patientData.dataNascimento || '' },
        { label: 'Idade:', value: patientData.idade || '' },
        { label: 'Celular:', value: patientData.cel || '' },
        { label: 'Endereço:', value: patientData.endereco || '' },
        { label: 'Bairro:', value: patientData.bairro || '' },
        { label: 'CEP:', value: patientData.cep || '' },
        { label: 'Cidade:', value: patientData.cidade || '' }
      ];

      personalFields.forEach((field, index) => {
        if (index % 2 === 0) {
          pdf.text(`${field.label} ${field.value}`, 15, yPos);
        } else {
          pdf.text(`${field.label} ${field.value}`, 110, yPos);
          yPos += 8;
        }
      });

      // Dados dos Pais
      yPos += 10;
      pdf.setFont('helvetica', 'bold');
      pdf.text('DADOS DOS PAIS', 15, yPos);
      yPos += 10;

      pdf.setFont('helvetica', 'normal');
      const parentFields = [
        { label: 'Nome da Mãe:', value: patientData.nomeMae || '' },
        { label: 'Idade:', value: patientData.idadeMae || '' },
        { label: 'Profissão:', value: patientData.profissaoMae || '' },
        { label: 'Nome do Pai:', value: patientData.nomePai || '' },
        { label: 'Idade:', value: patientData.idadePai || '' },
        { label: 'Profissão:', value: patientData.profissaoPai || '' }
      ];

      parentFields.forEach((field, index) => {
        if (index < 3) {
          pdf.text(`${field.label} ${field.value}`, 15, yPos + (index * 8));
        } else {
          pdf.text(`${field.label} ${field.value}`, 110, yPos + ((index - 3) * 8));
        }
      });

      yPos += 35;

      // Motivo da Consulta
      pdf.setFont('helvetica', 'bold');
      pdf.text('MOTIVO DA CONSULTA', 15, yPos);
      yPos += 8;
      pdf.setFont('helvetica', 'normal');
      const motivoLines = pdf.splitTextToSize(patientData.motivoConsulta || '', 180);
      pdf.text(motivoLines, 15, yPos);
      yPos += motivoLines.length * 5 + 10;

      // Alterações na Gestação
      pdf.setFont('helvetica', 'bold');
      pdf.text('ALTERAÇÕES DURANTE A GESTAÇÃO', 15, yPos);
      yPos += 8;
      pdf.setFont('helvetica', 'normal');
      const gestacaoLines = pdf.splitTextToSize(patientData.alteracaoGestacao || '', 180);
      pdf.text(gestacaoLines, 15, yPos);

      // Página 2 - Necessidades Especiais e Histórico Médico
      pdf.addPage();
      pdf.addImage(bg, 'PNG', 0, 0, pageWidth, pageHeight);

      yPos = 20;
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(255, 255, 255);
      pdf.text('NECESSIDADES ESPECIAIS', 15, yPos);

      yPos += 15;
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');

      const specialNeedsFields = [
        { label: 'Possui necessidade especial?', value: patientData.necessidadeEspecial || '' },
        { label: 'Qual?', value: patientData.qualNecessidadeEspecial || '' },
        { label: 'Comprometimento de coordenação motora?', value: patientData.comprometimentoCoordenacaoMotora || '' },
        { label: 'Qual?', value: patientData.qualComprometimentoCoordenacaoMotora || '' },
        { label: 'Comprometimento visual?', value: patientData.comprometimentoVisual || '' },
        { label: 'Qual?', value: patientData.qualComprometimentoVisual || '' },
        { label: 'Comprometimento de comunicação?', value: patientData.comprometimentoComunicacao || '' },
        { label: 'Qual?', value: patientData.qualComprometimentoComunicacao || '' }
      ];

      specialNeedsFields.forEach(field => {
        pdf.text(`${field.label} ${field.value}`, 15, yPos);
        yPos += 6;
      });

      yPos += 10;
      pdf.setFont('helvetica', 'bold');
      pdf.text('HISTÓRICO MÉDICO', 15, yPos);
      yPos += 10;

      pdf.setFont('helvetica', 'normal');
      const medicalFields = [
        { label: 'Sofreu alguma cirurgia?', value: patientData.sofreuCirurgia || '' },
        { label: 'Qual?', value: patientData.qualCirurgia || '' },
        { label: 'Alterações sanguíneas?', value: patientData.alteracoesSanguineas || '' },
        { label: 'Problemas respiratórios?', value: patientData.problemasRespiratorios || '' },
        { label: 'Problemas hepáticos?', value: patientData.problemasHepaticos || '' },
        { label: 'Cardiopatias?', value: patientData.cardiopatias || '' },
        { label: 'Problemas gástricos?', value: patientData.problemasGastricos || '' },
        { label: 'Alergias a medicamentos:', value: patientData.alergiasMedicamento || '' },
        { label: 'Alergias alimentares:', value: patientData.alergiasAlimentar || '' },
        { label: 'Alergias respiratórias:', value: patientData.alergiasRespiratoria || '' }
      ];

      medicalFields.forEach(field => {
        pdf.text(`${field.label} ${field.value}`, 15, yPos);
        yPos += 6;
      });

      yPos += 10;
      pdf.setFont('helvetica', 'bold');
      pdf.text('ACOMPANHAMENTOS', 15, yPos);
      yPos += 10;

      pdf.setFont('helvetica', 'normal');
      const treatmentFields = [
        { label: 'Fonoaudiologia?', value: patientData.fonaudiologia || '' },
        { label: 'Fisioterapia?', value: patientData.fisioterapia || '' },
        { label: 'Psicologia?', value: patientData.psicologia || '' },
        { label: 'Psiquiátrico?', value: patientData.psiquiatrico || '' },
        { label: 'TO?', value: patientData.to || '' },
        { label: 'Outro tratamento:', value: patientData.outroTratamento || '' },
        { label: 'Portador de IST?', value: patientData.portadorIST || '' }
      ];

      treatmentFields.forEach(field => {
        pdf.text(`${field.label} ${field.value}`, 15, yPos);
        yPos += 6;
      });

      // Página 3 - Hábitos e Higiene Bucal
      pdf.addPage();
      pdf.addImage(bg, 'PNG', 0, 0, pageWidth, pageHeight);

      yPos = 20;
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(255, 255, 255);
      pdf.text('HÁBITOS', 15, yPos);

      yPos += 15;
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');

      const habitsFields = [
        { label: 'Paciente mama no peito?', value: patientData.pacienteMamaNoPeito || '' },
        { label: 'Já mamou no peito?', value: patientData.jaMamouNoPeito || '' },
        { label: 'Até quando?', value: patientData.ateQuandoMama || '' },
        { label: 'Paciente toma mamadeira?', value: patientData.pacienteTomaMamadeira || '' },
        { label: 'Já tomou mamadeira?', value: patientData.jaTomouMamadeira || '' },
        { label: 'Até quando?', value: patientData.ateQuandoMamadeira || '' },
        { label: 'Engasga ou vomita com facilidade?', value: patientData.engasgaVomita || '' },
        { label: 'Chupa o dedo?', value: patientData.chupaDedo || '' },
        { label: 'Chupa chupeta?', value: patientData.chupaChupeta || '' },
        { label: 'Outros hábitos?', value: patientData.outrosHabitos || '' },
        { label: 'Range os dentes?', value: patientData.rangeDentes || '' }
      ];

      habitsFields.forEach(field => {
        pdf.text(`${field.label} ${field.value}`, 15, yPos);
        yPos += 6;
      });

      yPos += 10;
      pdf.setFont('helvetica', 'bold');
      pdf.text('HISTÓRICO ODONTOLÓGICO', 15, yPos);
      yPos += 10;

      pdf.setFont('helvetica', 'normal');
      const dentalHistoryFields = [
        { label: 'Quantos anos na primeira consulta?', value: patientData.primeiraConsultaAnos || '' },
        { label: 'Como foi o tratamento anterior?', value: patientData.tratamentoAnterior || '' },
        { label: 'Já foi ao dentista?', value: patientData.jaFoiDentista || '' },
        { label: 'Qual?', value: patientData.qualDentista || '' }
      ];

      dentalHistoryFields.forEach(field => {
        pdf.text(`${field.label} ${field.value}`, 15, yPos);
        yPos += 6;
      });

      yPos += 10;
      pdf.setFont('helvetica', 'bold');
      pdf.text('HIGIENE BUCAL', 15, yPos);
      yPos += 10;

      pdf.setFont('helvetica', 'normal');
      const hygieneFields = [
        { label: 'Qual escova usa?', value: patientData.qualEscova || '' },
        { label: 'Qual creme dental usa?', value: patientData.qualCremeDental || '' },
        { label: 'Quem faz a higiene bucal?', value: patientData.higieneBucal || '' },
        { label: 'Quantas vezes ao dia?', value: patientData.quantasVezesAoDia || '' },
        { label: 'Já tomou anestesia?', value: patientData.tomouAnestesia || '' },
        { label: 'Gengiva sangra com facilidade?', value: patientData.gengivaSangra || '' },
        { label: 'Já realizou extrações dentárias?', value: patientData.realizouExtracoes || '' },
        { label: 'Escova a língua?', value: patientData.escovaLingua || '' },
        { label: 'Usa fio dental?', value: patientData.usaFioDental || '' }
      ];

      hygieneFields.forEach(field => {
        pdf.text(`${field.label} ${field.value}`, 15, yPos);
        yPos += 6;
      });

      // Página 4 - Odontograma e Informações Finais
      pdf.addPage();
      pdf.addImage(bg, 'PNG', 0, 0, pageWidth, pageHeight);

      yPos = 20;
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(255, 255, 255);
      pdf.text('ODONTOGRAMA', 15, yPos);

      yPos += 20;

      // Desenhar odontograma
      const drawTooth = (x, y, number, isSelected) => {
        pdf.setFillColor(isSelected ? 255 : 200, isSelected ? 0 : 200, isSelected ? 0 : 255);
        pdf.rect(x, y, 8, 8, 'F');
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(8);
        pdf.text(number.toString(), x + 2, y + 5);
      };

      // Dentes superiores permanentes
      const upperTeeth = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28];
      upperTeeth.forEach((tooth, index) => {
        drawTooth(15 + (index * 10), yPos, tooth, teethStatus[tooth]);
      });

      yPos += 15;

      // Dentes superiores decíduos
      const upperChildTeeth = [55, 54, 53, 52, 51, 61, 62, 63, 64, 65];
      upperChildTeeth.forEach((tooth, index) => {
        drawTooth(65 + (index * 10), yPos, tooth, teethStatus[tooth]);
      });

      yPos += 20;

      // Dentes inferiores decíduos
      const lowerChildTeeth = [85, 84, 83, 82, 81, 71, 72, 73, 74, 75];
      lowerChildTeeth.forEach((tooth, index) => {
        drawTooth(65 + (index * 10), yPos, tooth, teethStatus[tooth]);
      });

      yPos += 15;

      // Dentes inferiores permanentes
      const lowerTeeth = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38];
      lowerTeeth.forEach((tooth, index) => {
        drawTooth(15 + (index * 10), yPos, tooth, teethStatus[tooth]);
      });

      yPos += 30;

      // Alimentação
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('ALIMENTAÇÃO', 15, yPos);
      yPos += 10;
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      const alimentacaoLines = pdf.splitTextToSize(patientData.alimentacao || '', 180);
      pdf.text(alimentacaoLines, 15, yPos);
      yPos += alimentacaoLines.length * 5 + 15;

      // Informações Adicionais
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('INFORMAÇÕES ADICIONAIS', 15, yPos);
      yPos += 10;
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      const infoLines = pdf.splitTextToSize(patientData.informacaoAdicional || '', 180);
      pdf.text(infoLines, 15, yPos);
      yPos += infoLines.length * 5 + 15;

      // Responsável
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('RESPONSÁVEL', 15, yPos);
      yPos += 10;
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Nome: ${patientData.responsavel || ''}`, 15, yPos);
      yPos += 8;
      pdf.text(`Data: ${patientData.data || ''}`, 15, yPos);

      // Salvar PDF
      const fileName = `ficha_anamnese_${patientData.nome || 'paciente'}_${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.pdf`;
      pdf.save(fileName);

    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar PDF. Tente novamente.');
    }
  }
};

export default PDFGenerator;

