const { AuthenticationError } = require("apollo-server-express");

const { User } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (_parent, _args, context) => {
        if (context.user) {
            const userData = await User.findOne({ _id: context.user._id })
                .select('-__v -password');
  
            return userData;
        }
      throw new AuthenticationError("No user found. Please login or register");
    },
  },

  Mutation: {
    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);

      return { token, user };
    },
    login: async (_parent, { email, password }) => {
      console.log(1);
      const user = await User.findOne({ email });
      if (!user) {
        throw new AuthenticationError("No user found");
      }
      console.log(2);

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect Password");
      }
      console.log(3);

      const token = signToken(user);
      console.log(token);

      return { token, user };
    },

    saveBook: async (_, { input }, context) => {
      if (context.user) {
        return User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: input } },
          { new: true, runValidators: true }
        );
      }
      throw new AuthenticationError("Please login or register");
    },

  removeBook: async (_, { bookId }, context) => {
    if (context.user) {
      const updatedUser = await User.findOneAndUpdate(
        { _id: context.user._id },
        { $pull: { savedBooks: { bookId } } }, 
        { new: true }
      );
      return updatedUser;
    }
    throw new AuthenticationError("Please login or register");
  },
},
};
module.exports = resolvers;