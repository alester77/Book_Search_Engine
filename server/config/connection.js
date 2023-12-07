const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://alester0284:v6BU!nyZSqtj64tMfDcr9@booksearch.vd0xbcj.mongodb.net/',{
}
);

module.exports = mongoose.connection;
