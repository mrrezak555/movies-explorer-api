module.exports.corsOptions = {
  origin: [
    'http://movies.best.nomoredomains.monster',
    'https://movies.best.nomoredomains.monster',
    'http://localhost:3000',
    'http://localhost:3000/',
    'http://localhost:3001',
    'http://localhost:3001/',
  ],
  credentials: true,
  maxAge: 60,
};