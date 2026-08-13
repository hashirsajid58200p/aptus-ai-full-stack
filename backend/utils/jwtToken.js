const sendToken = (user, statusCode, res, message) => {
  const token = user.getJWTToken();

  // Options for cookie setting
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure:true,
    sameSite:"none"
  };
  

  const userResponse = user.toObject ? user.toObject() : { ...user };
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
