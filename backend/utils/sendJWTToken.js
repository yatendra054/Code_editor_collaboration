// utils/sendJWTToken.js
export default async function sendJWTToken(user, statusCode, res) {
  const token = await user.getJWTToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res
    .status(statusCode)
    .cookie("token", token, options)
    .cookie("setUpPersonalDetails", user?.setUpPersonalDetails, options) // New cookie
    .json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user,
      },
    });
}
