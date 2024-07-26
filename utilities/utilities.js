exports.convertToMonthName = function (month) {
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return monthNames[month - 1];
};

exports.validate = function (form, fields) {
  // sanitise the input
  Object.keys(form).forEach((f) => {
    // sanitise
    if (typeof form[f] === "string" && form[f]?.includes("<script>")) {
      form[f] = form[f].replace("<script>", "");
      form[f] = form[f].replace("</script>", "");
    }
  });

  if (fields?.length) {
    fields.forEach((f, i) => {
      if (!form.hasOwnProperty(f) || !form[f]) {
        // field is required
        throw { message: f + " field is required" };
      }
    });
  }
};

exports.assert = function (data, err, input) {
  if (!data) throw { message: err, ...(input && { inputError: input }) };

  return true;
};

exports.base64 = {};

exports.base64.encode = function (data) {
  return Buffer.from(data).toString("base64");
};

exports.base64.decode = function (data) {
  return Buffer.from(data, "base64").toString("utf-8");
};

exports.dedupeArray = function (arr) {
  return arr.filter(function (elem, index, self) {
    return index === self.indexOf(elem);
  });
};

exports.currencySymbol = {
  usd: "$",
  gbp: "£",
  eur: "€",
  aud: "$",
  cad: "$",
};

exports.mask = function (s) {
  return `${s.slice(0, 3)}...${s.slice(s.length - 3, s.length)}`;
};

exports.clean = function (data) {
  const res = {};

  if (Object.keys(data).length) {
    Object.keys(data).forEach((key) => {
      if (data[key] === "undefined") data[key] = undefined;
      if (data[key] === "false") data[key] = false;
      if (data[key] === "null") data[key] = null;
      if (!isNaN(parseFloat(data[key])) && typeof data[key] !== "string")
        data[key] = parseFloat(data[key]);
      res[key] = data[key];
    });
  }

  return res;
};
