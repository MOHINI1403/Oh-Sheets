const jwt=require('jsonwebtoken');
const User=require('../models/User');

exports.googleAuth=(req,resp)=>{
    // OAuth flow handled by PassPort.js ??
    res.redirect('/');
};

exports.getCurrentUser=(req,resp)=>{
    resp.json(req.user);
};

exports.loginSuccess = (req, res) => {
    const token = jwt.sign(
        {
            user: {
                id: req.user.id,
                email: req.user.email,
                role: req.user.role
            }
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    res.json({ token });
};

exports.logout = (req, res) => {
    req.logout();
    res.redirect('/');
};