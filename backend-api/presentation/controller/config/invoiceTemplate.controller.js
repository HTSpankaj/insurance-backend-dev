const InvoiceTemplateService = require("../../../application/services/config/InvoiceTemplate.service.js");
const { supabaseInstance } = require("../../../supabase-db/index.js");

const invoiceTemplateService = new InvoiceTemplateService(supabaseInstance);

exports.getAllInvoiceTemplateController = async (req, res) => {
    /*
    #swagger.tags = ['Invoice Config']
    #swagger.description = 'Get all invoice template'
    */
    try {
        const result = await invoiceTemplateService.getAllInvoiceTemplateService();
        return res.status(200).json({
            success: true,
            message: "Get all invoice template successfully.",
            data: result,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: { message: error.message || "Something went wrong!" },
        });
    }
};

exports.invoiceTemplateGenerationController = async (req, res) => {
    /*
    #swagger.tags = ['Invoice Config']
    #swagger.description = 'Create new Invoice template generation'
    
    #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
            company_header_config: {
                company_name: "Acme Corp",
                company_address: "123 Street, City",
                phone_number: "1234567890",
                email_address: "info@acme.com",
                gstin_number: "27ABCDE1234F1Z5"
            },
            invoice_info_config: {
                invoice_title: "Invoice",
                invoice_prefix: "INV-",
                invoice_date_format: "YYYY-MM-DD",
                invoice_date: "2025-05-05",
                due_date: "2025-06-05",
                payment_terms: "Net 30"
            },
            bill_to_config: {
                customer_name: "John Doe",
                billing_address: "456 Avenue, Town",
                shipping_address: "789 Road, City",
                phone_number: "9876543210",
                email_address: "john@example.com",
                gstin_number: "29XYZAB1234C6Z7"
            },
            lead_table_preview_config: [
                { table_name: "Leads", column_name: "Lead ID" },
                { table_name: "Leads", column_name: "Lead Name" }
            ],
            tax_summary_config: {
                is_enable_taxes: true,
                CGST: { is_enable: true, value: 9 },
                SGST: { is_enable: true, value: 9 },
                IGST: { is_enable: false, value: 0 }
            },
            totals_section_config: {
                is_show_subtotal: true,
                is_show_total_tax_amount: true,
                is_show_grand_total: true
            },
            bank_details_config: {
                bank_name: "State Bank of India",
                account_number: "123456789012",
                account_name: "Acme Corp Pvt Ltd",
                ifsc_code: "SBIN0001234",
                uip_id: "acme@sbi"
            },
            terms_conditions_config: {
                payment_terms: "Please pay within 30 days",
                thank_you_message: "Thank you for your business!"
            }
        }
    }
    */

    const {
        company_header_config,
        invoice_info_config,
        bill_to_config,
        lead_table_preview_config,
        tax_summary_config,
        totals_section_config,
        bank_details_config,
        terms_conditions_config
    } =req.body;

    try {
        const result = await invoiceTemplateService.invoiceTemplateGenerationService(
            company_header_config,
            invoice_info_config,
            bill_to_config,
            lead_table_preview_config,
            tax_summary_config,
            totals_section_config,
            bank_details_config,
            terms_conditions_config
        );
        return res.status(200).json({
            success: true,
            message: "Get advisor access config successfully.",
            data: result,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: { message: error.message || "Something went wrong!" },
        });
    }
}