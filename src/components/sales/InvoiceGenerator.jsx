
import React from 'react';
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const InvoiceGenerator = ({ sale }) => {
  const invoiceRef = React.useRef(null);
  
  const generatePDF = async () => {
    if (!invoiceRef.current) return;
    
    try {
      toast({
        title: "Generating Invoice",
        description: "Please wait while we generate your invoice...",
      });
      
      const invoice = invoiceRef.current;
      const canvas = await html2canvas(invoice, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 30;
      
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`Invoice-${sale.id}.pdf`);
      
      toast({
        title: "Invoice Generated",
        description: `Invoice for sale ${sale.id} has been downloaded.`,
      });
    } catch (error) {
      toast({
        title: "Failed to Generate Invoice",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };
  
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  return (
    <div className="space-y-4">
      <div className="bg-white p-6 rounded-md border" ref={invoiceRef}>
        <div className="flex justify-between items-start border-b pb-4 mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">INVOICE</h1>
            <p className="text-gray-500 text-sm">#{sale.id}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-gray-800">RxNexus</p>
            <p className="text-sm text-gray-600">Illahi Bagh</p>
            <p className="text-sm text-gray-600">Srinagar, J&K</p>
            <p className="text-sm text-gray-600">GSTIN: XXXXXXXXXXXXXXXX</p>
            <p className="text-sm text-gray-600">Phone: +91 XXXXXXXXXXX</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <h3 className="font-medium text-gray-600 mb-2">Bill To:</h3>
            <p className="font-medium">{sale.customer}</p>
          </div>
          <div className="text-right">
            <h3 className="font-medium text-gray-600 mb-2">Invoice Details:</h3>
            <p><span className="text-gray-600">Date:</span> {formatDate(sale.date)}</p>
            <p><span className="text-gray-600">Payment Method:</span> {sale.paymentMethod}</p>
          </div>
        </div>
        
        <table className="w-full mb-6">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="py-2 text-left">Item</th>
              <th className="py-2 text-center">Qty</th>
              <th className="py-2 text-right">Unit Price</th>
              <th className="py-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {sale.items.map((item, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-2">{item.product}</td>
                <td className="py-2 text-center">{item.quantity}</td>
                <td className="py-2 text-right">₹{item.price.toFixed(2)}</td>
                <td className="py-2 text-right">₹{item.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="font-medium">
              <td className="py-2" colSpan={3} align="right">Subtotal:</td>
              <td className="py-2 text-right">₹{sale.totalAmount.toFixed(2)}</td>
            </tr>
            <tr className="text-sm text-gray-600">
              <td className="py-1" colSpan={3} align="right">Tax (5% GST):</td>
              <td className="py-1 text-right">₹{(sale.totalAmount * 0.05).toFixed(2)}</td>
            </tr>
            <tr className="font-bold">
              <td className="py-2" colSpan={3} align="right">Total:</td>
              <td className="py-2 text-right text-xl">₹{(sale.totalAmount * 1.05).toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
        
        <div className="border-t pt-4 text-sm">
          <p className="font-medium mb-2">Terms & Conditions:</p>
          <ul className="list-disc pl-5 text-gray-600 space-y-1">
            <li>Payment due upon receipt of invoice</li>
            <li>Medicines once sold cannot be returned</li>
            <li>Keep medicine away from children</li>
          </ul>
          
          <div className="mt-8 pt-4 border-t text-center">
            <p>Thank you for your business!</p>
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button onClick={generatePDF}>
          <FileText className="mr-2 h-4 w-4" />
          Download Invoice PDF
        </Button>
      </div>
    </div>
  );
};

export default InvoiceGenerator;
