const Link = require("./Link");
const LinkTracking = require("./LinkTracking");

const models = {
  Link,
  LinkTracking,
};

// Automatyczne ustawianie relacji (tych z metod associate)
Object.values(models).forEach((model) => {
  if (model.associate) {
    model.associate(models);
  }
});

module.exports = models;