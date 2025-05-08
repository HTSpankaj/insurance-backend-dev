const { SupabaseClient } = require("@supabase/supabase-js");
const moment = require("moment");

const issuanceTransactionInvoice_tableName = "issuance_transaction_invoice";
const invoice_tableName = "invoice";

class IssuanceTransactionInvoiceDatabase {
    /**
     * Constructor for initializing the UsersDatabase
     * @param {SupabaseClient} supabaseInstance - The supabase instance
     */
    constructor(supabaseInstance) {
        this.db = supabaseInstance;
    }

    async addIssuanceTransactionInvoiceDb(
        after_issuance_transaction_id,
        commission_amount,
        advisor_id,
        invoice_template_generation_id,
    ) {
        return new Promise(async (resolve, reject) => {
            const now = moment();
            const startOfMonth = now.startOf("month").format("YYYY-MM-DD");
            const endOfMonth = now.endOf("month").format("YYYY-MM-DD");

            let invoice_id = null;

            const { data: invoiceData, error: invoiceError } = await this.db
                .from(invoice_tableName)
                .select()
                .eq("advisor_id", advisor_id)
                .eq("invoice_template_generation_id", invoice_template_generation_id)
                .eq("created_at", startOfMonth)
                .eq("created_at", endOfMonth)
                .maybeSingle();

            if (invoiceData) {
                invoice_id = invoiceData?.invoice_id;
            } else if (!invoiceError) {
                const { data: invoiceCreateData, error: invoiceCreateError } = await this.db
                    .from(invoice_tableName)
                    .insert({
                        advisor_id: advisor_id,
                        invoice_template_generation_id: invoice_template_generation_id,
                    })
                    .select("*")
                    .maybeSingle();
                if (invoiceCreateData) {
                    invoice_id = invoiceCreateData?.invoice_id;
                }
                if (invoiceCreateError) {
                    resolve({
                        success: false,
                        variable: "invoiceCreateError",
                        error: invoiceCreateError,
                    });
                }
            }

            if (invoiceError) {
                resolve({
                    success: false,
                    variable: "invoiceError",
                    error: invoiceError,
                });
            }

            if (invoice_id) {
                const { data, error } = await this.db
                    .from(issuanceTransactionInvoice_tableName)
                    .insert({
                        after_issuance_transaction_id: after_issuance_transaction_id,
                        amount: commission_amount,
                        invoice_id: invoice_id,
                    })
                    .select("*")
                    .maybeSingle();
                if (data) {
                    resolve({
                        success: true,
                        data: data,
                    });
                }
                if (error) {
                    resolve({
                        success: false,
                        variable: "error",
                        error: error,
                    });
                }
            }
        });
    }

    async getInvoiceByAdvisorIdDatabase(advisor_id, pageNumber, limit, start_date, end_date) {
        try {
            const offset = (pageNumber - 1) * limit;
            let query = this.db
                .from(invoice_tableName)
                .select(`*, 
                    advisor:advisor_id(name, mobile_number, email, advisor_display_id, gstin_number, bank_details(*)),
                    product:issuance_transaction_invoice(*,
                    after_issuance_transaction_id(
                        lead_product_relation_id(
                            lead_product_id, lead_product_relation_display_id,
                            lead:lead_id(name, email, contact_number, lead_display_id),
                            product:product_id(product_name, product_display_id, sub_category_id(sub_category_id, title, category_id(category_id,title)))
                        )
                    )
                    )
                `, { count: "exact" })
                .eq("advisor_id", advisor_id);

            if (start_date && end_date) {
                query = query.gte("created_at", start_date).lte("created_at", end_date);
            }

            if (!isNaN(pageNumber) && !isNaN(limit)) {
                query = query.range(offset, offset + limit - 1);
            }

            const { data, error, count } = await query;
            if (error) throw error;
            let _data = [];
            if (data) {
                _data = data.map(item => {
                    const _m = {
                        ...item,
                        product: item?.product?.map(p => ({
                            id: p?.id,
                            amount: p?.amount,
                            created_at: p?.created_at,
                            invoice_id: p?.invoice_id,
                            paid_amount: p?.paid_amount,
    
                            lead: p?.after_issuance_transaction_id?.lead_product_relation_id?.lead,
                            product:
                                p?.after_issuance_transaction_id?.lead_product_relation_id?.product,
    
                            lead_product_id:
                                p?.after_issuance_transaction_id?.lead_product_relation_id
                                    ?.lead_product_id,
                            lead_product_relation_display_id:
                                p?.after_issuance_transaction_id?.lead_product_relation_id
                                    ?.lead_product_relation_display_id,
                        })),
                    };

                    return _m;
                })
            }
            return { data: _data, count };
        } catch (error) {
            throw new Error(`Failed to get invoice: ${error.message}`);
        }
    }

    async approveInvoiceDatabase(invoice_id) {
        try {
            const { data, error } = await this.db
                .from(invoice_tableName)
                .update({ advisor_invoice_status: "Accepted" })
                .eq("invoice_id", invoice_id)
                .select("*")
                .maybeSingle();
            if (error) throw error;
            return data;
        } catch (error) {
            throw new Error(`Failed to approve invoice: ${error.message}`);
        }
    }

    async rejectionInvoiceDatabase(invoice_id, rejection_reason) {
        try {
            const { data: getData, error: getError } = await this.db
                .from(invoice_tableName)
                .select("*")
                .eq("invoice_id", invoice_id)
                .maybeSingle();
            if (getError) throw getError;

            const { data, error } = await this.db
                .from(invoice_tableName)
                .update({
                    advisor_invoice_status: "Rejected",
                    rejection_remark: [
                        ...getData?.rejection_remark,
                        {
                            rejection_reason,
                            created_at: new Date().toISOString(),
                        },
                    ],
                })
                .eq("invoice_id", invoice_id)
                .select("*")
                .maybeSingle();
            if (error) throw error;
            return data;
        } catch (error) {
            throw new Error(`Failed to reject invoice: ${error.message}`);
        }
    }

    async getProductInvoiceForBankMisByAdvisorIdDatabase(advisor_id) {
        return new Promise(async (resolve, reject) => {
            const { data, error } = await this.db.rpc("get_product_invoice_for_bank_mis", {
                advisor_id_val: advisor_id,
            });
            if (error) {
                resolve({
                    success: false,
                    variable: "error",
                    error: error,
                });
            }
            if (data) {
                resolve({
                    success: true,
                    data: data,
                });
            }
        });
    }

    async updatePaidAmountToIssuanceTransactionInvoice(
        issuance_transaction_invoice_id,
        paid_amount,
    ) {
        return new Promise(async (resolve, reject) => {
            const { data, error } = await this.db
                .from(issuanceTransactionInvoice_tableName)
                .update({
                    paid_amount,
                })
                .eq("id", issuance_transaction_invoice_id)
                .select("*")
                .maybeSingle();
            if (error) {
                resolve({
                    success: false,
                    variable: "error",
                    error: error,
                });
            }
            if (data) {
                resolve({
                    success: true,
                    data: data,
                });
            }
        });
    }

    async invoiceStatusSettlementDatabase(invoice_id) {
        return new Promise(async (resolve, reject) => {
            const { data, error } = await this.db
                .from(invoice_tableName)
                .select("*", { count: "exact" })
                .eq("invoice_id", invoice_id)
                .maybeSingle();
            if (data) {
                let _status = null;
                if (data?.generated_amount === data?.paid_amount) {
                    _status = "Done";
                } else if (data?.generated_amount > data?.paid_amount) {
                    _status = "Partial";
                }
                if (_status) {
                    await this.db
                        .from(invoice_tableName)
                        .update({ invoice_payment_status: _status })
                        .eq("invoice_id", invoice_id);
                }
                resolve({
                    success: true,
                });
            }
            if (error) {
                resolve({
                    success: false,
                    variable: `function invoiceStatusSettlementDatabase(${invoice_id})`,
                    error: error,
                });
            }
        });
    }

    async getInvoiceDetailsByInvoiceDisplayIdDatabase(invoice_display_id) {
        try {
            const { data, error } = await this.db
                .from(invoice_tableName)
                .select(
                    `*, 
                    invoice_template_generation_id(*),
                    advisor:advisor_id(name, mobile_number, email, advisor_display_id, gstin_number, bank_details(*)),
                    product:issuance_transaction_invoice(*,
                    after_issuance_transaction_id(
                        lead_product_relation_id(
                            lead_product_id, lead_product_relation_display_id,
                            lead:lead_id(name, email, contact_number, lead_display_id),
                            product:product_id(product_name, product_display_id, sub_category_id(sub_category_id, title, category_id(category_id,title)))
                        )
                    )
                    )
                `,
                )
                .eq("invoice_display_id", invoice_display_id)
                .maybeSingle();
            if (error) throw error;
            let _data = {};
            if (data) {
                _data = {
                    ...data,
                    invoice_date: moment(data?.created_at).format(
                        data.invoice_template_generation_id.invoice_info_config.invoice_date_format,
                    ),
                    product: data?.product?.map(p => ({
                        id: p?.id,
                        amount: p?.amount,
                        created_at: p?.created_at,
                        invoice_id: p?.invoice_id,
                        paid_amount: p?.paid_amount,

                        lead: p?.after_issuance_transaction_id?.lead_product_relation_id?.lead,
                        product:
                            p?.after_issuance_transaction_id?.lead_product_relation_id?.product,

                        lead_product_id:
                            p?.after_issuance_transaction_id?.lead_product_relation_id
                                ?.lead_product_id,
                        lead_product_relation_display_id:
                            p?.after_issuance_transaction_id?.lead_product_relation_id
                                ?.lead_product_relation_display_id,
                    })),
                };
            }

            //TODO: Tax calculations
            return _data;
        } catch (error) {
            console.log(error);

            throw new Error(`Failed to get invoice Details: ${error.message}`);
        }
    }
}

module.exports = IssuanceTransactionInvoiceDatabase;
