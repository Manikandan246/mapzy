import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import jsPDF from 'jspdf';
import '../styles/ConfirmationPage.css';

const ConfirmationPage = () => {
  const location = useLocation();
  const formData = location.state?.formData || {};
  const imageUrl = location.state?.imageUrl || null;

  useEffect(() => {
    console.log("📄 Generating PDF...");
    generatePDF();
  }, []);

  const generatePDF = async () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Property Visit Report', 20, 20);

    let y = 35;
    const keysToShow = [
      'rep_name', 'address', 'city', 'pincode', 'property_type', 'size',
      'floors', 'condition', 'owner_name', 'owner_phone', 'price', 'notes'
    ];

    keysToShow.forEach(key => {
      if (formData[key]) {
        const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        const text = `${label}: ${formData[key]}`;
        doc.setFontSize(12);
        doc.text(text, 20, y);
        y += 8;
      }
    });

    if (formData.latitude && formData.longitude) {
      const mapsLink = `https://maps.google.com/?q=${formData.latitude},${formData.longitude}`;
      doc.text(`Location: ${mapsLink}`, 20, y);
      y += 10;
    }

    if (imageUrl) {
      try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          const imgData = reader.result;
          doc.addImage(imgData, 'JPEG', 20, y, 60, 60);
          doc.save('property_visit_report.pdf');
        };
        reader.readAsDataURL(blob);
      } catch (err) {
        console.error("Error loading image for PDF", err);
        doc.save('property_visit_report.pdf');
      }
    } else {
      doc.save('property_visit_report.pdf');
    }
  };

  return (
    <div className="confirmation-container">
      <h2>✅ Property Submitted Successfully!</h2>
      <p>Your data has been recorded.</p>
      <button onClick={generatePDF} className="download-button">
        📄 Download PDF
      </button>
    </div>
  );
};

export default ConfirmationPage;
