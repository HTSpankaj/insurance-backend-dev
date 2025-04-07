const cron = require("node-cron");
const moment = require("moment");

const { supabaseInstance } = require("../supabase-db");
const AfterIssuanceTransactionDatabase = require("../infrastructure/databases/issuance/after_issuance_transaction.database");
const IssuanceTransactionInvoiceDatabase = require("../infrastructure/databases/issuance/issuance_transaction_invoice.database");

const afterIssuanceTransactionDatabase = new AfterIssuanceTransactionDatabase(supabaseInstance);
const issuanceTransactionInvoiceDatabase = new IssuanceTransactionInvoiceDatabase(supabaseInstance);

cron.schedule("0 0 20 * *", () => {
    console.log("Invoice creation cron job is running on date time : ", new Date());
    createInvoice();
});

async function createInvoice() {
    const { data: transactions, error } =
        await afterIssuanceTransactionDatabase.getAfterIssuanceTransactionDatabase();

    console.log("Create invoice Function: Fetched transactions:", transactions);

    if (error) {
        console.error("Create invoice Function: Error fetching transactions:", error);
        return;
    }

    for (const tx of transactions) {
        //* 1. check invoice creation is complete or not.
        if (tx.current_number_invoice_created >= tx.actual_number_transaction) continue;

        //* 2. Ensure commission_start_date < now
        const now = moment();
        const commissionStart = moment(tx.commission_start_date);
        if (now.isBefore(commissionStart, "month")) continue;

        //* 3. Get latest invoice
        const latestInvoice = tx.issuance_transaction_invoice?.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at),
        )[0];

        const lastInvoiceDate = latestInvoice ? moment(latestInvoice.created_at) : null;

        let shouldCreate = false;

        if (!lastInvoiceDate) {
            // First invoice: ensure enough time passed since commission_start_date
            const diffMonths = now.diff(commissionStart, "months");
            shouldCreate = checkByPayout(tx.payout_type, diffMonths);
        } else {
            // Prevent invoice in same month
            const isSameMonth =
                now.isSame(lastInvoiceDate, "month") && now.isSame(lastInvoiceDate, "year");
            if (isSameMonth) continue;

            const diffMonths = now.diff(commissionStart, "months");
            const expectedInvoices = getExpectedInvoiceCount(tx.payout_type, diffMonths);

            if (tx.current_number_invoice_created < expectedInvoices) {
                shouldCreate = true;
            }
        }

        if (!shouldCreate) continue;

        //* 4. Create invoice
        const { data: invoice, error: insertError } =
            await issuanceTransactionInvoiceDatabase.addIssuanceTransactionInvoiceDb(tx.id);

        if (insertError) {
            console.error(
                `Create invoice Function: Failed to insert invoice for transaction ${tx.id}:`,
                insertError,
            );
            continue;
        }

        //* 5. Update current_number_invoice_created
        const { error: updateError } =
            await afterIssuanceTransactionDatabase.updateAfterIssuanceTransactionDatabase(
                tx.current_number_invoice_created + 1,
                tx.id,
            );

        if (updateError) {
            console.error(
                `Create invoice Function: Failed to update transaction ${tx.id}:`,
                updateError,
            );
        } else {
            console.log(`✅ Invoice successfully created for transaction ${tx.id}`);
        }
    }
}

function checkByPayout(payoutType, diffMonths) {
    switch (payoutType) {
        case "Monthly":
            return diffMonths >= 1;
        case "Quarterly":
            return diffMonths >= 3;
        case "HalfYearly":
        case "Half-Yearly":
            return diffMonths >= 6;
        case "Annually":
        case "Yearly":
            return diffMonths >= 12;
        case "One Time":
            return diffMonths >= 0;
        default:
            return false;
    }
}

function getExpectedInvoiceCount(payoutType, diffMonths) {
    switch (payoutType) {
        case "Monthly":
            return diffMonths + 1;
        case "Quarterly":
            return Math.floor(diffMonths / 3) + 1;
        case "HalfYearly":
        case "Half-Yearly":
            return Math.floor(diffMonths / 6) + 1;
        case "Annually":
        case "Yearly":
            return Math.floor(diffMonths / 12) + 1;
        case "One Time":
            return 1;
        default:
            return 0;
    }
}
