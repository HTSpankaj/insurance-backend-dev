const auth = require('../middleware/auth');
const { authConfig } = require('../configs/auth.config');
// const cookieOptions = { httpOnly: true, secure: true } //* fot Local Host
const cookieOptions = { httpOnly: true, secure: true }; //* fot Server Host

const logInGenerateAndStoreToken = (payload, res) => {
    try {
        const accessToken = auth.generateToken(
            payload,
            authConfig.accessTokenExpiry
        );
        const refreshToken = auth.generateToken(
            payload,
            authConfig.refreshTokenExpiry
        );

        res.cookie('accessToken', accessToken, cookieOptions).cookie(
            'refreshToken',
            refreshToken,
            cookieOptions
        );

        return true;
    } catch (error) {
        throw error?.message ? error.message : error;
    }
};

const refreshService = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken && refreshToken === undefined) {
            return false;
        }
        const isValidRefreshToken = auth.verifyToken(refreshToken);

        if (isValidRefreshToken.email) {
            delete isValidRefreshToken.iat;
            delete isValidRefreshToken.exp;

            const newAccessToken = auth.generateToken(
                isValidRefreshToken,
                authConfig.accessTokenExpiry
            );

            res.cookie('accessToken', newAccessToken, cookieOptions);
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
    res.clearCookie('refreshToken').clearCookie('accessToken');
    return true;
};

module.exports = {
    logInGenerateAndStoreToken,
    refreshService,
    logOutService,
};
