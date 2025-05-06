const { body } = require("express-validator");
const { validateClientParametersAndSendResponse } = require("../validator");

const invoiceTemplateGenerationValidator =  [
    body("title").isString().notEmpty().withMessage("Template name is required"),
    // === company_header_config ===
    body("company_header_config.company_name").isString().notEmpty().withMessage("company_name is required"),
    body("company_header_config.company_address").isString().optional(),
    body("company_header_config.phone_number").isString().optional(),
    body("company_header_config.email_address").isEmail().withMessage("Invalid email_address").optional(),
    body("company_header_config.gstin_number").isString().optional(),
  
    // === invoice_info_config ===
    body("invoice_info_config.invoice_title").isString().notEmpty().withMessage("invoice_title is required"),
    body("invoice_info_config.invoice_prefix").isString().optional(),
    body("invoice_info_config.invoice_date_format").isString().optional(),
    body("invoice_info_config.invoice_date").isISO8601().withMessage("invoice_date must be a valid date").optional(),
    body("invoice_info_config.due_date").isISO8601().withMessage("due_date must be a valid date").optional(),
    body("invoice_info_config.payment_terms").isString().optional(),
  
    // === bill_to_config ===
    body("bill_to_config.customer_name").isBoolean().withMessage("customer_name is required"),
    body("bill_to_config.billing_address").isBoolean().withMessage("billing_address is required"),
    body("bill_to_config.shipping_address").isBoolean().withMessage("shipping_address is required"),
    body("bill_to_config.phone_number").isBoolean().withMessage("phone_number is required"),
    body("bill_to_config.email_address").isBoolean().withMessage("email_address is required"),
    body("bill_to_config.gstin_number").isBoolean().withMessage("gstin_number is required"),
  
    // === lead_table_preview_config ===
    body("lead_table_preview_config").isArray().withMessage("lead_table_preview_config must be an array"),
    body("lead_table_preview_config.*.table_name").isString().notEmpty().withMessage("table_name is required"),
    body("lead_table_preview_config.*.column_name").isString().notEmpty().withMessage("column_name is required"),
  
    // === tax_summary_config ===
    body("tax_summary_config.is_enable_taxes").isBoolean(),
    body("tax_summary_config.CGST.is_enable").isBoolean(),
    body("tax_summary_config.CGST.value").isFloat({ min: 0 }),
    body("tax_summary_config.SGST.is_enable").isBoolean(),
    body("tax_summary_config.SGST.value").isFloat({ min: 0 }),
    body("tax_summary_config.IGST.is_enable").isBoolean(),
    body("tax_summary_config.IGST.value").isFloat({ min: 0 }),
  
    // === totals_section_config ===
    body("totals_section_config.is_show_subtotal").isBoolean(),
    body("totals_section_config.is_show_total_tax_amount").isBoolean(),
    body("totals_section_config.is_show_grand_total").isBoolean(),
  
    // === bank_details_config ===
    body("bank_details_config.bank_name").isString().notEmpty().withMessage("bank_name is required"),
    body("bank_details_config.account_number").isString().notEmpty().withMessage("account_number is required"),
    body("bank_details_config.account_name").isString().notEmpty().withMessage("account_name is required"),
    body("bank_details_config.ifsc_code").matches(/^[A-Z]{4}0[A-Z0-9]{6}$/).withMessage("Invalid IFSC code"),
    body("bank_details_config.uip_id").isString().optional(),
  
    // === terms_conditions_config ===
    body("terms_conditions_config.payment_terms").isString().optional(),
    body("terms_conditions_config.thank_you_message").isString().optional(),
    
    validateClientParametersAndSendResponse,
];

const updateInvoiceTemplateGenerationValidator =  [
    body("id").isUUID().withMessage("id must be a valid UUID."),
    body("title").isString().notEmpty().withMessage("Template name is required"),
    // === company_header_config ===
    body("company_header_config.company_name").isString().notEmpty().withMessage("company_name is required"),
    body("company_header_config.company_address").isString().optional(),
    body("company_header_config.phone_number").isString().optional(),
    body("company_header_config.email_address").isEmail().withMessage("Invalid email_address").optional(),
    body("company_header_config.gstin_number").isString().optional(),
  
    // === invoice_info_config ===
    body("invoice_info_config.invoice_title").isString().notEmpty().withMessage("invoice_title is required"),
    body("invoice_info_config.invoice_prefix").isString().optional(),
    body("invoice_info_config.invoice_date_format").isString().optional(),
    body("invoice_info_config.invoice_date").isISO8601().withMessage("invoice_date must be a valid date").optional(),
    body("invoice_info_config.due_date").isISO8601().withMessage("due_date must be a valid date").optional(),
    body("invoice_info_config.payment_terms").isString().optional(),
  
    // === bill_to_config ===
    body("bill_to_config.customer_name").isBoolean().withMessage("customer_name is required"),
    body("bill_to_config.billing_address").isBoolean().withMessage("billing_address is required"),
    body("bill_to_config.shipping_address").isBoolean().withMessage("shipping_address is required"),
    body("bill_to_config.phone_number").isBoolean().withMessage("phone_number is required"),
    body("bill_to_config.email_address").isBoolean().withMessage("email_address is required"),
    body("bill_to_config.gstin_number").isBoolean().withMessage("gstin_number is required"),
  
    // === lead_table_preview_config ===
    body("lead_table_preview_config").isArray().withMessage("lead_table_preview_config must be an array"),
    body("lead_table_preview_config.*.table_name").isString().notEmpty().withMessage("table_name is required"),
    body("lead_table_preview_config.*.column_name").isString().notEmpty().withMessage("column_name is required"),
  
    // === tax_summary_config ===
    body("tax_summary_config.is_enable_taxes").isBoolean(),
    body("tax_summary_config.CGST.is_enable").isBoolean(),
    body("tax_summary_config.CGST.value").isFloat({ min: 0 }),
    body("tax_summary_config.SGST.is_enable").isBoolean(),
    body("tax_summary_config.SGST.value").isFloat({ min: 0 }),
    body("tax_summary_config.IGST.is_enable").isBoolean(),
    body("tax_summary_config.IGST.value").isFloat({ min: 0 }),
  
    // === totals_section_config ===
    body("totals_section_config.is_show_subtotal").isBoolean(),
    body("totals_section_config.is_show_total_tax_amount").isBoolean(),
    body("totals_section_config.is_show_grand_total").isBoolean(),
  
    // === bank_details_config ===
    body("bank_details_config.bank_name").isString().notEmpty().withMessage("bank_name is required"),
    body("bank_details_config.account_number").isString().notEmpty().withMessage("account_number is required"),
    body("bank_details_config.account_name").isString().notEmpty().withMessage("account_name is required"),
    body("bank_details_config.ifsc_code").matches(/^[A-Z]{4}0[A-Z0-9]{6}$/).withMessage("Invalid IFSC code"),
    body("bank_details_config.uip_id").isString().optional(),
  
    // === terms_conditions_config ===
    body("terms_conditions_config.payment_terms").isString().optional(),
    body("terms_conditions_config.thank_you_message").isString().optional(),
    
    validateClientParametersAndSendResponse,
];

module.exports = { invoiceTemplateGenerationValidator,updateInvoiceTemplateGenerationValidator };
