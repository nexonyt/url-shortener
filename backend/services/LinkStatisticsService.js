const { Link, LinkTracking } = require("../models");

const getLinkStatisticsService = async (linkId) => {
  // Pobieramy link wraz z jego wszystkimi statystykami
  const linkWithStats = await Link.findByPk(linkId, {
    include: [
      {
        model: LinkTracking,
        as: "trackings",
      },
    ],
  });

  return linkWithStats;
};

module.exports = {
  getLinkStatisticsService,
};