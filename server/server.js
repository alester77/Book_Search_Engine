const express = require('express');
const path = require('path');
const db = require('./config/connection');
const { ApolloServer } = require("apollo-server-express");

const { typeDefs, resolvers } = require("./schemas");
const { authMiddleware } = require("./utils/auth");

const server = new ApolloServer({
  typeDefs,
  resolvers, 
  context: authMiddleware,
  persistedQueries: false, 
});

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "../client/dist")));


app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "../client/dist", "index.html"))
});


const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
  server.applyMiddleware({ app });
  db.once("open", () => {
    app.listen(PORT, () => {
      console.log(`Server now running on port ${PORT}!`);
      console.log(server.graphqlPath);
      console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`)
    });
  });
};

startApolloServer(typeDefs, resolvers);