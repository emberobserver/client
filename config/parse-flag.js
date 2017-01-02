module.exports = function parseFlag(flagName, fallback) {
  var flag = process.env[flagName];

  if (flag === 'true') {
    return true;
  } else if (flag === 'false') {
    return false;
  } else {
    return fallback;
  }
};
