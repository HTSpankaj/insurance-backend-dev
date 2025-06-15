const NotificationTriggerMessagesService = require("../../../application/services/notification/notification_trigger_messages.service.js");
const { supabaseInstance } = require("../../../supabase-db/index.js");

const notificationTriggerMessagesService = new NotificationTriggerMessagesService(supabaseInstance);

exports.getNotificationTriggerListController = async (req, res) => {
    /*
    #swagger.tags = ['Notification']
    #swagger.description = 'Get notification trigger list'
    */
    try {
        const result = await notificationTriggerMessagesService.getNotificationTriggerListService();
        return res.status(200).json({
            success: true,
            message: "Get advisor access config successfully.",
            data: result,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: { message: error.message || "Something went wrong!" },
        });
    }
};

exports.getNotificationTriggerMessagesController = async (req, res) => {
    /*
    #swagger.tags = ['Notification']
    #swagger.description = 'Get notification trigger messages'
    */
    try {
        const result =
            await notificationTriggerMessagesService.getNotificationTriggerMessagesService();
        return res.status(200).json({
            success: true,
            message: "Get notification trigger messages successfully.",
            data: result,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: { message: error.message || "Something went wrong!" },
        });
    }
};

exports.addNotificationTriggerMessagesController = async (req, res) => {
    /*
    #swagger.tags = ['Notification']
    #swagger.description = 'Add notification trigger messages'
    #swagger.parameters['body'] = {
        in: 'body',
        schema: {
            notification_trigger_list_id: "",
            recipient: "",
            title: "",
            is_sms: "",
            is_email: "",
            is_whatsapp: "",
            email_subject: "",
            email_message: "",
            whatsapp_message: "",
            sms_message: "",
            is_active: true
        }
    }
    */
    try {
        const {
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
        } = req.body;
        const result =
            await notificationTriggerMessagesService.addNotificationTriggerMessagesService(
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
        return res.status(200).json({
            success: true,
            message: "Add notification trigger messages successfully.",
            data: result,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: { message: error.message || "Something went wrong!" },
        });
    }
};

exports.updateNotificationTriggerMessagesController = async (req, res) => {
    /*
    #swagger.tags = ['Notification']
    #swagger.description = 'Update notification trigger messages'
    #swagger.parameters['body'] = {
        in: 'body',
        schema: {
            id: "",
            notification_trigger_list_id: "",
            recipient: "",
            title: "",
            is_sms: "",
            is_email: "",
            is_whatsapp: "",
            email_subject: "",
            email_message: "",
            whatsapp_message: "",
            sms_message: "",
            is_active: true
        }
    }
    */

    try {
        const {
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
        } = req.body;
        const result =
            await notificationTriggerMessagesService.updateNotificationTriggerMessagesService(
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
        return res.status(200).json({
            success: true,
            message: "Update notification trigger messages successfully.",
            data: result,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: { message: error.message || "Something went wrong!" },
        });
    }
};

exports.deleteNotificationTriggerMessagesController = async (req, res) => {
    /*
    #swagger.tags = ['Notification']
    #swagger.description = 'Delete notification trigger messages'
    #swagger.parameters['body'] = {
        in: 'body',
        schema: {
            id: ""
        }
    }
    */
    try {
        const { id } = req.body;
        const result =
            await notificationTriggerMessagesService.deleteNotificationTriggerMessagesService(id);
        return res.status(200).json({
            success: true,
            message: "Delete notification trigger messages successfully.",
            data: result,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            error: { message: error.message || "Something went wrong!" },
        });
    }
};
