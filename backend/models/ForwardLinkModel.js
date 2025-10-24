const { DataTypes, Model } = require("sequelize");
const sequelize = require("../configs/sequelize");

// ====================
// Model Link
// ====================
class Link extends Model {}

Link.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    short_link: { type: DataTypes.STRING, allowNull: false },
    extended_link: { type: DataTypes.STRING, allowNull: false },
    usage_limit: { type: DataTypes.INTEGER, defaultValue: null },
    status: { type: DataTypes.INTEGER, defaultValue: 1 },
    password: { type: DataTypes.BOOLEAN, defaultValue: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    sequelize,
    modelName: "Link",
    tableName: "links",
    timestamps: false,
  }
);

// ====================
// Model LinkTracking
// ====================
class LinkTracking extends Model {}

LinkTracking.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    link_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Link,
        key: "id",
      },
    },
    user_agent: { type: DataTypes.STRING },
    user_ip: { type: DataTypes.STRING },
    isp: { type: DataTypes.STRING },
    country: { type: DataTypes.STRING },
    city: { type: DataTypes.STRING },
    accept_language: { type: DataTypes.STRING },
    timezone: { type: DataTypes.STRING },
    sucess_redirect: { type: DataTypes.BOOLEAN },
    referer: { type: DataTypes.STRING },
    os: { type: DataTypes.STRING },
    browser: { type: DataTypes.STRING },
    cpu: { type: DataTypes.STRING },
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

// ====================
// Relacje
// ====================
Link.hasMany(LinkTracking, { foreignKey: "link_id", as: "trackings" });
LinkTracking.belongsTo(Link, { foreignKey: "link_id", as: "link" });

module.exports = {
  Link,
  LinkTracking,
};
