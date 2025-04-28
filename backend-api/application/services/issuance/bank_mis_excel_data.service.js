const AdvisorDatabase = require("../../../infrastructure/databases/advisor/advisor.database");
const BankMisDatabase = require("../../../infrastructure/databases/issuance/bank_mis.database");
const IssuanceTransactionInvoiceDatabase = require("../../../infrastructure/databases/issuance/issuance_transaction_invoice.database");

class BankMisExcelDataService {
    constructor(supabaseInstance) {
        this.advisorDatabase = new AdvisorDatabase(supabaseInstance);
        this.issuanceTransactionInvoiceDatabase = new IssuanceTransactionInvoiceDatabase(
            supabaseInstance,
        );
        this.bankMisDatabase = new BankMisDatabase(supabaseInstance);
    }

    async addBankMisExcelDataInBulkDatabase(list = [], transaction_created_by_user_id) {
        let error_result = new Set(),
            success_count = 0;

        let invoiceStatusSettlement = new Set();

        for (const element of list) {
            console.log(`~~~~~~~~~~~~~~~~  row_number: ${element.row_number} ~~~~~~~~~~~~~~~~~~~~`);
            element.transaction_created_by_user_id = transaction_created_by_user_id;

            const advisor = await this.advisorDatabase.getAdvisorDetailsFromDisplayIdDatabase(
                element.advisor_id,
            );
            if (!advisor) {
                error_result.add({
                    data: element,
                    message: "Advisor not found, please check Advisor ID.",
                });
            }

            const advisorInvoiceList =
                await this.issuanceTransactionInvoiceDatabase.getProductInvoiceForBankMisByAdvisorIdDatabase(
                    advisor.advisor_id,
                );
            if (!advisorInvoiceList.success) {
                error_result.add({
                    data: element,
                    message: "Advisor invoice not found, please check Advisor ID.",
                });
            }

            const productInvoiceSorted = advisorInvoiceList?.data?.sort(
                (a, b) => new Date(a.iti_created_at) - new Date(b.iti_created_at),
            );
            let updatedInvoiceList = [];
            let paidExcelAmount = element.commission_paid || 0;

            for (const invoiceElement of productInvoiceSorted) {
                if (paidExcelAmount > 0) {
                    const needAmount = invoiceElement?.iti_amount - invoiceElement?.iti_paid_amount;
                    let goToPaidAmount = 0;
                    if (needAmount > paidExcelAmount) {
                        goToPaidAmount = paidExcelAmount;
                        paidExcelAmount = 0;
                    } else {
                        goToPaidAmount = needAmount;
                        paidExcelAmount = paidExcelAmount - needAmount;
                    }

                    if (goToPaidAmount > 0) {
                        updatedInvoiceList.push({
                            ...invoiceElement,
                            goToPaidAmount,
                        });
                    }
                } else {
                    continue;
                }
                invoiceStatusSettlement.add(invoiceElement.i_invoice_id);
            }

            if (updatedInvoiceList.length > 0) {
                const addBankMisExcelDataAndUpdateInvoiceServiceRes =
                    await this.addBankMisExcelDataAndUpdateInvoiceService(
                        element,
                        transaction_created_by_user_id,
                        updatedInvoiceList,
                    );
                if (!addBankMisExcelDataAndUpdateInvoiceServiceRes.success) {
                    error_result.add({
                        data: element,
                        message: addBankMisExcelDataAndUpdateInvoiceServiceRes.error,
                    });
                }
            }

            if (paidExcelAmount > 0) {
                console.log("~~~~~~~~~~~~~~~  Extra Amount -- start ~~~~~~~~~~~~~~~~");
                console.log("Extra Amount:", paidExcelAmount);
                console.log("element:", element);
                console.log("~~~~~~~~~~~~~~~  Extra Amount -- end ~~~~~~~~~~~~~~~~~~");
            }
            success_count++;
        }

        if (invoiceStatusSettlement.size > 0) {
            await this.invoiceStatusSettlementService(Array.from(invoiceStatusSettlement));
        }

        return {
            success_count,
            total: list.length,

            error_result: Array.from(error_result),
            error_count: error_result.size,
        };
    }

    async addBankMisExcelDataAndUpdateInvoiceService(
        bankMisData,
        transaction_created_by_user_id,
        issuance_transaction_invoice = [],
    ) {
        return new Promise(async (resolve, reject) => {
            // TODO: Insert excel data in "bank_mis_excel_data" table. ==== addBankMisExcelDataDatabase
            const addBankMisExcelDataDatabaseResponse =
                await this.bankMisDatabase.addBankMisExcelDataDatabase({
                    ...bankMisData,
                    transaction_created_by_user_id,
                });
            if (!addBankMisExcelDataDatabaseResponse.success) {
                return resolve({
                    success: false,
                    variable: "addBankMisExcelDataDatabaseResponse",
                    error: addBankMisExcelDataDatabaseResponse.error,
                });
            }

            // TODO: LOOP on issuance_transaction_invoice table and update invoice data.
            for (const invoiceObj of issuance_transaction_invoice) {
                // TODO: update "issuance_transaction_invoice" paid_amount column.
                const itiUpdateRes =
                    await this.issuanceTransactionInvoiceDatabase.updatePaidAmountToIssuanceTransactionInvoice(
                        invoiceObj?.iti_id,
                        invoiceObj?.goToPaidAmount,
                    );
                if (!itiUpdateRes.success) {
                    console.log({
                        success: false,
                        variable: "itiUpdateRes",
                        error: itiUpdateRes.error,
                    });
                    continue;
                }
                // TODO: insert "invoice_bank_mis_relation". ==== addInvoiceBankMisRelationDatabase
                const addInvoiceBankMisRelationDatabaseResponse =
                    await this.bankMisDatabase.addInvoiceBankMisRelationDatabase(
                        invoiceObj?.iti_id,
                        addBankMisExcelDataDatabaseResponse?.data?.id,
                        invoiceObj?.goToPaidAmount,
                    );
                if (!addInvoiceBankMisRelationDatabaseResponse.success) {
                    console.log({
                        success: false,
                        variable: "addInvoiceBankMisRelationDatabaseResponse",
                        error: addInvoiceBankMisRelationDatabaseResponse.error,
                    });
                    continue;
                }
            }
            resolve({
                success: true,
            });
        });
    }

    async invoiceStatusSettlementService(invoice_ids) {
        return new Promise(async (resolve, reject) => {
            console.log("~~~~~~~~~~~~~~ invoiceStatusSettlementService ~~~~~~~~~~~~~");

            for (const invoice_id of invoice_ids) {
                const invoiceStatusSettlementRes =
                    await this.issuanceTransactionInvoiceDatabase.invoiceStatusSettlementDatabase(
                        invoice_id,
                    );
                if (!invoiceStatusSettlementRes.success) {
                    console.log({
                        success: false,
                        variable: "invoiceStatusSettlementRes",
                        error: invoiceStatusSettlementRes.error,
                    });
                    continue;
                }
            }
            resolve({
                success: true,
            });
        });
    }
}

module.exports = BankMisExcelDataService;

// error_result.add({
//     error: product?.error,
//     data: element,
//     message: "Product not found.",
// });

// iti_id
// iti_after_issuance_transaction_id
// iti_amount
// iti_paid_amount
// iti_created_at

// i_invoice_id
// i_generated_amount
// i_paid_amount
