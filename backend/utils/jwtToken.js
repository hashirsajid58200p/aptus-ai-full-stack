const sendToken = (user, statusCode, res, message) => {
  const token = user.getJWTToken();

  const isProduction = process.env.NODE_ENV === "production";

  // Options for cookie setting
  const options = {
    expires: new Date(
      Date.now() + (process.env.COOKIE_EXPIRE || 7) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax"
  };
  

  const userResponse = typeof user.toJSON === "function" ? user.toJSON() : (user.toObject ? user.toObject() : { ...user });
  delete userResponse.password;

  res.status(statusCode)
    .cookie("token", token, options)
    .json({
      success: true,
      token,
      user: userResponse,
      message
    });
};

module.exports = sendToken;
