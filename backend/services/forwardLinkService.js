const { Link, LinkTracking } = require("../models/ForwardLinkModel");
const axios = require("axios");
const { discordSender } = require("../helpers/discordNotifications");
const { sendToQueue } = require("../helpers/notificationProducer");
const UAParser = require("ua-parser-js");

async function getGeoData(ip) {
  try {
    const response = await axios.get(
      `http://ip-api.com/json/${ip}?fields=status,country,city,timezone,isp,proxy,zip,lat,lon,continent`
    );
    if (response.data.status === "success") {
      return {
        country: response.data.country || "N/A",
        city: response.data.city || "N/A",
        timezone: response.data.timezone,
        isp: response.data.isp,
        isVpn: response.data.proxy,
        zip: response.data.zip,
        lat: response.data.lat,
        lon: response.data.lon,
        continent: response.data.continent,
      };
    }
  } catch (err) {
    console.error("Błąd pobierania geolokalizacji:", err.message);
  }
  return {};
}

function getDeviceType(userAgent) {
  const ua = userAgent.toLowerCase();
  if (/mobile|android|iphone|ipad|ipod/i.test(ua)) return "mobile";
  return "desktop";
}

async function addTracking(linkId, info, status) {
  await LinkTracking.create({
    link_id: linkId,
    user_agent: info.userAgent,
    user_ip: info.ip,
    isp: info.geo.isp,
    country: info.geo.country,
    city: info.geo.city,
    accept_language: info.acceptLanguage,
    timezone: info.geo.timezone,
    sucess_redirect: status,
    referer: info.referer,
    os: info.device.os + " " + info.device.osVersion,
    browser: info.device.browser + " " + info.device.browserVersion,
    cpu: info.device.cpu,
    device_type: info.device.deviceType,
  });
}

async function decrementUsage(link) {
  if (link.usage_limit !== null) {
    link.usage_limit -= 1;
    await link.save();
  }
}

async function handleRedirect(req) {
  const shortId = req.params.id;
  const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const userAgent = req.headers["user-agent"];
  const parser = new UAParser(userAgent);
  const deviceInfo = parser.getResult();

  const collectedUserInfo = {
    ip: clientIp,
    userAgent,
    referer: req.headers["referer"] || "N/A",
    acceptLanguage: req.headers["accept-language"] || "N/A",
    geo: await getGeoData(clientIp),
    device: {
      browser: deviceInfo.browser.name || "N/A",
      browserVersion: deviceInfo.browser.version || "N/A",
      os: deviceInfo.os.name || "N/A",
      osVersion: deviceInfo.os.version || "N/A",
      deviceType: getDeviceType(userAgent),
      cpu: deviceInfo.cpu.architecture || "N/A",
    },
  };

  const link = await Link.findOne({ where: { short_link: shortId } });

  if (!link) return { status: 404, message: "Link not found" };
  if (link.status === 0)
    return { status: 302, redirect: process.env.APP_INACTIVE_URL + "/" + link.short_link };

  await addTracking(link.id, collectedUserInfo, true);

  if (link.usage_limit !== null && link.usage_limit <= 0)
    return { status: 302, redirect: process.env.APP_NOT_FOUND_URL + "/" + link.short_link };
  else await decrementUsage(link);

  // Notyfikacje
  if (process.env.SEND_RABBIT_NOTIFICATION === "true") {
    await sendToQueue({
      event: "redirect",
      link_id: link.id,
      short_link: link.short_link,
      target: link.extended_link,
      ip: collectedUserInfo.ip,
      country: collectedUserInfo.geo.country,
      timestamp: new Date().toISOString(),
    });
  }

  if (process.env.DISCORD_NOTIFICATIONS === "true") {
    discordSender(link.short_link);
  }

  if (link.password) {
    return { status: 302, redirect: process.env.APP_PASSWORD_URL + "/" + link.short_link };
  } else {
    return { status: 302, redirect: link.extended_link };
  }
}

module.exports = { handleRedirect };
