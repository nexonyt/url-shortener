const { DataTypes, Model } = require("sequelize");
const sequelize = require("../configs/sequelize");

class Link extends Model {
  static associate(models) {
    // Definiujemy, że Link ma wiele wpisów w statystykach
    this.hasMany(models.LinkTracking, { foreignKey: "link_id", as: "trackings" });
  }
}

Link.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    short_link: { type: DataTypes.STRING, allowNull: false },
    extended_link: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.INTEGER, defaultValue: 1 },
    // ... reszta Twoich pól (password, usage_limit itp.)
  },
  {
    sequelize,
    modelName: "Link",
    tableName: "links",
    timestamps: false,
  }
);

module.exports = Link;