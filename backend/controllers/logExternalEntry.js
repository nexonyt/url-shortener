const axios = require('axios');
const UAParser = require('ua-parser-js');
const mysql = require('mysql');

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  });


const addTrackingToDB = async (collectedUserInfo, status, source = 'N/A') => {
    console.log(`Dodanie rekordu do links_tracking`);
  
    const SQL = `
      INSERT INTO links_tracking (
        link_id,
        user_agent,
        user_ip,
        isp,
        country,
        city,
        accept_language,
        timezone,
        sucess_redirect,
        referer,
        os,
        browser,
        created_at,
        cpu,
        device_type,
        source
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)`;
  
    const values = [
      collectedUserInfo.link_id,
      collectedUserInfo.userAgent,
      collectedUserInfo.ip,
      collectedUserInfo.geo.isp,
      collectedUserInfo.geo.country,
      collectedUserInfo.geo.city,
      collectedUserInfo.acceptLanguage,
      collectedUserInfo.geo.timezone,
      status,
      collectedUserInfo.referer,
      `${collectedUserInfo.device.os} ${collectedUserInfo.device.osVersion}`,
      `${collectedUserInfo.device.browser} ${collectedUserInfo.device.browserVersion}`,
      new Date(),
      collectedUserInfo.device.cpu,
      collectedUserInfo.device.deviceType,
      source
    ];
    db.query(SQL, values, (err, result) => {
        if (err) {
          console.error('❌ Błąd zapisu do links_tracking:', err);
        } else {
          console.log(`✅ Rekord dodany do links_tracking, ID rekordu: ${result.insertId}`);
          console.log('📄 Wstawione dane:', values);
        }
      });
  };
  

const getGeoData = async (ip) => {
  let geoData = {};
  try {
    const response = await axios.get(`http://ip-api.com/json/${ip}?fields=status,country,city,timezone,isp,proxy`);
    if (response.data.status === "success") {
      geoData = {
        country: response.data.country || "N/A",
        city: response.data.city || "N/A",
        timezone: response.data.timezone || "N/A",
        isp: response.data.isp || "N/A",
        isVpn: response.data.proxy || false
      };
    }
  } catch (err) {
    console.error("Błąd geoip:", err.message);
  }

  return geoData;
};

const getDeviceType = (userAgent) => {
  const ua = userAgent.toLowerCase();
  if (/mobile|android|iphone|ipad|ipod/i.test(ua)) return "mobile";
  return "desktop";
};

const logExternalEntry = async (req, res) => {
  try {
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers["user-agent"];
    const parser = new UAParser(userAgent);
    const deviceInfo = parser.getResult();
    const geoData = await getGeoData(clientIp);

    const collectedUserInfo = {
      link_id: req.body.link_id,
      ip: clientIp,
      userAgent: userAgent,
      referer: req.body.referrer || req.headers["referer"] || "N/A",
      acceptLanguage: req.headers["accept-language"] || "N/A",
      geo: {
        country: geoData.country,
        city: geoData.city,
        timezone: geoData.timezone,
        isp: geoData.isp,
        isVpn: geoData.isVpn,
      },
      device: {
        browser: deviceInfo.browser.name || "N/A",
        browserVersion: deviceInfo.browser.version || "N/A",
        os: deviceInfo.os.name || "N/A",
        osVersion: deviceInfo.os.version || "N/A",
        deviceType: getDeviceType(userAgent),
        deviceVendor: deviceInfo.device.vendor || "N/A",
        cpu: deviceInfo.cpu.architecture || "N/A",
      }
    };

    await addTrackingToDB(collectedUserInfo, 1, 'wakacje.nexonstudio.pl');
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Błąd logowania wejścia:", error);
    return res.status(500).json({ error: true, message: "Błąd serwera" });
  }
};

module.exports = { logExternalEntry };
