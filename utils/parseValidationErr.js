const parseValidationErrors = (e, req) => {
  console.log("There was an error:")
  console.log(e);
  const keys = Object.keys(e.errors);
  keys.forEach((key) => {
    req.flash("error", key + ": " + e.errors[key].properties.message);
  });
};

module.exports = parseValidationErrors;