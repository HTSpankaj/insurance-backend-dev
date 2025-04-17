const moment = require("moment");

function checkAndAdjustDateTime(dateString = "", isStartDate) {
    // Parse the input date string using Moment.js
    const parsedDate = moment(dateString, moment.ISO_8601, true);

    // if (parsedDate.isValid()) {
    if (dateString.length > 10) {
        // If valid, return the original date formatted as desired
        return parsedDate.format("YYYY-MM-DD HH:mm:ss.SSSSSSZZ");
    } else {
        // If not valid, adjust the date string based on isStartDate
        const adjustedTime = isStartDate ? " 00:00:00.000000" : " 23:59:59.999999";

        const adjustedDateTime = moment(dateString + adjustedTime, moment.ISO_8601).format(
            "YYYY-MM-DD HH:mm:ss.SSSSSSZZ",
        );
        return adjustedDateTime;
    }
}

function calculateCommissionTransactionNumber(payout_type, startDate, endDate) {
    const start = moment(startDate);
    const end = moment(endDate);

    if (!start.isValid() || !end.isValid() || start.isAfter(end)) return 0;

    const totalMonths = end.diff(start, "months", true); // fractional months

    switch (payout_type.toLowerCase()) {
        case "One Time":
            return 1;

        case "Monthly":
            return Math.floor(totalMonths) + 1;

        case "Quarterly":
            return Math.floor(totalMonths / 3) + 1;

        case "Half Yearly":
            return Math.floor(totalMonths / 6) + 1;

        case "Yearly":
            return Math.floor(totalMonths / 12) + 1;

        default:
            return 0;
    }
}

module.exports = { checkAndAdjustDateTime, calculateCommissionTransactionNumber };
// // Example usage:
// const startDate = '2024-08-27';
// const endDate = '2024-08-28';

// console.log(checkAndAdjustDateTime(startDate, true)); // Output: '2024-08-27 00:00:00.000000+00'
// console.log(checkAndAdjustDateTime(endDate, false));   // Output: '2024-08-28 23:59:59.999999+00'
// console.log(checkAndAdjustDateTime('2024-08-27T06:59:15.33766', true)); // Output: '2024-08-27 06:59:15.337660+00'
// console.log(checkAndAdjustDateTime('invalid date', false)); // Output: 'invalid date' (because it's not a valid date format)
