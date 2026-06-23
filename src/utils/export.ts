// Excel / CSV and PDF Exporter for SAIL Departmental Portal

export function exportToExcel(headers: string[], rows: any[][], fileName: string) {
  // Generate a clean comma-separated values format, handling quotes and line breaks safely
  const csvContent = [
    headers.map(h => `"${h.replace(/"/g, '""')}"`).join(','),
    ...rows.map(row => 
      row.map(val => {
        const strVal = val === null || val === undefined ? '' : String(val);
        return `"${strVal.replace(/"/g, '""')}"`;
      }).join(',')
    )
  ].join('\r\n');

  const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${fileName}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToPDF(title: string, headers: string[], rows: any[][], metadataInfo: { label: string; value: string }[]) {
  // Create an iframe to print the document cleanly without messing with the parent page's styles or layout.
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert("Popup blocked! Please allow popups to export the PDF.");
    return;
  }

  const metadataHtml = metadataInfo.map(m => `
    <div style="flex: 1; min-width: 200px; margin-bottom: 8px;">
      <strong style="color: #4b5563; font-size: 11px; text-transform: uppercase;">${m.label}:</strong>
      <span style="color: #111827; font-size: 13px; font-weight: 500; display: block; margin-top: 2px;">${m.value}</span>
    </div>
  `).join('');

  const tableHeadersHtml = headers.map(h => `
    <th style="background-color: #0f172a; color: #ffffff; text-align: left; padding: 10px; font-size: 11px; font-weight: 600; text-transform: uppercase; border: 1px solid #e2e8f0; border-collapse: collapse;">${h}</th>
  `).join('');

  const tableRowsHtml = rows.map((row, idx) => `
    <tr style="background-color: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'};">
      ${row.map(val => `
        <td style="padding: 10px; font-size: 12px; color: #334155; border: 1px solid #e2e8f0; border-collapse: collapse;">${val}</td>
      `).join('')}
    </tr>
  `).join('');

  printWindow.document.write(`
    <!doctype html>
    <html>
      <head>
        <title>SAIL Export - ${title}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          body {
            font-family: 'Inter', sans-serif;
            color: #1e293b;
            padding: 30px;
            margin: 0;
          }
          @media print {
            body { padding: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #1e3a8a; padding-bottom: 15px; margin-bottom: 25px;">
          <div>
            <div style="display: flex; align-items: center; gap: 12px;">
              <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 5L90 45L50 85L10 45L50 5Z" fill="#1e3a8a"/>
                <path d="M50 25L70 45L50 65L30 45L50 25Z" fill="#ffffff"/>
                <path d="M50 37L58 45L50 53L42 45L50 37Z" fill="#1e3a8a"/>
              </svg>
              <div>
                <h1 style="margin: 0; font-size: 20px; font-weight: 700; color: #1e3a8a; letter-spacing: -0.025em;">STEEL AUTHORITY OF INDIA LIMITED</h1>
                <p style="margin: 2px 0 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #64748b; font-weight: 500;">Departmental Stores &amp; Allocations</p>
              </div>
            </div>
          </div>
          <div style="text-align: right;">
            <p style="margin: 0; font-size: 12px; font-weight: 600; color: #0f172a;">OFFICIAL RECORD</p>
            <p style="margin: 2px 0 0 0; font-size: 11px; color: #64748b;">Generated: ${new Date().toLocaleDateString('en-IN', { hour: '2-digit', minute: '2-digit' })}</p>
          </div>
        </div>

        <h2 style="font-size: 18px; font-weight: 600; color: #0f172a; margin-top: 0; margin-bottom: 15px;">${title}</h2>

        <!-- Metadata Cards -->
        <div style="display: flex; flex-wrap: wrap; background-color: #f1f5f9; border-radius: 6px; padding: 15px; margin-bottom: 25px; border-left: 4px solid #1e3a8a;">
          ${metadataHtml}
        </div>

        <!-- Table -->
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
          <thead>
            <tr>
              ${tableHeadersHtml}
            </tr>
          </thead>
          <tbody>
            ${tableRowsHtml}
          </tbody>
        </table>

        <!-- Footer -->
        <div style="margin-top: 50px; font-size: 10px; color: #64748b; text-align: center; border-top: 1px dashed #cbd5e1; padding-top: 15px;">
          <p style="margin: 0;">This is a system-generated official audit document of SAIL Central Inventory Division.</p>
          <p style="margin: 4px 0 0 0;">Confidential &bull; Steel Authority of India Ltd. &copy; ${new Date().getFullYear()}</p>
        </div>

        <div class="no-print" style="margin-top: 30px; text-align: center;">
          <button onclick="window.print()" style="background-color: #1e3a8a; color: white; border: none; padding: 10px 20px; font-size: 14px; font-weight: 600; border-radius: 4px; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.15);">
            Print / Save as PDF
          </button>
        </div>
      </body>
    </html>
  `);
  
  printWindow.document.close();
}
