import { gql } from "graphql-tag";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { merge } from "lodash";
import { resolver as UserResolver } from "./resolver//userResolver";

const typeDefs = gql`
  

  ################################################################
  # User
  ################################################################
  type User {
    _id: String
    email: String
    firstName: String
    lastName: String
    password: String
    role: String
  }

    input UserInput {
      _id: String
      email: String
      firstName: String
      lastName: String
      password: String
      role: String
    }

    type Authentication {
      user: User
      token: String
      message: String
    }


  ######################################################################
  # Queries
  ######################################################################
  type Query {
    ################################################################
    # User
    ################################################################
    login(email: String!, password: String!): Authentication
    getUsers: User
    # This is only here to satisfy the requirement that at least one
    # field be present within the 'Query' type.  This example does not
    # demonstrate how to fetch uploads back.
    otherFields: Boolean!   
  }

  ######################################################################
  # Mutation
  ######################################################################
  type Mutation {
    ################################################################
    # User
    ################################################################
    register(params: UserInput!): User
    update(params:UserInput!):User
  }
`;
export const resolvers = merge(UserResolver);

export const executableSchema = makeExecutableSchema({
    resolvers: {
        ...resolvers
    },
    typeDefs,
});