// 404 Not Found middleware
const notFound = (req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found',
    path: req.path,
    method: req.method
  });
};

module.exports = notFound;
