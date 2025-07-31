import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface PDFExportOptions {
  filename?: string;
  title?: string;
  subtitle?: string;
  includeCharts?: boolean;
  includeHeader?: boolean;
  includeFooter?: boolean;
}

export class PDFExportService {
  
  // Export HTML element to PDF
  async exportElementToPDF(element: HTMLElement, options: PDFExportOptions = {}): Promise<void> {
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = imgWidth / imgHeight;
      
      let finalWidth = pdfWidth - 20; // 10mm margin on each side
      let finalHeight = finalWidth / ratio;
      
      // If height exceeds page, scale down
      if (finalHeight > pdfHeight - 20) {
        finalHeight = pdfHeight - 20;
        finalWidth = finalHeight * ratio;
      }

      // Add header if requested
      if (options.includeHeader !== false) {
        this.addHeader(pdf, options.title || 'Report', options.subtitle);
      }

      // Add the image
      const yPosition = options.includeHeader !== false ? 30 : 10;
      pdf.addImage(imgData, 'PNG', 10, yPosition, finalWidth, finalHeight);

      // Add footer if requested
      if (options.includeFooter !== false) {
        this.addFooter(pdf);
      }

      // Save the PDF
      const filename = options.filename || `report_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(filename);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      throw new Error('Failed to export PDF');
    }
  }

  // Export report data as structured PDF
  async exportReportToPDF(reportData: any, options: PDFExportOptions = {}): Promise<void> {
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      let yPosition = 20;

      // Add header
      this.addHeader(pdf, reportData.title, `Generated on ${new Date().toLocaleDateString()}`);
      yPosition = 40;

      // Add report content based on type
      if (reportData.id === 1) { // Stock Ledger
        yPosition = this.addStockLedgerContent(pdf, reportData.data, yPosition);
      } else if (reportData.id === 2) { // Low Stock Alert
        yPosition = this.addLowStockContent(pdf, reportData.data, yPosition);
      } else if (reportData.id === 4) { // Sales Performance
        yPosition = this.addSalesPerformanceContent(pdf, reportData.data, yPosition);
      } else {
        // Generic report content
        pdf.setFontSize(12);
        pdf.text('Report Data:', 20, yPosition);
        yPosition += 10;
        
        pdf.setFontSize(10);
        const dataText = JSON.stringify(reportData.data, null, 2);
        const lines = pdf.splitTextToSize(dataText, pageWidth - 40);
        pdf.text(lines, 20, yPosition);
      }

      // Add footer
      this.addFooter(pdf);

      // Save
      const filename = options.filename || `${reportData.title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(filename);
    } catch (error) {
      console.error('Error exporting report PDF:', error);
      throw new Error('Failed to export report PDF');
    }
  }

  private addHeader(pdf: jsPDF, title: string, subtitle?: string): void {
    // Company header
    pdf.setFontSize(20);
    pdf.setTextColor('#3997cd');
    pdf.text('Hardy Inventory Hub', 20, 15);
    
    pdf.setFontSize(16);
    pdf.setTextColor('#000000');
    pdf.text(title, 20, 25);
    
    if (subtitle) {
      pdf.setFontSize(10);
      pdf.setTextColor('#666666');
      pdf.text(subtitle, 20, 32);
    }

    // Add line separator
    pdf.setDrawColor('#3997cd');
    pdf.line(20, 35, pdf.internal.pageSize.getWidth() - 20, 35);
  }

  private addFooter(pdf: jsPDF): void {
    const pageHeight = pdf.internal.pageSize.getHeight();
    const pageWidth = pdf.internal.pageSize.getWidth();
    
    pdf.setDrawColor('#cccccc');
    pdf.line(20, pageHeight - 20, pageWidth - 20, pageHeight - 20);
    
    pdf.setFontSize(8);
    pdf.setTextColor('#666666');
    pdf.text('Hardy Inventory Hub - Automotive Parts Management System', 20, pageHeight - 15);
    pdf.text(`Generated on ${new Date().toLocaleString()}`, 20, pageHeight - 10);
    pdf.text(`Page 1`, pageWidth - 30, pageHeight - 10);
  }

  private addStockLedgerContent(pdf: jsPDF, data: any, startY: number): number {
    let yPosition = startY;

    // Summary metrics
    pdf.setFontSize(14);
    pdf.text('Inventory Summary', 20, yPosition);
    yPosition += 10;

    pdf.setFontSize(11);
    pdf.text(`Total Items: ${data.totalItems?.toLocaleString() || 'N/A'}`, 20, yPosition);
    pdf.text(`Total Value: $${data.totalValue?.toLocaleString() || 'N/A'}`, 120, yPosition);
    yPosition += 10;

    // Categories table
    if (data.categories && data.categories.length > 0) {
      yPosition += 5;
      pdf.setFontSize(14);
      pdf.text('Category Breakdown', 20, yPosition);
      yPosition += 10;

      // Table headers
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Category', 20, yPosition);
      pdf.text('Items', 80, yPosition);
      pdf.text('Value', 120, yPosition);
      pdf.text('Change', 160, yPosition);
      yPosition += 5;

      // Table content
      pdf.setFont('helvetica', 'normal');
      data.categories.forEach((cat: any) => {
        if (yPosition > 250) { // Check if we need a new page
          pdf.addPage();
          yPosition = 20;
        }
        
        pdf.text(cat.name, 20, yPosition);
        pdf.text(cat.items?.toLocaleString() || '0', 80, yPosition);
        pdf.text(`$${cat.value?.toLocaleString() || '0'}`, 120, yPosition);
        pdf.text(`${cat.change > 0 ? '+' : ''}${cat.change?.toFixed(1) || '0'}%`, 160, yPosition);
        yPosition += 7;
      });
    }

    return yPosition;
  }

  private addLowStockContent(pdf: jsPDF, data: any, startY: number): number {
    let yPosition = startY;

    // Alert summary
    pdf.setFontSize(14);
    pdf.text('Stock Alert Summary', 20, yPosition);
    yPosition += 10;

    pdf.setFontSize(11);
    pdf.text(`Critical Items: ${data.criticalItems || 0}`, 20, yPosition);
    pdf.text(`Low Stock Items: ${data.lowStockItems || 0}`, 120, yPosition);
    yPosition += 8;
    pdf.text(`Total Affected Value: $${data.totalAffectedValue?.toLocaleString() || '0'}`, 20, yPosition);
    yPosition += 15;

    // Urgent items
    if (data.urgentItems && data.urgentItems.length > 0) {
      pdf.setFontSize(14);
      pdf.text('Urgent Reorder Items', 20, yPosition);
      yPosition += 10;

      data.urgentItems.forEach((item: any, index: number) => {
        if (yPosition > 240) {
          pdf.addPage();
          yPosition = 20;
        }

        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`${index + 1}. ${item.name}`, 20, yPosition);
        yPosition += 7;

        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`SKU: ${item.sku}`, 25, yPosition);
        pdf.text(`Supplier: ${item.supplier}`, 100, yPosition);
        yPosition += 5;
        pdf.text(`Current Stock: ${item.current}`, 25, yPosition);
        pdf.text(`Minimum: ${item.minimum}`, 80, yPosition);
        pdf.text(`Reorder Qty: ${item.reorderQty}`, 130, yPosition);
        yPosition += 5;
        pdf.text(`Lead Time: ${item.leadTime}`, 25, yPosition);
        yPosition += 10;
      });
    }

    return yPosition;
  }

  private addSalesPerformanceContent(pdf: jsPDF, data: any, startY: number): number {
    let yPosition = startY;

    // Sales summary
    pdf.setFontSize(14);
    pdf.text('Sales Performance Summary', 20, yPosition);
    yPosition += 10;

    pdf.setFontSize(11);
    pdf.text(`Total Revenue: $${data.totalRevenue?.toLocaleString() || '0'}`, 20, yPosition);
    pdf.text(`Monthly Growth: ${data.monthlyGrowth || 0}%`, 120, yPosition);
    yPosition += 15;

    // Top customers
    if (data.topCustomers && data.topCustomers.length > 0) {
      pdf.setFontSize(14);
      pdf.text('Top Customers', 20, yPosition);
      yPosition += 10;

      // Table headers
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Customer', 20, yPosition);
      pdf.text('Revenue', 100, yPosition);
      pdf.text('Orders', 140, yPosition);
      pdf.text('Growth', 170, yPosition);
      yPosition += 5;

      // Table content
      pdf.setFont('helvetica', 'normal');
      data.topCustomers.forEach((customer: any) => {
        if (yPosition > 250) {
          pdf.addPage();
          yPosition = 20;
        }
        
        pdf.text(customer.name, 20, yPosition);
        pdf.text(`$${customer.revenue?.toLocaleString() || '0'}`, 100, yPosition);
        pdf.text(customer.orders?.toString() || '0', 140, yPosition);
        pdf.text(`${customer.growth > 0 ? '+' : ''}${customer.growth?.toFixed(1) || '0'}%`, 170, yPosition);
        yPosition += 7;
      });
    }

    return yPosition;
  }

  // Export chart as PDF
  async exportChartToPDF(chartElement: HTMLElement, options: PDFExportOptions = {}): Promise<void> {
    await this.exportElementToPDF(chartElement, {
      ...options,
      includeCharts: true
    });
  }
}

export const pdfExportService = new PDFExportService();