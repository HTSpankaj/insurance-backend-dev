const { UserService } = require("../../../application/services/users/users.service");
const { supabaseInstance } = require("../../../supabase-db");

const authUtil = require("../../../utils/auth.util.js");
const userService = new UserService(supabaseInstance);

exports.logInUser = async (req, res) => {
    // #swagger.tags = ['Users']
    /*  #swagger.parameters['body'] ={
        in: 'body',
        description: 'Add User',
        schema: {
          "email": "",
          "password": "",
        }
} */

    try {
        const postBody = req.body;

        if (postBody.email && postBody.password) {
            const serviceResponse = await userService.login(postBody.email, postBody.password);
            if (serviceResponse) {
                if (serviceResponse?.password) {
                    delete serviceResponse.password;
                }
                const logInTokens = authUtil.logInGenerateAndStoreToken(serviceResponse);

                return res.status(200).json({
                    success: true,
                    data: serviceResponse,
                    token: logInTokens,
                });
            } else {
                throw new Error("Login failed");
            }
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error || "Something went wrong!!" });
    }
};

exports.refresh = async (req, res) => {
    // #swagger.tags = ['Users']
    try {
        const token = await authUtil.refreshService(req, res);
        if (!token) {
            return res.status(401).json({ success: false, error: "Invalid refresh token" });
        }
        return res.status(200).json({ success: true, data: { access_token: token } });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, error: error.message });
    }
};

exports.logOutUser = async (req, res) => {
    // #swagger.tags = ['Users']

    try {
        // const service = await authUtil.logOutService(res);
        let service;
        if (service) {
            res.status(200).json({ success: true, message: "Logout successful" });
        } else {
            res.status(401).json({ error: "Logout failed" });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
