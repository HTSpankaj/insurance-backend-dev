const NotificationTriggerMessagesDatabase = require("../../infrastructure/databases/notification/notification_trigger_messages.database");
const { sendBrevoEmailMessage } = require("../../integration/brevo/email.brevo.integration");
const { sendBrevoSmsMessage } = require("../../integration/brevo/sms.brevo.integration");
const { sendBrevoWhatsAppMessage } = require("../../integration/brevo/whatsapp.brevo.integration");

class AdvisorAssignNotificationService {
    /**
     * Constructor for initializing the AdvisorAccessService
     * @param {SupabaseClient} supabaseInstance - The Supabase instance
     */
    constructor(supabaseInstance) {
        this.notificationTriggerMessagesDatabase = new NotificationTriggerMessagesDatabase(
            supabaseInstance,
        );
    }

    // CategoryName, ProductName, LeadName
    async sendAutoAdvisorAssignNotification(relationshipManagerEmail, relationshipManagerMobileNumber, relationshipManagerName, advisorMobileNumber, variableValuesObject) {
        const getNotificationTriggerMessagesByTitleRes =
            await this.notificationTriggerMessagesDatabase.getNotificationTriggerMessagesByTitle(
                "Auto-Assign Lead",
            );
        // console.log("getNotificationTriggerMessagesByTitleRes", getNotificationTriggerMessagesByTitleRes);

        if (getNotificationTriggerMessagesByTitleRes?.messageData) {
            const triggerData = getNotificationTriggerMessagesByTitleRes?.triggerData;
            //! loop messageData

            for (const messageData of getNotificationTriggerMessagesByTitleRes?.messageData) {
                //* -- Email
                if (messageData?.is_email) {
                    const emailContent = replaceVariables(
                        messageData?.email_message,
                        triggerData?.variable_list,
                        variableValuesObject,
                    );
                    console.log("emailContent", emailContent);

                    const sendBrevoEmailMessageRes = await sendBrevoEmailMessage(
                        messageData?.email_subject,
                        emailContent,
                        [{ email: relationshipManagerEmail, name: relationshipManagerName }],
                    );
                    console.log("sendBrevoEmailMessageRes", sendBrevoEmailMessageRes);
                }
                
                //* -- SMS
                if (messageData?.is_sms) {
                    const smsContent = replaceVariables(
                        messageData?.sms_message,
                        triggerData?.variable_list,
                        variableValuesObject,
                    );
                    console.log("smsContent", smsContent);

                    const sendBrevoSmsMessageRes = await sendBrevoSmsMessage(relationshipManagerMobileNumber, smsContent);
                    console.log("sendBrevoSmsMessageRes", sendBrevoSmsMessageRes);
                }

                //* -- WhatsApp
                if (messageData?.is_whatsapp) {
                    const whatsappContent = replaceVariables(
                        messageData?.whatsapp_message,
                        triggerData?.variable_list,
                        variableValuesObject,
                    );
                    console.log("whatsappContent", whatsappContent);

                    const sendBrevoWhatsAppMessageRes = await sendBrevoWhatsAppMessage(whatsappContent, relationshipManagerMobileNumber);
                    console.log("sendBrevoWhatsAppMessageRes", sendBrevoWhatsAppMessageRes);
                }
            }
        }
    }

    async sendManualAdvisorAssignNotification(relationshipManagerEmail, relationshipManagerMobileNumber, relationshipManagerName, advisorMobileNumber, variableValuesObject) {
        const getNotificationTriggerMessagesByTitleRes =
            await this.notificationTriggerMessagesDatabase.getNotificationTriggerMessagesByTitle(
                "Manual-Assign Lead",
            );
        // console.log("getNotificationTriggerMessagesByTitleRes", getNotificationTriggerMessagesByTitleRes);

        if (getNotificationTriggerMessagesByTitleRes?.messageData) {
            const triggerData = getNotificationTriggerMessagesByTitleRes?.triggerData;
            //! loop messageData

            for (const messageData of getNotificationTriggerMessagesByTitleRes?.messageData) {
                //* -- Email
                if (messageData?.is_email) {
                    const emailContent = replaceVariables(
                        messageData?.email_message,
                        triggerData?.variable_list,
                        variableValuesObject,
                    );
                    console.log("emailContent", emailContent);

                    const sendBrevoEmailMessageRes = await sendBrevoEmailMessage(
                        messageData?.email_subject,
                        emailContent,
                        [{ email: relationshipManagerEmail, name: relationshipManagerName }],
                    );
                    console.log("sendBrevoEmailMessageRes", sendBrevoEmailMessageRes);
                }
                
                //* -- SMS
                if (messageData?.is_sms) {
                    const smsContent = replaceVariables(
                        messageData?.sms_message,
                        triggerData?.variable_list,
                        variableValuesObject,
                    );
                    console.log("smsContent", smsContent);

                    const sendBrevoSmsMessageRes = await sendBrevoSmsMessage(relationshipManagerMobileNumber, smsContent);
                    console.log("sendBrevoSmsMessageRes", sendBrevoSmsMessageRes);
                }

                //* -- WhatsApp
                if (messageData?.is_whatsapp) {
                    const whatsappContent = replaceVariables(
                        messageData?.whatsapp_message,
                        triggerData?.variable_list,
                        variableValuesObject,
                    );
                    console.log("whatsappContent", whatsappContent);

                    const sendBrevoWhatsAppMessageRes = await sendBrevoWhatsAppMessage(whatsappContent, relationshipManagerMobileNumber);
                    console.log("sendBrevoWhatsAppMessageRes", sendBrevoWhatsAppMessageRes);
                }
            }
        }
    }
}

module.exports = AdvisorAssignNotificationService;

// message = "Hello, your OTP is {{OTP}}"
// variableList = [{"title": "OTP", "variable_name": "OTP"}]
// valueList = {"OTP": "1234"}
function replaceVariables(message, variableList, valueList) {
    for (let i = 0; i < variableList.length; i++) {
        const variable = variableList[i];
        const variableName = variable.variable_name;
        const value = valueList[variableName];
        message = message.replace(`{{${variableName}}}`, value);
    }
    return message;
}
