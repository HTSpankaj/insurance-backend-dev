const cron = require("node-cron");
const { supabaseInstance } = require("../../supabase-db");
const { createInvoiceSchedularLogic } = require("./invoiceCreationLogic");

let nodeCronInstances = [];
let schedulerRestartTimeout = null;

supabaseInstance
    .channel("invoice-node-scheduler")
    .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "invoice_scheduler_config" },
        debounceRestartScheduler,
    )
    .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "invoice_scheduler_config" },
        debounceRestartScheduler,
    )
    .subscribe();

if (nodeCronInstances.length === 0) {
    restartScheduler();
}

function debounceRestartScheduler() {
    if (schedulerRestartTimeout) clearTimeout(schedulerRestartTimeout);
    schedulerRestartTimeout = setTimeout(() => restartScheduler(), 5000);
}

function restartScheduler() {
    console.log("Restarting scheduler at:", new Date().toLocaleString());

    if (nodeCronInstances.length > 0) {
        console.log("Stopping  crpn jobs. Count:", nodeCronInstances.length);
        nodeCronInstances.forEach(instance => instance?.stop());
        nodeCronInstances = [];
        console.log("All cron job stopped.");
    }

    supabaseInstance
        .from("invoice_scheduler_config")
        .select("*")
        .eq("is_active", true)
        .eq("is_delete", false)
        .then(res => {
            if (res.error) {
                console.error("Error fetching scheduler config:", res.error);
                return;
            }

            res.data.forEach(item => {
                const [hour, minute, second] = item.time?.split(":") || [];
                const dayOfMonth = item.date;

                if (
                    hour === undefined ||
                    minute === undefined ||
                    second === undefined ||
                    isNaN(dayOfMonth)
                ) {
                    console.warn(`Invalid schedule config for item ID: ${item.id}`);
                    return;
                }

                const cronExpression = `${second} ${minute} ${hour} ${dayOfMonth} * *`;

                try {
                    const cronInstance = cron.schedule(cronExpression, () => {
                        logMethod(cronExpression);
                        //TODO: Call herer invoice creation logic
                        createInvoiceSchedularLogic();
                    });

                    nodeCronInstances.push(cronInstance);
                    console.log("Scheduled cron job:", cronExpression);
                } catch (e) {
                    console.error(`Failed to schedule cron for item ID ${item.id}:`, e.message);
                }
            });
        })
        .catch(err => {
            console.error("Supabase query error:", err);
        });
}

function logMethod(cronExpression) {
    console.log(
        "Invoice creation cron job is running on date/time:",
        cronExpression,
        "--",
        new Date().toLocaleString(),
    );
}
