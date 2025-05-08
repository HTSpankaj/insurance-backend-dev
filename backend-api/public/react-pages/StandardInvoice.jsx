const { useEffect, useState, useRef, Fragment } = React;

const StandardInvoice = ({
    invoice_display_id = "",
    device = "web",
}) => {
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);
    const [invoiceData, setInvoiceData] = useState(null);

    const [logo_url, set_logo_url] = useState({});
    const [company_header_config, set_company_header_config] = useState({});
    const [bill_to_config, set_bill_to_config] = useState({});
    const [invoice_info_config, set_invoice_info_config] = useState({});
    const [lead_table_preview_config, set_lead_table_preview_config] = useState([]);
    const [totals_section_config, set_totals_section_config] = useState({});
    const [bank_details_config, set_bank_details_config] = useState({});

    const [tax_summary_config, set_tax_summary_config] = useState({});
    const [terms_conditions_config, set_terms_conditions_config] = useState({});

    useEffect(() => {
        const fetchInvoiceData = async () => {
            try {
                const response = await fetch(`/api/remuneration/get-invoice-details-by-display-id/${invoice_display_id}`);
                const jsoData = await response.json();

                if (jsoData?.success) {
                    const data = jsoData?.data;
                    console.log("Received invoice data:", data);
                    
                    set_logo_url(data?.invoice_template_generation_id?.logo_url);
                    set_company_header_config(data?.invoice_template_generation_id?.company_header_config);
                    set_bill_to_config(data?.invoice_template_generation_id?.bill_to_config);
                    set_invoice_info_config(data?.invoice_template_generation_id?.invoice_info_config);
                    set_lead_table_preview_config(data?.invoice_template_generation_id?.lead_table_preview_config);
                    set_totals_section_config(data?.invoice_template_generation_id?.totals_section_config);
                    set_bank_details_config(data?.invoice_template_generation_id?.bank_details_config);
                    set_terms_conditions_config(data?.invoice_template_generation_id?.terms_conditions_config);

                    const leadTableData = data.product.map(p=> {
                        return data?.invoice_template_generation_id?.lead_table_preview_config.map(c=>{
                            if (c?.column_name === "Lead Name") {
                                return p?.lead.name;
                            }
                            if(c?.column_name === "Lead ID"){
                                return p?.lead?.lead_display_id;
                            }
                            if(c?.column_name === "Lead Email"){
                                return p?.lead?.email;
                            }
                            if(c?.column_name === "Lead Contact Number"){
                                return p?.lead?.contact_number;
                            }
                            if(c?.column_name === "Product Interest"){
                                return p?.product?.product_name;
                            }
                            if(c?.column_name === "Product Category"){
                                return p?.product?.sub_category_id?.category_id?.title;
                            }
                            if(c?.column_name === "Product Tax"){
                                return 0;
                            }
                            if(c?.column_name === "Commission"){
                                return p?.amount;
                            }

                        })
                    })
                    console.log(leadTableData);
                    
                    setInvoiceData({...data, leadTableData});
                } else {
                    setErrorMessage(jsoData?.error || "Failed to fetch invoice data.");
                }
            } catch (error) {
                console.error("Error fetching invoice data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchInvoiceData();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (errorMessage) return <p>{errorMessage}</p>;

    return (
        <div
            style={{
                ...{
                    maxWidth: "900px",
                    margin: "auto",
                    backgroundColor: "#fff",
                    // padding: "30px",
                    fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
                    border: "1px solid #eee",
                    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
                },
                ...(device === "mobile" && mobileDeviceStyle),
            }}
        >
            {/* Header */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    borderBottom: "1px solid #eee",
                    paddingBottom: "10px",
                    padding: '32px 24px',
                    backgroundColor: "#F9FAFC",
                }}
            >
                <div style={{ fontSize: "13px", fontWeight: "400", color: "#5E6470" }}>
                    {logo_url ? <img src={logo_url} alt="Logo" height="40" /> : ""}
                    <br />
                    {company_header_config?.company_name || "Company Name"}
                    <br />
                    {company_header_config?.company_address || ""}
                    <br />
                    {company_header_config?.phone_number} || {company_header_config?.email_address}
                    {company_header_config?.gstin_number && 
                        <>
                            <br />
                            GSTIN: {company_header_config.gstin_number}
                        </>
                    }
                </div>
                <div style={{ fontSize: "12px", fontWeight: "400", color: "#5E6470" }}>
                    <p style={{ fontWeight: "600", color: "#1A1C21" }}>Billed to</p>
                    {bill_to_config?.customer_name && <p style={{ fontWeight: "600", color: "#5E6470" }}>{invoiceData?.advisor?.name}</p>}
                    {bill_to_config?.email_address && <p>{invoiceData?.advisor?.email}</p>}
                    {bill_to_config?.phone_number && <p>{invoiceData?.advisor?.mobile_number}</p>}
                    {bill_to_config?.gstin_number && <p>{invoiceData?.advisor?.gstin_number}</p>}
                </div>
            </div>

            {/* Invoice Info */}
            <div
                style={{ display: "flex", justifyContent: "space-between", padding: '32px 24px' }}
            >
                <div>
                    <strong>Invoice #</strong>
                    <br />
                    {invoice_info_config?.invoice_prefix}{invoiceData?.invoice_display_id}
                </div>
                <div>
                    <strong>Invoice date</strong>
                    <br />
                    {invoiceData?.invoice_date}
                </div>
            </div>

            {/* Lead Table */}
            <div style={{ padding: '0 32px 24px' }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead style={{ backgroundColor: "#f0f3f6" }}>
                        <tr>
                            {/* <th style={thStyle}>#</th> */}
                            {lead_table_preview_config.map((item, index) => (
                                <th style={thStyle} key={index}>{item.column_name}</th>
                            ))}
                            {/* <th style={thStyle}>Product Interest</th>
                            <th style={thStyle}>Commission</th>
                            <th style={thStyle}>Tax</th>
                            <th style={thStyle}>Amount</th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {invoiceData?.leadTableData?.map((item, index) => (
                            <tr key={"row_"+index}>
                                {item?.map((col, col_index) => (
                                    <td style={tdStyle} key={"col_"+col_index}>{col}</td>
                                ))}
                                {/* <td style={tdStyle}>{item.product}</td>
                                <td style={tdStyle}>₹ {item.commission}</td>
                                <td style={tdStyle}>₹ {item.tax}</td>
                                <td style={tdStyle}>₹ {item.amount}</td> */}
                            </tr>
                        ))}
                    </tbody>
                </table>
                {/* Summary */}
                <div style={{ textAlign: "right", fontSize: "14px", marginTop: "20px" }}>
                    {totals_section_config?.is_show_subtotal &&
                        <div>
                            <strong>Subtotal:</strong> ₹ {invoiceData?.generated_amount || "0.00"}
                        </div>
                    }
                    {
                        totals_section_config?.is_show_tax &&
                        <div>
                            <strong>Tax:</strong> ₹ { "0.00"}
                        </div>
                    }
                    <div>
                        <strong>Total:</strong> ₹ {invoiceData?.generated_amount || "0.00"}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "14px",
                    borderTop: "1px solid #eee",
                    padding: "32px 24px",
                }}
            >
                <div style={{ maxWidth: "45%" }}>
                    <strong>Bank Details</strong>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>

                        <tbody>
                            {bank_details_config?.account_number &&
                                <tr>
                                    <td>Account no:</td>
                                    <td style={bankDetailsTdStyle}>{invoiceData?.advisor.bank_details?.[0]?.bank_account_number}</td>
                                </tr>
                            }

                            { bank_details_config?.bank_name &&
                                <tr>
                                    <td>Bank Name:</td>
                                    <td style={bankDetailsTdStyle}>{invoiceData?.advisor.bank_details?.[0]?.bank_name}</td>
                                </tr>
                            }
                            {
                                bank_details_config?.ifsc_code &&
                                <tr>
                                    <td>IFSC Code:</td>
                                    <td style={bankDetailsTdStyle}>{invoiceData?.advisor.bank_details?.[0]?.bank_ifsc_code}</td>
                                </tr>
                            }
                            {/* <tr>
                                <td>Account Name:</td>
                                <td>{invoiceData?.advisor.bank_details?.[0]?.bank_name}</td>
                            </tr> */}
                            {
                                bank_details_config?.ifsc_code &&
                            <tr>
                                <td>UPI ID:</td>
                                <td style={bankDetailsTdStyle}>{invoiceData?.advisor.bank_details?.[0]?.upi_id}</td>
                            </tr>
                                }
                        </tbody>
                    </table>
                </div>
                <div style={{ maxWidth: "45%" }}>
                    <strong>Payment Terms</strong>
                    <br />
                    {terms_conditions_config?.payment_terms}
                    <br />
                    <br />
                    {terms_conditions_config?.thank_you_message}
                </div>
            </div>
        </div>
    );
};

// Inline styles for table
const thStyle = {
    padding: "12px",
    border: "1px solid #ddd",
    textAlign: "left",
    fontSize: "14px",
    backgroundColor: "#f0f3f6",
};

const tdStyle = {
    padding: "12px",
    border: "1px solid #ddd",
    textAlign: "left",
    fontSize: "14px",
};

const bankDetailsTdStyle = {
    paddingLeft: '10px'
}

const mobileDeviceStyle = {
    zoom: "80%",
};