const NotificationTriggerMessagesDatabase = require("../../infrastructure/databases/notification/notification_trigger_messages.database");
const { sendBrevoEmailMessage } = require("../../integration/brevo/email.brevo.integration");
const { sendBrevoSmsMessage } = require("../../integration/brevo/sms.brevo.integration");
const { replaceVariables } = require("./functions");

class OTPSendService {
    /**
     * Constructor for initializing the AdvisorAccessService
     * @param {SupabaseClient} supabaseInstance - The Supabase instance
     */
    constructor(supabaseInstance) {
        this.notificationTriggerMessagesDatabase = new NotificationTriggerMessagesDatabase(
            supabaseInstance,
        );
    }

    async sendOtpToAdvisorThroughEmail(advisorEmail, otp) {
        const getNotificationTriggerMessagesByTitleRes =
            await this.notificationTriggerMessagesDatabase.getNotificationTriggerMessagesByTitle(
                "Advisor OTP Send",
            );
        // console.log("getNotificationTriggerMessagesByTitleRes", getNotificationTriggerMessagesByTitleRes);

        if (getNotificationTriggerMessagesByTitleRes?.messageData) {
            const messageData = getNotificationTriggerMessagesByTitleRes?.messageData[0];
            if (messageData?.is_email) {
                const emailContent = replaceVariables(
                    messageData?.email_message,
                    getNotificationTriggerMessagesByTitleRes?.triggerData?.variable_list,
                    { OTP: otp },
                );
                console.log("emailContent", emailContent);

                const sendBrevoEmailMessageRes = await sendBrevoEmailMessage(
                    messageData?.email_subject,
                    emailContent,
                    [{ email: advisorEmail, name: "Advisor" }],
                    [],
                );
                console.log("sendBrevoEmailMessageRes", sendBrevoEmailMessageRes);
            }
        }
    }

    async sendOtpToAdvisorThroughSms(advisorMobileNumber, otp) {
        const getNotificationTriggerMessagesByTitleRes =
            await this.notificationTriggerMessagesDatabase.getNotificationTriggerMessagesByTitle(
                "Advisor OTP Send",
            );
        // console.log("getNotificationTriggerMessagesByTitleRes", getNotificationTriggerMessagesByTitleRes);

        if (getNotificationTriggerMessagesByTitleRes?.messageData) {
            const messageData = getNotificationTriggerMessagesByTitleRes?.messageData[0];
            if (messageData?.is_sms) {
                const smsContent = replaceVariables(
                    messageData?.sms_message,
                    getNotificationTriggerMessagesByTitleRes?.triggerData?.variable_list,
                    { OTP: otp },
                );
                console.log("smsContent", smsContent);

                const sendBrevoSmsMessageRes = await sendBrevoSmsMessage(
                    advisorMobileNumber,
                    smsContent,
                );
                console.log("sendBrevoSmsMessageRes", sendBrevoSmsMessageRes);
            }
        }
    }
}

module.exports = OTPSendService;
