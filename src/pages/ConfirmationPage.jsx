// src/pages/ConfirmationPage.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import jsPDF from 'jspdf';
import '../styles/ConfirmationPage.css';

const ConfirmationPage = () => {
  const location = useLocation();
  const data = location.state;

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Property Visit Report', 20, 20);

    let y = 30;
    Object.entries(data).forEach(([key, value]) => {
      if (key === 'image_url' || key === 'latitude' || key === 'longitude') return;
      const label = key.replace(/_/g, ' ').toUpperCase();
      const text = `${label}: ${typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value}`;
      doc.setFontSize(12);
      doc.text(text, 20, y);
      y += 8;
    });

    if (data.latitude && data.longitude) {
      doc.setFontSize(12);
      doc.text(`LATITUDE: ${data.latitude}`, 20, y);
      y += 8;
      doc.text(`LONGITUDE: ${data.longitude}`, 20, y);
      y += 8;
      const mapUrl = `https://www.google.com/maps?q=${data.latitude},${data.longitude}`;
      doc.textWithLink('View on Google Maps', 20, y + 4, { url: mapUrl });
      y += 12;
    }

    if (data.image_url) {
      const image = new Image();
      image.crossOrigin = 'anonymous';
      image.src = data.image_url;
      image.onload = () => {
        doc.addImage(image, 'JPEG', 20, y, 80, 80);
        doc.save('property_visit_report.pdf');
      };
    } else {
      doc.save('property_visit_report.pdf');
    }
  };

  return (
    <div className="confirmation-wrapper">
      <div className="confirmation-card">
        <h2>✅ Property Saved Successfully!</h2>
        <p>Click below to download the visit report.</p>
        <button onClick={generatePDF}>Download PDF</button>
      </div>
    </div>
  );
};

export default ConfirmationPage;
