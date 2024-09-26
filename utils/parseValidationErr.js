const parseValidationErrors = (e, req) => {
    if (e.errors) {
      Object.entries(e.errors).forEach(([key, { properties }]) => {
        req.flash("error", `${key}: ${properties.message}`);
      });
    } else {
      req.flash("error", "An unexpected error occurred.");
    }
  };
module.exports =  parseValidationErrors;