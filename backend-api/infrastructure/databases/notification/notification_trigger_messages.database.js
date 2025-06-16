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
        const { data, error } = await this.db
            .from(NotificationTriggerListTableName)
            .select("*")
            .eq("title", title)
            .maybeSingle();
        if (data) {
            const { data: messageData, error: messageError } = await this.db
                .from(NotificationTriggerMessagesTableName)
                .select("*")
                .eq("notification_trigger_list_id", data?.id)
                .eq("is_active", true);
            if (messageData?.length > 0) {
                return {
                    messageData: messageData,
                    triggerData: data,
                };
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    async getNotificationTriggerListDatabase() {
        const { data, error } = await this.db.from(NotificationTriggerListTableName).select("*");
        if (error) throw error;
        return data;
    }

    async getNotificationTriggerMessagesDatabase() {
        const { data, error } = await this.db
            .from(NotificationTriggerMessagesTableName)
            .select("*, notification_trigger_list_id(*)")
            .order("created_at", { ascending: false });
        if (error) throw error;
        return data;
    }

    async addNotificationTriggerMessagesDatabase(
        notification_trigger_list_id,
        recipient,
        title,
        is_sms,
        is_email,
        is_whatsapp,
        email_subject,
        email_message,
        whatsapp_message,
        sms_message,
        is_active,
    ) {
        const { data: notificationTriggerListData, error: notificationTriggerListError } =
            await this.db
                .from(NotificationTriggerMessagesTableName)
                .select("*")
                .eq("id", notification_trigger_list_id)
                .eq("recipient", recipient)
                .limit(1);
        if (notificationTriggerListData?.length > 0) {
            const err = {
                message: "Message already exists with same notification trigger and recipient.",
            };
            throw err;
        } else if (notificationTriggerListError) {
            throw notificationTriggerListError;
        } else {
            const { data, error } = await this.db
                .from(NotificationTriggerMessagesTableName)
                .insert({
                    notification_trigger_list_id,
                    recipient,
                    title,
                    is_sms,
                    is_email,
                    is_whatsapp,
                    email_subject,
                    email_message,
                    whatsapp_message,
                    sms_message,
                    is_active,
                })
                .select()
                .maybeSingle();

            if (error) throw error;
            return data;
        }
    }

    async updateNotificationTriggerMessagesDatabase(
        id,
        notification_trigger_list_id,
        recipient,
        title,
        is_sms,
        is_email,
        is_whatsapp,
        email_subject,
        email_message,
        whatsapp_message,
        sms_message,
        is_active,
    ) {
        let postBody = {};
        if (notification_trigger_list_id)
            postBody.notification_trigger_list_id = notification_trigger_list_id;
        if (recipient) postBody.recipient = recipient;
        if (title) postBody.title = title;
        if (is_sms === true || is_sms === false) postBody.is_sms = is_sms;
        if (is_email === true || is_email === false) postBody.is_email = is_email;
        if (is_whatsapp === true || is_whatsapp === false) postBody.is_whatsapp = is_whatsapp;
        if (email_subject) postBody.email_subject = email_subject;
        if (email_message) postBody.email_message = email_message;
        if (whatsapp_message) postBody.whatsapp_message = whatsapp_message;
        if (sms_message) postBody.sms_message = sms_message;
        if (is_active === true || is_active === false) postBody.is_active = is_active;

        if (notification_trigger_list_id || recipient) {
            let query = this.db.from(NotificationTriggerMessagesTableName).select("*");

            if (notification_trigger_list_id) {
                query = query.eq("notification_trigger_list_id", notification_trigger_list_id);
            }
            if (recipient) {
                query = query.eq("recipient", recipient);
            }

            const { data: notificationTriggerListData, error: notificationTriggerListError } =
                await query.neq("id", id).limit(1);
            if (notificationTriggerListData?.length > 0) {
                const err = {
                    message: "Notification trigger already exists with same recipient.",
                };
                throw err;
            } else if (notificationTriggerListError) {
                throw notificationTriggerListError;
            }
        }

        const { data, error } = await this.db
            .from(NotificationTriggerMessagesTableName)
            .update(postBody)
            .eq("id", id)
            .select()
            .maybeSingle();

        if (error) throw error;
        return data;
    }

    async deleteNotificationTriggerMessagesDatabase(id) {
        const { data, error } = await this.db
            .from(NotificationTriggerMessagesTableName)
            .delete()
            .eq("id", id)
            .select()
            .maybeSingle();
        if (error) throw error;
        return data;
    }
}

module.exports = NotificationTriggerMessagesDatabase;
