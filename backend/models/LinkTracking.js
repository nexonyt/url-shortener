const { DataTypes, Model } = require("sequelize");
const sequelize = require("../configs/sequelize");

class LinkTracking extends Model {
  static associate(models) {
    // Każdy wpis w statystykach należy do jednego Linku
    this.belongsTo(models.Link, { foreignKey: "link_id", as: "link" });
  }
}

LinkTracking.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    link_id: { type: DataTypes.INTEGER, allowNull: false },
    user_ip: { type: DataTypes.STRING },
    country: { type: DataTypes.STRING },
    browser: { type: DataTypes.STRING },
    os: { type: DataTypes.STRING },
    device_type: { type: DataTypes.STRING },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    sequelize,
    modelName: "LinkTracking",
    tableName: "links_tracking",
    timestamps: false,
  }
);

module.exports = LinkTracking;