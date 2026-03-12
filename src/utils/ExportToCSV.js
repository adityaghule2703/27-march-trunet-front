export const exportToCSV = (data, filename, headers) => {
    if (!data || data.length === 0) {
      alert('No data to export');
      return;
    }
  
    console.log('Exporting data:', data.length, 'rows');
    console.log('First row:', data[0]);
    console.log('Headers:', headers);
  
    const csvRows = [];
    
    csvRows.push(headers.join(','));
    
    data.forEach((item, index) => {
      const values = headers.map(header => {
        const keyMap = {
          'Invoice Number': 'invoiceNumber',
          'Invoice Date': 'invoiceDate',
          'Reseller Name': 'resellerName',
          'Reseller GST': 'resellerGST',
          'Branch/Center': 'centerName',
          'Challan No': 'challanNo',
          'Product Description': 'productName',
          'HSN Code': 'hsnCode',
          'Quantity': 'quantity',
          'Rate (₹)': 'rate',
          'Total (₹)': 'totalAmount',
          'GST Rate (%)': 'gstRate',
          'CGST (₹)': 'cgstAmount',
          'SGST (₹)': 'sgstAmount',
          'Total with GST (₹)': 'totalWithGST',
          'Invoice Status': 'status'
        };
        
        const actualKey = keyMap[header];
        const value = item[actualKey];
        return formatCSVValue(value);
      });
      csvRows.push(values.join(','));
    });
    
    const csvString = csvRows.join('\n');
    const blob = new Blob(['\uFEFF' + csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  const formatCSVValue = (value) => {
    if (value === null || value === undefined) return '';
    
    const stringValue = String(value);

    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    
    return stringValue;
  };