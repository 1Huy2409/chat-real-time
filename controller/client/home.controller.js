module.exports.index = async (req, res) => {
  res.render("client/pages/home/index", {
    pageTitle: "Chat",
    user: res.locals.user,
  });
};
