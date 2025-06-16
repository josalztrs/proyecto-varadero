/* eslint-disable @typescript-eslint/no-explicit-any */
// components/ExportPdfButton.tsx
'use client';

import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { supabase } from '@/app/lib/supabase/supabase';
import { toast } from 'sonner';

// Tipado genérico para columnas PDF
export interface PdfColumn<T> {
  key: keyof T | string;
  label: string;
  format?: (item: T) => string | number;
}

export interface ExportPdfButtonProps<T extends Record<string, any>> {
  tableName: string;
  columns: PdfColumn<T>[];
  fileName?: string;
  headerTitle?: string; // Opcional, con valor por defecto
  showReportDateTime?: boolean;
  queryBuilder?: (query: any) => any;
}

function ExportPdfButton<T extends Record<string, any>>({
  tableName,
  columns,
  fileName,
  headerTitle = "Varadero Mar Serena",
  showReportDateTime = true,
  queryBuilder,
}: ExportPdfButtonProps<T>) {
  const [loading, setLoading] = useState(false);

  const exportToPdf = async () => {
    setLoading(true);
    toast.info(`Generando PDF para la tabla "${tableName}"...`);

    try {
      let query = supabase.from(tableName).select('*');
      if (queryBuilder) query = queryBuilder(query);

      const { data, error } = await query;
      if (error) throw error;

      if (!data || data.length === 0) {
        toast.warning(`No hay datos para exportar en la tabla "${tableName}".`);
        setLoading(false);
        return;
      }

      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      });

      const margin = 15;
      let currentY = margin;

      // Calcular la fecha y hora una sola vez para usarla en todas las páginas
      const reportDateTime = new Date().toLocaleString('es-VE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text(headerTitle, margin, currentY);

      currentY += 10;

      if (showReportDateTime) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text(`Reporte generado el: ${reportDateTime}`, margin, currentY);
        currentY += 10;
      }

      currentY += 5; // Espacio adicional antes de la tabla

      const head = [columns.map((col) => col.label)];

      const body = data.map((item: T) =>
        columns.map((col) =>
          col.format
            ? col.format(item)
            : item[col.key as keyof T] !== null && item[col.key as keyof T] !== undefined
              ? String(item[col.key as keyof T])
              : ''
        )
      );

      autoTable(doc, {
        head,
        body,
        startY: currentY,
        margin: { top: margin, right: margin, bottom: margin, left: margin },
        headStyles: {
          fillColor: [52, 152, 219],
          textColor: [255, 255, 255],
          fontStyle: 'bold',
        },
        alternateRowStyles: {
          fillColor: [240, 240, 240],
        },
        styles: {
          font: 'helvetica',
          fontSize: 8,
          cellPadding: 3,
          overflow: 'linebreak',
        },
        didDrawPage: (data) => {
          const pageCount = doc.getNumberOfPages();
          const currentPageNumber = data.pageNumber;
          const footerY = doc.internal.pageSize.height - margin + 5; // Posición Y para el pie de página
          const footerTextSize = 8;

          // Dibujar línea separadora
          doc.setLineWidth(0.2);
          doc.setDrawColor(180, 180, 180); // Un gris claro para la línea
          doc.line(
            margin,
            doc.internal.pageSize.height - margin - footerTextSize,
            doc.internal.pageSize.width - margin,
            doc.internal.pageSize.height - margin - footerTextSize
          );

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(footerTextSize);
          doc.setTextColor(100); // Color de texto gris oscuro para el pie de página

          // Info del Varadero y Fecha/Hora del Reporte en la izquierda
          doc.text(headerTitle, margin, footerY);
          if (showReportDateTime) {
            doc.text(`Generado: ${reportDateTime}`, margin, footerY + 4); // Un poco más abajo
          }

          // Número de página en el centro
          const pageNumberText = `Pág. ${currentPageNumber} / ${pageCount}`;
          const pageNumberTextWidth =
            doc.getStringUnitWidth(pageNumberText) * footerTextSize / doc.internal.scaleFactor;
          const pageNumberX = (doc.internal.pageSize.width / 2) - (pageNumberTextWidth / 2);
          doc.text(pageNumberText, pageNumberX, footerY + 2); // Centrado y ligeramente más abajo
        },
      });

      doc.save(`${fileName || `Reporte_${tableName}_${new Date().toLocaleDateString('es-VE')}`}.pdf`);
      toast.success('PDF generado exitosamente!');
    } catch (err: any) {
      console.error('Error al exportar a PDF:', err.message);
      toast.error('Error al generar el PDF. Intenta de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={exportToPdf}
      disabled={loading}
      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200 flex items-center disabled:opacity-50 disabled:cursor-not-allowed text-sm"
      title="Exportar a PDF"
      type="button"
    >
      {loading ? 'Generando...' : 'Exportar a PDF'}
    </button>
  );
}

export default ExportPdfButton;