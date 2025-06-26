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

module.exports = { replaceVariables };
