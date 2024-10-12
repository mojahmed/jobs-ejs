// const mongoose = require("mongoose");
// const Job = require("../models/Job");
// const User = require("../models/User");
// const faker = require("@faker-js/faker").fakerEN_US;
// const FactoryBot = require("factory-bot");
// require("dotenv").config();

// const testUserPassword = faker.internet.password();
// const factory = FactoryBot.factory;
// const factoryAdapter = new FactoryBot.MongooseAdapter();
// factory.setAdapter(factoryAdapter);

// factory.define("job", Job, {
//   company: () => faker.company.name(),
//   position: () => faker.person.jobTitle(),
//   status: () =>
//     ["interview", "declined", "pending"][Math.floor(3 * Math.random())],
// });

// factory.define("user", User, {
//   name: () => faker.person.fullName(),
//   email: () => faker.internet.email(),
//   password: () => testUserPassword, // Use the defined password for consistency
// });

// const seed_db = async () => {
//   let testUser = null;

//   try {
//     const mongoURL = process.env.MONGO_URI_TEST;

//     // Connect to the test database
//     await mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true });

//     await Job.deleteMany({}); // Deletes all job records
//     await User.deleteMany({}); // Deletes all user records

//     // Create a test user
//     testUser = await factory.create("user", { password: testUserPassword });

//     // Create 20 job entries for the test user
//     await factory.createMany("job", 20, { createdBy: testUser._id });
//   } catch (e) {
//     console.log("Database error");
//     console.log(e.message);
//     throw e; // Rethrow the error to handle it later
//   } finally {
//     // Close the connection after seeding
//     await mongoose.connection.close();
//   }

//   return testUser;
// };

// module.exports = { testUserPassword, factory, seed_db };


// const mongoose = require("mongoose");
const Job = require("../models/Job");
const User = require("../models/User");
const faker = require("@faker-js/faker").fakerEN_US;
const FactoryBot = require("factory-bot");
require("dotenv").config();

const testUserPassword = faker.internet.password();
const factory = FactoryBot.factory;
const factoryAdapter = new FactoryBot.MongooseAdapter();
factory.setAdapter(factoryAdapter);

factory.define("job", Job, {
  company: () => faker.company.name(),
  position: () => faker.person.jobTitle(),
  status: () =>
    ["interview", "declined", "pending"][Math.floor(3 * Math.random())],
});

factory.define("user", User, {
  name: () => faker.person.fullName(),
  email: () => faker.internet.email(),
  password: () => testUserPassword, // Use the defined password for consistency
});

const seed_db = async () => {
    let testUser = null;
  
    try {
      await Job.deleteMany({}); // Deletes all job records
      await User.deleteMany({}); // Deletes all user records
  
      // Create a test user
      testUser = await factory.create("user", { password: testUserPassword });
  
      // Create 20 job entries for the test user
      await factory.createMany("job", 20, { createdBy: testUser._id });
    } catch (e) {
      console.log("Database error");
      console.log(e.message);
      throw e; 
    }
  
    return testUser;
  };
  
  module.exports = { testUserPassword, factory, seed_db };
  