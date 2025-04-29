const cron = require("node-cron");
const moment = require("moment");

const { supabaseInstance } = require("../supabase-db");


supabaseInstance.channel('invoice-node-scheduler')
.on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'countries' }, logMethod)
.on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'countries' }, logMethod)
.subscribe()

function logMethod() {
    
}


cron.schedule("0 0 20 * *", () => {
    console.log("Invoice creation cron job is running on date time : ", new Date());
});