const InvoiceTemplateService = require("../../../application/services/config/InvoiceTemplate.service.js");
const InvoiceTemplateGenerationService = require("../../../application/services/config/InvoiceTemplateGenaration.service.js");
const { supabaseInstance } = require("../../../supabase-db/index.js");

const invoiceTemplateService = new InvoiceTemplateService(supabaseInstance);
const invoiceTemplateGenerationService = new InvoiceTemplateGenerationService(supabaseInstance);

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
            title: "Invoice Template name",
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
                invoice_date_format: "YYYY-MM-DD"
            },
            bill_to_config: {
                customer_name: true,
                billing_address: true,
                phone_number: true,
                email_address: true,
                gstin_number: true,
            },
            lead_table_preview_config: [
                { column_name: "Lead ID" },
                { column_name: "Lead Name" }
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
                bank_name: true,
                account_number: true,
                ifsc_code: true,
                uip_id: true,
            },
            terms_conditions_config: {
                payment_terms: "Please pay within 30 days",
                thank_you_message: "Thank you for your business!"
            },
            category: ["550e8400-e29b-41d4-a716-446655440000"],
            sub_category: ["550e8400-e29b-41d4-a716-446655440000"]
        }
    }
    */

    const {
        title,
        company_header_config,
        invoice_info_config,
        bill_to_config,
        lead_table_preview_config,
        tax_summary_config,
        totals_section_config,
        bank_details_config,
        terms_conditions_config,
        category,
        sub_category,
    } = req.body;

    try {
        const result = await invoiceTemplateService.invoiceTemplateGenerationService(
            title,
            company_header_config,
            invoice_info_config,
            bill_to_config,
            lead_table_preview_config,
            tax_summary_config,
            totals_section_config,
            bank_details_config,
            terms_conditions_config,
            category,
            sub_category,
        );
        return res.status(200).json({
            success: true,
            message: "create invoice template generation successfully.",
            data: result,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: { message: error.message || "Something went wrong!" },
        });
    }
};

exports.updateInvoiceTemplateGenerationController = async (req, res) => {
    /*
    #swagger.tags = ['Invoice Config']
    #swagger.description = 'Create new Invoice template generation'
    
    #swagger.parameters['body'] = {
        in: 'body',
        required: true,
        schema: {
            id: "55c4e5c4e5c4e5c4e5c4e5c4e5c4e5c4",
            title: "Invoice Template name",
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
                invoice_date_format: "YYYY-MM-DD"
            },
            bill_to_config: {
                customer_name: true,
                billing_address: true,
                phone_number: true,
                email_address: true,
                gstin_number: true,
            },
            lead_table_preview_config: [
                {  column_name: "Lead ID" },
                {  column_name: "Lead Name" }
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
                bank_name: true,
                account_number: true,
                ifsc_code: true,
                uip_id: true,
            },
            terms_conditions_config: {
                payment_terms: "Please pay within 30 days",
                thank_you_message: "Thank you for your business!"
            },
            category: ["550e8400-e29b-41d4-a716-446655440000"],
            sub_category: ["550e8400-e29b-41d4-a716-446655440000"]
        }
    }
    */

    const {
        id,
        title,
        company_header_config,
        invoice_info_config,
        bill_to_config,
        lead_table_preview_config,
        tax_summary_config,
        totals_section_config,
        bank_details_config,
        terms_conditions_config,
        category,
        sub_category,
    } = req.body;

    try {
        const result = await invoiceTemplateService.updateInvoiceTemplateGenerationService(
            id,
            title,
            company_header_config,
            invoice_info_config,
            bill_to_config,
            lead_table_preview_config,
            tax_summary_config,
            totals_section_config,
            bank_details_config,
            terms_conditions_config,
            null,
            category,
            sub_category,
        );
        return res.status(200).json({
            success: true,
            message: "update invoice template generation successfully.",
            data: result,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: { message: error.message || "Something went wrong!" },
        });
    }
};

exports.getInvoiceTemplateGenerationController = async (req, res) => {
    /*
    #swagger.tags = ['Invoice Config']
    #swagger.description = 'Get invoice template generation'
    #swagger.parameters['page_number'] = { 
      in: 'query', 
      type: 'integer', 
      required: false, 
      description: 'Page number (default: 1)' ,
      default: 1
    }
    #swagger.parameters['limit'] = { 
      in: 'query', 
      type: 'integer', 
      required: false, 
      description: 'Number of records per page (default: 10)' ,
      default: 10
    }
    #swagger.parameters['search'] = { 
      in: 'query', 
      type: 'string', 
      required: false, 
      description: 'Search term for product name' 
    }
    */

    try {
        const { page_number, limit, search } = req.query;
        const result = await invoiceTemplateService.getInvoiceTemplateGenerationService(
            page_number,
            limit,
            search,
        );
        return res.status(200).json({
            success: true,
            message: "Get invoice template generation successfully.",
            data: result?.data,
            metadata: {
                page: page_number,
                per_page: limit,
                total_count: result.total,
                total_pages: Math.ceil(result.total / limit),
            },
        });
    } catch (error) {}
};

exports.uploadInvoiceTemplateGenerationLogoController = async (req, res) => {
    /*
    #swagger.tags = ['Invoice Config']
    #swagger.description = 'Upload invoice template generation logo'
    #swagger.consumes = ['multipart/form-data']
    #swagger.parameters['id'] = {
        in: 'formData',
        required: true,
        type: 'string',
        description: 'Invoice template generation id'
    }
    #swagger.parameters['file'] = {
        in: 'formData',
        required: true,
        type: 'file',
        description: 'Invoice template generation logo'
    }
    */

    try {
        const { id } = req.body;
        const file = req.files?.file?.[0];
        if (!file) throw new Error("File is required");
        if (!id) throw new Error("Invoice template generation id is required");

        const result = await invoiceTemplateService.uploadInvoiceTemplateGenerationLogoService(
            file,
            id,
        );
        return res.status(200).json({
            success: true,
            message: "Upload invoice template generation logo successfully.",
            data: result,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: { message: error.message || "Something went wrong!" },
        });
    }
};

exports.getInvoiceViewController = async (req, res) => {
    /*
    #swagger.tags = ['Invoice Config']
    #swagger.description = 'Get invoice view'
    #swagger.parameters['invoice_display_id'] = {
        in: 'path',
        required: true,
        type: 'string',
        description: 'Invoice template generation id'
    }
    #swagger.parameters['device'] = {
        in: 'query',
        required: true,
        type: 'string',
        enum: ['web', 'mobile'],
        description: 'Device type (web, mobile)'
    }
    */

    try {
        const { invoice_display_id } = req.params;
        const device = req.query?.device || "web";

        // const invoiceDetailsRes = await invoiceTemplateGenerationService.getInvoiceTemplateGenerationDetailsByInvoiceDisplayID(invoice_display_id);
        // console.log(invoiceDetailsRes);

        // const logo_url                          = invoiceDetailsRes?.invoice_template_generation_id?.logo_url;
        // const company_header_config             = invoiceDetailsRes?.invoice_template_generation_id?.company_header_config;
        // const invoice_info_config               = invoiceDetailsRes?.invoice_template_generation_id?.invoice_info_config;
        // const bill_to_config                    = invoiceDetailsRes?.invoice_template_generation_id?.bill_to_config;
        // const lead_table_preview_config         = invoiceDetailsRes?.invoice_template_generation_id?.lead_table_preview_config;
        // const tax_summary_config                = invoiceDetailsRes?.invoice_template_generation_id?.tax_summary_config;
        // const totals_section_config             = invoiceDetailsRes?.invoice_template_generation_id?.totals_section_config;
        // const bank_details_config               = invoiceDetailsRes?.invoice_template_generation_id?.bank_details_config;
        // const terms_conditions_config           = invoiceDetailsRes?.invoice_template_generation_id?.terms_conditions_config;

        res.render("Invoice/standard-invoice", {
            invoice_display_id: invoice_display_id,
            device: device,
        });
    } catch (error) {
        console.error("Error in getInvoiceViewController:", error);

        return res.status(400).json({
            success: false,
            error: { message: error.message || "Something went wrong!" },
        });
    }
};
