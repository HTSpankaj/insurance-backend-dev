const auth = require('../middleware/auth');
const { authConfig } = require('../configs/auth.config');
// const cookieOptions = { httpOnly: true, secure: true } //* fot Local Host
const cookieOptions = { httpOnly: true, secure: true }; //* fot Server Host

const logInGenerateAndStoreToken = (payload) => {
    const _payload = {...payload};
    delete _payload.password;

    try {
        const accessToken = auth.generateToken(_payload, authConfig.accessTokenExpiry);
        const refreshToken = auth.generateToken(_payload, authConfig.refreshTokenExpiry);

        return { accessToken, refreshToken};
    } catch (error) {
        throw error?.message ? error.message : error;
    }
};

const refreshService = async (req) => {
    try {
        const refreshToken = req.headers.authorization?.split(' ')[1];
        if (!refreshToken && refreshToken === undefined) {
            return false;
        }
        const isValidRefreshToken = auth.verifyToken(refreshToken);

        if (isValidRefreshToken.email) {
            delete isValidRefreshToken.iat;
            delete isValidRefreshToken.exp;

            const newAccessToken = auth.generateToken(isValidRefreshToken, authConfig.accessTokenExpiry);

            return newAccessToken;
        } else {
            const _error = { message: "Invalid refresh token" };
            throw _error;
        }
    } catch (error) {
        const _error = error ? error : { message: "Internal Server Error" };
        throw _error;
    }
};

const logOutService = async (res) => {
    res
        .clearCookie('refreshToken')
        .clearCookie('accessToken')
    return true;
}

module.exports = {
    logInGenerateAndStoreToken,
    refreshService,
    logOutService
}
