const { AuthenicationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {

// Query
Query: {
  me: async(parent, args, context) => {
    if (context.user) {
      const userData = await User
      .findOne({ _id: context.user._id })
      .select('-__v -password')
      .populate('books');

      return userData;
    };
    throw new AuthenicationError('Not logged in');
    },
},

// Mutation

  //login
  //addUser
  //saveBook
  //removeBook

}

module.exports = resolvers;