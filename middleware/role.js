// middleware/role.js
function authorizeRole(...allowedRoles) {
    return (req, res, next) => {
        const { rol } = req.user; 
        if (!allowedRoles.includes(rol)) {
            return res.status(403).json({ message: 'Acceso denegado' });
        }
        next();
    };
}

module.exports = authorizeRole;
