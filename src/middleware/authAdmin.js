const config = require("config");

const authAdmin = async (req, res, next) => {
  // This user has already undergone ordinary authentication at the time of
  // registration that can become an admin or not
  // now we will simply check if it is an admin or not
  try {
    if (!req.user.isAdmin) {
      throw new Error();
    }
    next();
  } catch (e) {
    if (e.message) console.error(e.message);
    res.status(401).send({
      errors: [
        {
          msg: "Access Denied !! Hackiing alert set. You are being watched.",
        },
      ],
    });
  }
};

module.exports = authAdmin;
