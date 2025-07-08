import jsPDF from 'jspdf';
import logoImg from '../assets/logo.png';
import bgImg from '../assets/bg.png';

const PDFExporter = {
  generatePDF: async (formData) => {
    try {
      console.log('Iniciando geração de PDF profissional...', formData);
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 15;
      const contentWidth = pageWidth - (margin * 2);
      
      let yPosition = margin;
      let pageNumber = 1;

      // Função para adicionar header profissional
      const addHeader = () => {
        // Background do header
        pdf.addImage(bgImg, 'PNG', 0, 0, pageWidth, pageHeight);
        
        // Logo
        pdf.addImage(logoImg, 'PNG', margin, 8, 40, 20);
        
        // Título principal
        pdf.setFontSize(24);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(255, 255, 255);
        pdf.text('FICHA DE ANAMNESE ODONTOLÓGICA', margin + 45, 20);
        
        return 45;
      };

      // Função para adicionar rodapé
      const addFooter = (pageNum) => {
        const footerY = pageHeight - 15;
        
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
        if (yPosition + requiredHeight > pageHeight - 25) {
          addFooter(pageNumber);
          pdf.addPage();
          pageNumber++;
          yPosition = addHeader();
        }
      };

      // Função para adicionar seção com estilo
      const addSection = (title, content, isGrid = false) => {
        checkNewPage(40);
        
        // Background da seção
        pdf.setFillColor(245, 245, 245);
        pdf.rect(margin, yPosition - 2, contentWidth, 8, 'F');
        
        // Título da seção
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(5, 150, 105);
        pdf.text(title, margin + 2, yPosition + 4);
        yPosition += 12;
        
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
              const y = startY + (Math.floor(index / 2) * 8);
              
              pdf.setFont('helvetica', 'bold');
              pdf.text(`${item.label}:`, x, y);
              pdf.setFont('helvetica', 'normal');
              
              // Quebrar texto longo
              const maxWidth = colWidth - 40;
              const lines = pdf.splitTextToSize(String(item.value), maxWidth);
              pdf.text(lines, x, y + 3);
              
              col = col === 0 ? 1 : 0;
            }
          });
          
          yPosition = startY + (Math.ceil(content.filter(item => item.value).length / 2) * 8) + 5;
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
              yPosition += Math.max(lines.length * 4, 6);
            }
          });
        }
        
        yPosition += 8;
      };

      // Função para adicionar mapa dental visual
      const addMapaDental = () => {
        if (!formData.mapa_dental || formData.mapa_dental.length === 0) return;
        
        checkNewPage(100);
        
        // Título
        pdf.setFillColor(245, 245, 245);
        pdf.rect(margin, yPosition - 2, contentWidth, 8, 'F');
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.setTextColor(5, 150, 105);
        pdf.text('MAPA DENTAL', margin + 2, yPosition + 4);
        yPosition += 15;
        
        // Adicionar imagem do odontograma como base
        const odontogramaBase = new Image();
        odontogramaBase.src = '/home/ubuntu/upload/ODONTOGRAME.jpg'; // Caminho para a imagem do odontograma
        pdf.addImage(odontogramaBase, 'JPEG', margin, yPosition, contentWidth, contentWidth * (odontogramaBase.height / odontogramaBase.width));
        const odontogramaImageHeight = contentWidth * (odontogramaBase.height / odontogramaBase.width);

        // Mapeamento de posições aproximadas para cada dente e superfície na imagem ODONTOGRAME.jpg
        // Estes valores são aproximados e podem precisar de ajuste fino
        const toothPositions = {
          // Dentes permanentes superiores
          18: { x: 16, y: 15, surfaces: { oclusal: { dx: 2, dy: 2 }, mesial: { dx: 0, dy: 4 }, distal: { dx: 4, dy: 4 }, vestibular: { dx: 2, dy: 0 }, lingual: { dx: 2, dy: 4 } } },
          17: { x: 22, y: 15, surfaces: { oclusal: { dx: 2, dy: 2 }, mesial: { dx: 0, dy: 4 }, distal: { dx: 4, dy: 4 }, vestibular: { dx: 2, dy: 0 }, lingual: { dx: 2, dy: 4 } } },
          16: { x: 28, y: 15, surfaces: { oclusal: { dx: 2, dy: 2 }, mesial: { dx: 0, dy: 4 }, distal: { dx: 4, dy: 4 }, vestibular: { dx: 2, dy: 0 }, lingual: { dx: 2, dy: 4 } } },
          15: { x: 34, y: 15, surfaces: { oclusal: { dx: 2, dy: 2 }, mesial: { dx: 0, dy: 4 }, distal: { dx: 4, dy: 4 }, vestibular: { dx: 2, dy: 0 }, lingual: { dx: 2, dy: 4 } } },
          14: { x: 40, y: 15, surfaces: { oclusal: { dx: 2, dy: 2 }, mesial: { dx: 0, dy: 4 }, distal: { dx: 4, dy: 4 }, vestibular: { dx: 2, dy: 0 }, lingual: { dx: 2, dy: 4 } } },
          13: { x: 46, y: 15, surfaces: { oclusal: { dx: 2, dy: 2 }, mesial: { dx: 0, dy: 4 }, distal: { dx: 4, dy: 4 }, vestibular: { dx: 2, dy: 0 }, lingual: { dx: 2, dy: 4 } } },
          12: { x: 52, y: 15, surfaces: { oclusal: { dx: 2, dy: 2 }, mesial: { dx: 0, dy: 4 }, distal: { dx: 4, dy: 4 }, vestibular: { dx: 2, dy: 0 }, lingual: { dx: 2, dy: 4 } } },
          11: { x: 58, y: 15, surfaces: { oclusal: { dx: 2, dy: 2 }, mesial: { dx: 0, dy: 4 }, distal: { dx: 4, dy: 4 }, vestibular: { dx: 2, dy: 0 }, lingual: { dx: 2, dy: 4 } } },
          21: { x: 64, y: 15, surfaces: { oclusal: { dx: 2, dy: 2 }, mesial: { dx: 0, dy: 4 }, distal: { dx: 4, dy: 4 }, vestibular: { dx: 2, dy: 0 }, lingual: { dx: 2, dy: 4 } } },
          22: { x: 70, y: 15, surfaces: { oclusal: { dx: 2, dy: 2 }, mesial: { dx: 0, dy: 4 }, distal: { dx: 4, dy: 4 }, vestibular: { dx: 2, dy: 0 }, lingual: { dx: 2, dy: 4 } } },
          23: { x: 76, y: 15, surfaces: { oclusal: { dx: 2, dy: 2 }, mesial: { dx: 0, dy: 4 }, distal: { dx: 4, dy: 4 }, vestibular: { dx: 2, dy: 0 }, lingual: { dx: 2, dy: 4 } } },
          24: { x: 82, y: 15, surfaces: { oclusal: { dx: 2, dy: 2 }, mesial: { dx: 0, dy: 4 }, distal: { dx: 4, dy: 4 }, vestibular: { dx: 2, dy: 0 }, lingual: { dx: 2, dy: 4 } } },
          25: { x: 88, y: 15, surfaces: { oclusal: { dx: 2, dy: 2 }, mesial: { dx: 0, dy: 4 }, distal: { dx: 4, dy: 4 }, vestibular: { dx: 2, dy: 0 }, lingual: { dx: 2, dy: 4 } } },
          26: { x: 94, y: 15, surfaces: { oclusal: { dx: 2, dy: 2 }, mesial: { dx: 0, dy: 4 }, distal: { dx: 4, dy: 4 }, vestibular: { dx: 2, dy: 0 }, lingual: { dx: 2, dy: 4 } } },
          27: { x: 100, y: 15, surfaces: { oclusal: { dx: 2, dy: 2 }, mesial: { dx: 0, dy: 4 }, distal: { dx: 4, dy: 4 }, vestibular: { dx: 2, dy: 0 }, lingual: { dx: 2, dy: 4 } } },
          28: { x: 106, y: 15, surfaces: { oclusal: { dx: 2, dy: 2 }, mesial: { dx: 0, dy: 4 }, distal: { dx: 4, dy: 4 }, vestibular: { dx: 2, dy: 0 }, lingual: { dx: 2, dy: 4 } } },
          // Dentes decíduos superiores
          55: { x: 34, y: 35, surfaces: { oclusal: { dx: 2, dy: 2 }, mesial: { dx: 0, dy: 4 }, distal: { dx: 4, dy: 4 }, vestibular: { dx: 2, dy: 0 }, lingual: { dx: 2, dy: 4 } } },
          54: { x: 40, y: 35, surfaces: { oclusal: { dx: 2, dy: 2 }, mesial: { dx: 0, dy: 4 }, distal: { dx: 4, dy: 4 }, vestibular: { dx: 2, dy: 0 }, lingual: { dx: 2, dy: 4 } } },
          53: { x: 46, y: 35, surfaces: { oclusal: { dx: 2, dy: 2 }, mesial: { dx: 0, dy: 4 }, distal: { dx: 4, dy: 4 }, vestibular: { dx: 2, dy: 0 }, lingual: { dx: 2, dy: 4 } } },
          52: { x: 52, y: 35, surfaces: { oclusal: { dx: 2, dy: 2 }, mesial: { dx: 0, dy: 4 }, distal: { dx: 4, dy: 4 }, vestibular: { dx: 2, dy: 0 }, lingual: { dx: 2, dy: 4 } } },
          51: { x: 58, y: 35, surfaces: { oclusal: { dx: 2, dy: 2 }, mesial: { dx: 0, dy: 4 }, distal: { dx: 4, dy: 4 }, vestibular: { dx: 2, dy: 0 }, lingual: { dx: 2, dy: 4 } } },
          61: { x: 64, y: 35, surfaces: { oclusal: { dx: 2, dy: 2 }, mesial: { dx: 0, dy: 4 }, distal: { dx: 4, dy: 4 }, vestibular: { dx: 2, dy: 0 }, lingual: { dx: 2, dy: 4 } } },
          62: { x: 70, y: 35, surfaces: { oclusal: { dx: 2, dy: 2 }, mesial: { dx: 0, dy: 4 }, distal: { dx: 4, dy: 4 }, vestibular: { dx: 2, dy: 0 }, lingual: { dx: 2, dy: 4 } } },
          63: { x: 76, y: 35, surfaces: { oclusal: { dx: 2, dy: 2 }, mesial: { dx: 0, dy: 4 }, distal: { dx: 4, dy: 4 }, vestibular: { dx: 2, dy: 0 }, lingual: { dx: 2, dy: 4 } } },
          64: { x: 82, y: 35, surfaces: { oclusal: { dx: 2, dy: 2 }, mesial: { dx: 0, dy: 4 }, distal: { dx: 4, dy: 4 }, vestibular: { dx: 2, dy: 0 }, lingual: { dx: 2, dy: 4 } } },
          65: { x: 88, y: 35, surfaces: { oclusal: { dx: 2, dy: 2 }, mesial: { dx: 0, dy: 4 }, distal: { dx: 4, dy: 4 }, vestibular: { dx: 2, dy: 0 }, lingual: { dx: 2, dy: 4 } } },
          // Dentes decíduos inferiores
          85: { x: 34, y: 65, surfaces: { oclusal: { dx: 2, dy: 2 }, mesial: { dx: 0, dy: 4 }, distal: { dx: 4, dy: 4 }, vestibular: { dx: 2, dy: 0 }, lingual: { dx: 2, dy: 4 } } },
          84: { x: 40, y: 65, surfaces: { oclusal: { dx: 2, dy: 2 }, mesial: { dx: 0, dy: 4 }, distal: { dx: 4, dy: 4 }, vestibular: { dx: 2, dy: 0 }, lingual: { dx: 2, dy: 4 } } },
          83: { x: 46, y: 65, surfaces: { oclusal: { dx: 2, dy: 2 }, mesial: { dx: 0, dy: 4 }, distal: { dx: 4, dy: 4 }, vestibular: { dx: 2, dy: 0 }, lingual: { dx: 2, dy: 4 } } },
          82: { x: 52, y: 65, surfaces: { oclusal: { dx: 2, dy: 2 }, mesial: { dx: 0, dy: 4 }, distal: { dx: 4, dy: 4 }, vestibular: { dx: 2, dy: 0 }, lingual: { dx: 2, dy: 4 } } },
          81: { x: 58, y: 65, surfaces: { oclusal: { dx: 2, dy: 2 }, mesial: { dx: 0, dy: 4 }, distal: { dx: 4, dy: 4 }, vestibular: { dx: 2, dy: 0 }, lingual: { dx: 2, dy: 4 } } },
          71: { x: 64, y: 65, surfaces: { oclusal: { dx: 2, dy: 2 }, mesial: { dx: 0, dy: 4 }, distal: { dx: 4, dy: 4 }, vestibular: { dx: 2, dy: 0 }, lingual: { dx: 2, dy: 4 } } },
          72: { x: 70, y: 65, surfaces: { oclusal: { dx: 2, dy: 2 }, mesial: { dx: 0, dy: 4 }, distal: { dx: 4, dy: 4 }, vestibular: { dx: 2, dy: 0 }, lingual: { dx: 2, dy: 4 } } },
          73: { x: 76, y: 65, surfaces: { oclusal: { dx: 2, dy: 2 }, mesial: { dx: 0, dy: 4 }, distal: { dx: 4, dy: 4 }, vestibular: { dx: 2, dy: 0 }, lingual: { dx: 2, dy: 4 } } },
          74: { x: 82, y: 65, surfaces: { oclusal: { dx: 2, dy: 2 }, mesial: { dx: 0, dy: 4 }, distal: { dx: 4, dy: 4 }, vestibular: { dx: 2, dy: 0 }, lingual: { dx: 2, dy: 4 } } },
          75: { x: 88, y: 65, surfaces: { oclusal: { dx: 2, dy: 2 }, mesial: { dx: 0, dy: 4 }, distal: { dx: 4, dy: 4 }, vestibular: { dx: 2, dy: 0 }, lingual: { dx: 2, dy: 4 } } },
          // Dentes permanentes inferiores
          48: { x: 16, y: 85, surfaces: { oclusal: { dx: 2, dy: 2 }, mesial: { dx: 0, dy: 4 }, distal: { dx: 4, dy: 4 }, vestibular: { dx: 2, dy: 0 }, lingual: { dx: 2, dy: 4 } } },
          47: { x: 22, y: 85, surfaces: { oclusal: { dx: 2, dy: 2 }, mesial: { dx: 0, dy: 4 }, distal: { dx: 4, dy: 4 }, vestibular: { dx: 2, dy: 0 }, lingual: { dx: 2, dy: 4 } } },
          46: { x: 28, y: 85, surfaces: { oclusal: { dx: 2, dy: 2 }, mesial: { dx: 0, dy: 4 }, distal: { dx: 4, dy: 4 }, vestibular: { dx: 2, dy: 0 }, lingual: { dx: 2, dy: 4 } } },
          45: { x: 34, y: 85, surfaces: { oclusal: { dx: 2, dy: 2 }, mesial: { dx: 0, dy: 4 }, distal: { dx: 4, dy: 4 }, vestibular: { dx: 2, dy: 0 }, lingual: { dx: 2, dy: 4 } } },
          44: { x: 40, y: 85, surfaces: { oclusal: { dx: 2, dy: 2 }, mesial: { dx: 0, dy: 4 }, distal: { dx: 4, dy: 4 }, vestibular: { dx: 2, dy: 0 }, lingual: { dx: 2, dy: 4 } } },
          43: { x: 46, y: 85, surfaces: { oclusal: { dx: 2, dy: 2 }, mesial: { dx: 0, dy: 4 }, distal: { dx: 4, dy: 4 }, vestibular: { dx: 2, dy: 0 }, lingual: { dx: 2, dy: 4 } } },
          42: { x: 52, y: 85, surfaces: { oclusal: { dx: 2, dy: 2 }, mesial: { dx: 0, dy: 4 }, distal: { dx: 4, dy: 4 }, vestibular: { dx: 2, dy: 0 }, lingual: { dx: 2, dy: 4 } } },
          41: { x: 58, y: 85, surfaces: { oclusal: { dx: 2, dy: 2 }, mesial: { dx: 0, dy: 4 }, distal: { dx: 4, dy: 4 }, vestibular: { dx: 2, dy: 0 }, lingual: { dx: 2, dy: 4 } } },
          31: { x: 64, y: 85, surfaces: { oclusal: { dx: 2, dy: 2 }, mesial: { dx: 0, dy: 4 }, distal: { dx: 4, dy: 4 }, vestibular: { dx: 2, dy: 0 }, lingual: { dx: 2, dy: 4 } } },
          32: { x: 70, y: 85, surfaces: { oclusal: { dx: 2, dy: 2 }, mesial: { dx: 0, dy: 4 }, distal: { dx: 4, dy: 4 }, vestibular: { dx: 2, dy: 0 }, lingual: { dx: 2, dy: 4 } } },
          33: { x: 76, y: 85, surfaces: { oclusal: { dx: 2, dy: 2 }, mesial: { dx: 0, dy: 4 }, distal: { dx: 4, dy: 4 }, vestibular: { dx: 2, dy: 0 }, lingual: { dx: 2, dy: 4 } } },
          34: { x: 82, y: 85, surfaces: { oclusal: { dx: 2, dy: 2 }, mesial: { dx: 0, dy: 4 }, distal: { dx: 4, dy: 4 }, vestibular: { dx: 2, dy: 0 }, lingual: { dx: 2, dy: 4 } } },
          35: { x: 88, y: 85, surfaces: { oclusal: { dx: 2, dy: 2 }, mesial: { dx: 0, dy: 4 }, distal: { dx: 4, dy: 4 }, vestibular: { dx: 2, dy: 0 }, lingual: { dx: 2, dy: 4 } } },
          36: { x: 94, y: 85, surfaces: { oclusal: { dx: 2, dy: 2 }, mesial: { dx: 0, dy: 4 }, distal: { dx: 4, dy: 4 }, vestibular: { dx: 2, dy: 0 }, lingual: { dx: 2, dy: 4 } } },
          37: { x: 100, y: 85, surfaces: { oclusal: { dx: 2, dy: 2 }, mesial: { dx: 0, dy: 4 }, distal: { dx: 4, dy: 4 }, vestibular: { dx: 2, dy: 0 }, lingual: { dx: 2, dy: 4 } } },
          38: { x: 106, y: 85, surfaces: { oclusal: { dx: 2, dy: 2 }, mesial: { dx: 0, dy: 4 }, distal: { dx: 4, dy: 4 }, vestibular: { dx: 2, dy: 0 }, lingual: { dx: 2, dy: 4 } } },
        };

        const condicoes = {
          carie: { color: [255, 0, 0], label: 'Cárie' },
          restauracao: { color: [0, 0, 255], label: 'Restauração' },
          extraido: { color: [64, 64, 64], label: 'Extraído' },
          tratamento: { color: [255, 255, 0], label: 'Em Tratamento' },
          coroa: { color: [128, 0, 128], label: 'Coroa' },
          implante: { color: [0, 128, 0], label: 'Implante' },
          ausente: { color: [128, 128, 128], label: 'Ausente' },
          fratura: { color: [255, 165, 0], label: 'Fratura' }
        };
        
        // Desenhar as condições nos dentes
        formData.mapa_dental.forEach(item => {
          const toothInfo = toothPositions[item.tooth];
          if (toothInfo && toothInfo.surfaces[item.surface]) {
            const conditionData = condicoes[item.condition];
            if (conditionData) {
              const rectX = margin + toothInfo.x + toothInfo.surfaces[item.surface].dx;
              const rectY = yPosition + toothInfo.y + toothInfo.surfaces[item.surface].dy;
              const rectSize = 2; // Tamanho do quadrado para a superfície

              pdf.setFillColor(...conditionData.color);
              pdf.rect(rectX, rectY, rectSize, rectSize, 'F');
            }
          }
        });

        yPosition += odontogramaImageHeight + 10;

        // Legenda de condições
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Legenda:', margin, yPosition);
        yPosition += 6;
        
        let legendX = margin;
        Object.entries(condicoes).forEach(([key, condition]) => {
          pdf.setFillColor(...condition.color);
          pdf.rect(legendX, yPosition - 2, 4, 4, 'F');
          pdf.setTextColor(0, 0, 0);
          pdf.setFont('helvetica', 'normal');
          pdf.text(condition.label, legendX + 6, yPosition + 1);
          legendX += 35;
          
          if (legendX > pageWidth - 40) {
            legendX = margin;
            yPosition += 6;
          }
        });
        
        yPosition += 10;
        
        // Desenhar dentes com condições
        pdf.setFont('helvetica', 'bold');
        pdf.text('Dentes com Alterações:', margin, yPosition);
        yPosition += 8;
        
        // Agrupar por condição
        const groupedTeeth = {};
        formData.mapa_dental.forEach(item => {
          if (!groupedTeeth[item.condition]) {
            groupedTeeth[item.condition] = [];
          }
          groupedTeeth[item.condition].push(`${item.tooth} (${item.surface})`);
        });
        
        Object.entries(groupedTeeth).forEach(([condition, teeth]) => {
          const conditionData = condicoes[condition];
          if (conditionData) {
            pdf.setFillColor(...conditionData.color);
            pdf.rect(margin, yPosition - 2, 4, 4, 'F');
            
            pdf.setTextColor(0, 0, 0);
            pdf.setFont('helvetica', 'bold');
            pdf.text(`${conditionData.label}:`, margin + 6, yPosition + 1);
            
            pdf.setFont('helvetica', 'normal');
            const teethText = teeth.sort().join(', ');
            pdf.text(teethText, margin + 40, yPosition + 1);
            
            yPosition += 6;
          }
        });
        
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
      addMapaDental();

      // Informações Adicionais
      if (formData.alimentacao_notas || formData.informacoes_adicionais || formData.observacoes_dentais) {
        addSection('INFORMAÇÕES ADICIONAIS', [
          { label: 'Observações sobre alimentação', value: formData.alimentacao_notas || '' },
          { label: 'Observações dentais', value: formData.observacoes_dentais || '' },
          { label: 'Outras informações', value: formData.informacoes_adicionais || '' }
        ]);
      }

      // Responsável e Assinatura
      checkNewPage(40);
      addSection('RESPONSÁVEL E ASSINATURA', [
        { label: 'Nome do Responsável', value: formData.responsavel_nome || '' },
        { label: 'Data', value: new Date().toLocaleDateString('pt-BR') }
      ]);
      
      // Espaço para assinatura
      yPosition += 10;
      pdf.setDrawColor(0, 0, 0);
      pdf.line(margin, yPosition, margin + 80, yPosition);
      pdf.setFontSize(8);
      pdf.setTextColor(100, 100, 100);
      pdf.text('Assinatura do Responsável', margin, yPosition + 5);

      // Adicionar rodapé na última página
      addFooter(pageNumber);

      // Salvar o PDF
      const fileName = `ficha_anamnese_${(formData.nome_crianca || 'paciente').replace(/\s+/g, '_')}_${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.pdf`;
      
      console.log('PDF profissional gerado com sucesso:', fileName);
      pdf.save(fileName);
      
      return true;

    } catch (error) {
      console.error('Erro detalhado ao gerar PDF:', error);
      throw new Error(`Erro ao gerar PDF: ${error.message}`);
    }
  }
};

export default PDFExporter;

