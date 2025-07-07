const { waboConfig } = require("../../configs/wabo.config");
const NotificationTriggerMessagesDatabase = require("../../infrastructure/databases/notification/notification_trigger_messages.database");
const { sendBrevoEmailMessage } = require("../../integration/brevo/email.brevo.integration");
const { sendBrevoSmsMessage } = require("../../integration/brevo/sms.brevo.integration");
const { sendWaboWhatsAppMessage } = require("../../integration/wabo/whatsapp.wabo.integration");
const { replaceVariables } = require("./functions");

class OTPSendServiceToRm {
    /**
     * Constructor for initializing the AdvisorAccessService
     * @param {SupabaseClient} supabaseInstance - The Supabase instance
     */
    constructor(supabaseInstance) {
        this.notificationTriggerMessagesDatabase = new NotificationTriggerMessagesDatabase(
            supabaseInstance,
        );
    }

    async sendOtpToAdvisorThroughSms(rmMobileNumber, otp = 1234) {
        const bodyComponents = [
            {
                "type": "text",
                "text": otp?.toString(),
            },
        ];
        const otherComponents = [
            {
                "type": "button",
                "sub_type": "url",
                "index": 0,
                "parameters": [{ "type": "text", "text": otp?.toString() }],
            },
        ];

        const sendWaboWhatsAppMessageRes = await sendWaboWhatsAppMessage(
            waboConfig.otpSendToRmTemplate,
            "+91" + rmMobileNumber,
            bodyComponents,
            otherComponents,
        );
        return sendWaboWhatsAppMessageRes;
    }
}

module.exports = OTPSendServiceToRm;
