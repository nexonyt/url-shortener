const endpointSchemas = {
  "enrollment-register": {
    companyName: "string",
    contactEmail: "string",
    contactName: "string",
    websiteUrl: "string",
    apiUsagePurpose: "string",
    pricingPlan: "string",
    expectedVolume: "number",
    termsAccepted: "boolean"
  },
  login: {
    email: "string",
    password: "string",
  },
  updateProfile: {
    userId: "string",
    bio: "string",
    age: "number",
  },
};


function validate(endpoint, body) {
  const schema = endpointSchemas[endpoint];
  if (!schema) {
    return {
      error: true,
      field: null,
      reason: `Brak schematu walidacji dla endpointu: ${endpoint}`,
    };
  }

  for (const [field, expectedType] of Object.entries(schema)) {
    const value = body[field];

    // brak pola
    if (value === undefined || value === null || value === "") {
      return { error: true, reason: `Brakujący parametr: ${field}`};
    }

    // sprawdzenie typu
    const actualType = Array.isArray(value) ? "array" : typeof value;
    if (actualType !== expectedType) {
      return {
        error: true,
        reason: `Niepoprawny typ: ${field} - (oczekiwano ${expectedType}, otrzymano ${actualType})`,
      };
    }
  }

  // wszystko OK
  return null;
}

module.exports = { validate };
