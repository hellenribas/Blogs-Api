const errorMiddleware = async (err, _req, res) => res.status(500).json({ message: err.message });

module.exports = errorMiddleware;
