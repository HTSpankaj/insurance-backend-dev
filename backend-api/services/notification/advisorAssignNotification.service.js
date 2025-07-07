const { waboConfig } = require("../../configs/wabo.config");
const NotificationTriggerMessagesDatabase = require("../../infrastructure/databases/notification/notification_trigger_messages.database");
const { sendBrevoEmailMessage } = require("../../integration/brevo/email.brevo.integration");
const { sendBrevoSmsMessage } = require("../../integration/brevo/sms.brevo.integration");
const { sendBrevoWhatsAppMessage } = require("../../integration/brevo/whatsapp.brevo.integration");
const { sendWaboWhatsAppMessage } = require("../../integration/wabo/whatsapp.wabo.integration");
const { replaceVariables } = require("./functions");

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
    async sendAutoAdvisorAssignNotification(
        relationshipManagerMobileNumber,
        relationshipManagerName,
        advisorMobileNumber,
        variableValuesObject,
    ) {
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
                // if (messageData?.is_email) {
                //     const emailContent = replaceVariables(
                //         messageData?.email_message,
                //         triggerData?.variable_list,
                //         variableValuesObject,
                //     );
                //     console.log("emailContent", emailContent);

                //     const sendBrevoEmailMessageRes = await sendBrevoEmailMessage(
                //         messageData?.email_subject,
                //         emailContent,
                //         [{ email: relationshipManagerEmail, name: relationshipManagerName }],
                //     );
                //     console.log("sendBrevoEmailMessageRes", sendBrevoEmailMessageRes);
                // }

                //* -- SMS
                if (messageData?.is_sms) {
                    const smsContent = replaceVariables(
                        messageData?.sms_message,
                        triggerData?.variable_list,
                        variableValuesObject,
                    );
                    console.log("smsContent", smsContent);

                    const sendBrevoSmsMessageRes = await sendBrevoSmsMessage(
                        relationshipManagerMobileNumber,
                        smsContent,
                    );
                    console.log("sendBrevoSmsMessageRes", sendBrevoSmsMessageRes);
                }

                //* -- WhatsApp
                if (messageData?.is_whatsapp) {
                    const bodyComponents = [
                        {
                            "type": "text",
                            "text": variableValuesObject?.LeadLocation?.toString(),
                        },
                        {
                            "type": "text",
                            "text": variableValuesObject?.LeadName?.toString(),
                        },
                        {
                            "type": "text",
                            "text": variableValuesObject?.LeadId?.toString(),
                        },
                        {
                            "type": "text",
                            "text": variableValuesObject?.LeadContactNumber?.toString(),
                        },
                        {
                            "type": "text",
                            "text": variableValuesObject?.ProductName?.toString() || variableValuesObject?.CategoryName?.toString(),
                        },
                    ];
                    const otherComponents = [];

                    const sendWaboWhatsAppMessageRes = await sendWaboWhatsAppMessage(
                        waboConfig.leadAssignedToRmTemplate,
                        "+91" + relationshipManagerMobileNumber,
                        bodyComponents,
                        otherComponents,
                    );
                    console.log("sendWaboWhatsAppMessageRes", sendWaboWhatsAppMessageRes);
                }
            }
        }
    }

    async sendManualAdvisorAssignNotification(
        relationshipManagerEmail,
        relationshipManagerMobileNumber,
        relationshipManagerName,
        advisorMobileNumber,
        variableValuesObject,
    ) {
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

                    const sendBrevoSmsMessageRes = await sendBrevoSmsMessage(
                        relationshipManagerMobileNumber,
                        smsContent,
                    );
                    console.log("sendBrevoSmsMessageRes", sendBrevoSmsMessageRes);
                }

                //* -- WhatsApp
                // if (messageData?.is_whatsapp) {
                //     const whatsappContent = replaceVariables(
                //         messageData?.whatsapp_message,
                //         triggerData?.variable_list,
                //         variableValuesObject,
                //     );
                //     console.log("whatsappContent", whatsappContent);

                //     const sendBrevoWhatsAppMessageRes = await sendBrevoWhatsAppMessage(
                //         whatsappContent,
                //         relationshipManagerMobileNumber,
                //     );
                //     console.log("sendBrevoWhatsAppMessageRes", sendBrevoWhatsAppMessageRes);
                // }
                if (messageData?.is_whatsapp) {
                    const bodyComponents = [
                        {
                            "type": "text",
                            "text": variableValuesObject?.LeadName?.toString(),
                        },
                        {
                            "type": "text",
                            "text": variableValuesObject?.CategoryName?.toString(),
                        },
                        {
                            "type": "text",
                            "text": variableValuesObject?.ProductName?.toString(),
                        },
                    ];
                    const otherComponents = [];

                    const sendWaboWhatsAppMessageRes = await sendWaboWhatsAppMessage(
                        waboConfig.leadAssignedToRmTemplate,
                        "+91" + relationshipManagerMobileNumber,
                        bodyComponents,
                        otherComponents,
                    );
                    console.log("sendWaboWhatsAppMessageRes", sendWaboWhatsAppMessageRes);
                }
            }
        }
    }
}

module.exports = AdvisorAssignNotificationService;
