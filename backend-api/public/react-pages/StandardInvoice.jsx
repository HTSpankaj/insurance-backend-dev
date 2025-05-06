const { useEffect, useState, useRef, Fragment } = React;

const StandardInvoice = ({
  logo_url = "",
  company_header_config = {},
  invoice_info_config = {},
  bill_to_config = {},
  lead_table_preview_config = [],
  tax_summary_config = {},
  totals_section_config = {},
  bank_details_config = {},
  terms_conditions_config = {}
}) => {
  return (
    <div style={{
      maxWidth: '900px',
      margin: 'auto',
      backgroundColor: '#fff',
      padding: '30px',
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
      border: '1px solid #eee',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
        <div style={{ fontSize: '26px', fontWeight: 'bold', color: '#004a87' }}>
          {logo_url ? <img src={logo_url} alt="Logo" height="40" /> : '★ Starfor'}
        </div>
        <div style={{ textAlign: 'right', fontSize: '14px', color: '#555' }}>
          <div>{company_header_config?.address || 'Business address'}</div>
          <div>{company_header_config?.city || 'City, State, IN - 000 000'}</div>
          <div>{company_header_config?.tax_id && `TAX ID ${company_header_config.tax_id}`}</div>
        </div>
      </div>

      {/* Invoice Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', margin: '30px 0 20px' }}>
        <div>
          <strong>Invoice #</strong><br />
          {invoice_info_config?.invoice_number || 'AB2324-01'}
        </div>
        <div>
          <strong>Invoice date</strong><br />
          {invoice_info_config?.invoice_date || '01 Aug, 2023'}
        </div>
      </div>

      {/* Lead Table */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
        <thead style={{ backgroundColor: '#f0f3f6' }}>
          <tr>
            <th style={thStyle}>Lead Name</th>
            <th style={thStyle}>Product Interest</th>
            <th style={thStyle}>Commission</th>
            <th style={thStyle}>Tax</th>
            <th style={thStyle}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {lead_table_preview_config.map((item, index) => (
            <tr key={index}>
              <td style={tdStyle}>{item.lead_name}</td>
              <td style={tdStyle}>{item.product}</td>
              <td style={tdStyle}>₹ {item.commission}</td>
              <td style={tdStyle}>₹ {item.tax}</td>
              <td style={tdStyle}>₹ {item.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Summary */}
      <div style={{ textAlign: 'right', fontSize: '14px', marginBottom: '30px' }}>
        <div><strong>Subtotal:</strong> ₹ {totals_section_config?.subtotal || '0.00'}</div>
        <div><strong>Tax:</strong> ₹ {totals_section_config?.tax || '0.00'}</div>
        <div><strong>Total:</strong> ₹ {totals_section_config?.total || '0.00'}</div>
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
        <div style={{ maxWidth: '45%' }}>
          <strong>Bank Details</strong><br />
          Account no: {bank_details_config?.account_no}<br />
          Bank Name: {bank_details_config?.bank_name}<br />
          Account Name: {bank_details_config?.account_name}<br />
          IFSC Code: {bank_details_config?.ifsc_code}<br />
          UPI ID: {bank_details_config?.upi_id}
        </div>
        <div style={{ maxWidth: '45%' }}>
          <strong>Payment Terms</strong><br />
          {terms_conditions_config?.terms || 'Payments to be made within 7 working days.'}<br /><br />
          Thank you for your business!
        </div>
      </div>
    </div>
  );
};

// Inline styles for table
const thStyle = {
  padding: '12px',
  border: '1px solid #ddd',
  textAlign: 'left',
  fontSize: '14px',
  backgroundColor: '#f0f3f6'
};

const tdStyle = {
  padding: '12px',
  border: '1px solid #ddd',
  textAlign: 'left',
  fontSize: '14px'
};
