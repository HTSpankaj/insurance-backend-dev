const auth = require('../middleware/auth');
const { authConfig } = require('../configs/auth.config');
// const cookieOptions = { httpOnly: true, secure: true } //* fot Local Host
const cookieOptions = { httpOnly: true, secure: true }; //* fot Server Host

const logInGenerateAndStoreToken = (payload, res) => {
    try {
        const access_token = auth.generateToken(
            payload,
            authConfig.accessTokenExpiry
        );
        const refresh_token = auth.generateToken(
            payload,
            authConfig.refreshTokenExpiry
        );

        res.cookie('access_token', access_token, cookieOptions).cookie(
            'refresh_token',
            refresh_token,
            cookieOptions
        );

        return true;
    } catch (error) {
        throw error?.message ? error.message : error;
    }
};

const refreshService = async (req, res) => {
    try {
        const refresh_token = req.cookies.refresh_token;
        if (!refresh_token && refresh_token === undefined) {
            return false;
        }
        const isValidRefreshToken = auth.verifyToken(refresh_token);

        if (isValidRefreshToken.email) {
            delete isValidRefreshToken.iat;
            delete isValidRefreshToken.exp;

            const newAccessToken = auth.generateToken(
                isValidRefreshToken,
                authConfig.accessTokenExpiry
            );

            res.cookie('access_token', newAccessToken, cookieOptions);
            return true;
        } else {
            const _error = { message: 'Invalid refresh token' };
            throw _error;
        }
    } catch (error) {
        const _error = error ? error : { message: 'Internal Server Error' };
        throw _error;
    }
};

const logOutService = async (res) => {
    res.clearCookie('refresh_token').clearCookie('access_token');
    return true;
};

module.exports = {
    logInGenerateAndStoreToken,
    refreshService,
    logOutService,
};
