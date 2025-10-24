const { handleRedirect } = require("../services/forwardLinkService");

async function forwardLink2(req, res) {
  try {
    const result = await handleRedirect(req);
    if (result.status === 302) {
      return res.redirect(302, result.redirect);
    } else {
      return res.status(result.status).json({ message: result.message });
    }
  } catch (err) {
    console.error("ForwardLinkController error:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = { forwardLink2 };
