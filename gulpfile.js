const { src, dest, series } = require("gulp");

const front = () => {
  return src("frontend/build/**/**.*").pipe(dest("rankchecker/"));
};

const back = () => {
  return src("backend/**/**.*").pipe(dest("rankchecker/backend/"));
};

exports.default = series(front, back);
