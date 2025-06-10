const { SupabaseClient } = require("@supabase/supabase-js");

const NotificationTriggerListTableName = "notification_trigger_list";
const NotificationTriggerMessagesTableName = "notification_trigger_messages";

class NotificationTriggerMessagesDatabase {
    /**
     * Constructor for initializing the UsersDatabase
     * @param {SupabaseClient} supabaseInstance - The supabase instance
     */
    constructor(supabaseInstance) {
        this.db = supabaseInstance;
    }

    async getNotificationTriggerMessagesByTitle(title) {
        const { data, error } = await this.db.from(NotificationTriggerListTableName).select("*").eq("title", title).maybeSingle();
        if (data) {
            const { data: messageData, error: messageError } = await this.db.from(NotificationTriggerMessagesTableName).select("*").eq("notification_trigger_list_id", data?.id).eq("is_active", true);
            if (messageData?.length > 0) {
                return {
                    messageData: messageData,
                    triggerData: data
                };
            } else {
                return null;
                
            }
        } else {
            return null;
        }
    }

}

module.exports = NotificationTriggerMessagesDatabase;
