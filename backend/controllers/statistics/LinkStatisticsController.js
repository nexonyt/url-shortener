const { getLinkStatisticsService } = require("../../services/LinkStatisticsService");


const getLinkStatistics = async (req, res) => {
    const linkId = req.params.id;
    const linkStatistics = await getLinkStatisticsService(linkId);
    res.status(200).json(linkStatistics);
}

module.exports = {
    getLinkStatistics,
}