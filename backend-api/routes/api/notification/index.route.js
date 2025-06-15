const express = require("express");
const {
    addNotificationTriggerMessagesController,
    updateNotificationTriggerMessagesController,
    deleteNotificationTriggerMessagesController,
    getNotificationTriggerListController,
    getNotificationTriggerMessagesController,
} = require("../../../presentation/controller/notification/notificationTriggerMessages.controller");

const router = express.Router();

router.get("/get-notification-trigger-list", getNotificationTriggerListController);

router.get("/get-notification-trigger-messages", getNotificationTriggerMessagesController);

router.post("/add-notification-trigger-messages", addNotificationTriggerMessagesController);

router.put("/update-notification-trigger-messages", updateNotificationTriggerMessagesController);

router.delete("/delete-notification-trigger-messages", deleteNotificationTriggerMessagesController);

module.exports = router;
