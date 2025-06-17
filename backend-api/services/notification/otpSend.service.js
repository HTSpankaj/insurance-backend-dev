const NotificationTriggerMessagesDatabase = require("../../infrastructure/databases/notification/notification_trigger_messages.database");
const { sendBrevoEmailMessage } = require("../../integration/brevo/email.brevo.integration");
const { sendBrevoSmsMessage } = require("../../integration/brevo/sms.brevo.integration");

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
                    []
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
