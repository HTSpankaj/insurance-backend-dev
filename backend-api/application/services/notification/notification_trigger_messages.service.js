const { SupabaseClient } = require("@supabase/supabase-js");
const NotificationTriggerMessagesDatabase = require("../../../infrastructure/databases/notification/notification_trigger_messages.database");

class NotificationTriggerMessagesService {
    /**
     * Constructor for initializing the UserService
     * @param {SupabaseClient} supabaseInstance - The supabase instance
     */
    constructor(supabaseInstance) {
        this.notificationTriggerMessagesDatabase = new NotificationTriggerMessagesDatabase(
            supabaseInstance,
        );
    }

    async getNotificationTriggerListService() {
        return await this.notificationTriggerMessagesDatabase.getNotificationTriggerListDatabase();
    }

    async getNotificationTriggerMessagesService() {
        return await this.notificationTriggerMessagesDatabase.getNotificationTriggerMessagesDatabase();
    }

    async addNotificationTriggerMessagesService(
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
        return await this.notificationTriggerMessagesDatabase.addNotificationTriggerMessagesDatabase(
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
        );
    }
    async updateNotificationTriggerMessagesService(
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
        return await this.notificationTriggerMessagesDatabase.updateNotificationTriggerMessagesDatabase(
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
        );
    }

    async deleteNotificationTriggerMessagesService(id) {
        return await this.notificationTriggerMessagesDatabase.deleteNotificationTriggerMessagesDatabase(
            id,
        );
    }
}

module.exports = NotificationTriggerMessagesService;
