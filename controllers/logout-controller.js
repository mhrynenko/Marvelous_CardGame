const makeLogout = (req, res) => {
    res.clearCookie('token');
    res.clearCookie('status');
    res.redirect('/');
};

module.exports = {
    makeLogout
};
