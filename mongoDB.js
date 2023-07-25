const mongoose = require('mongoose');

// Setting up MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/test", {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
    console.log("mongodb connected");
  } catch (error) {
    console.error("Failed to connect to Database", error);
    process.exit(1); // Exit process with failure
  }
};

// User Schema
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

// Blog Schema
const BlogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    }
});

// Creating models for the collections
const User = mongoose.model("users", UserSchema); // Changed collection name to 'users'
const Blog = mongoose.model("blogs", BlogSchema); // New collection 'blogs'

// Export the models and the connectDB function
module.exports = { User, Blog, connectDB };
