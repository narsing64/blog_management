import express from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import bodyparser from 'body-parser';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = 3000;

// ✅ Static middleware with absolute path
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyparser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ✅ MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/blogDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("✅ Connected to MongoDB");
}).catch((err) => {
  console.error("❌ MongoDB connection error:", err);
});

// ✅ Mongoose Schema
const postSchema = new mongoose.Schema({
  title: String,
  text: String,
  image: String
});

const Post = mongoose.model("Post", postSchema);

// ✅ Routes

app.get("/", async (req, res) => {
  const posts = await Post.find();
  res.render("index.ejs", { posts: posts });
});

app.get("/create", (req, res) => {
  res.render("create.ejs");
});

app.post("/create", (req, res) => {
  res.redirect("/create");
});

app.post("/submit", async (req, res) => {
  const newPost = new Post({
    title: req.body.heading,
    image: req.body.image,
    text: req.body.text
  });
  await newPost.save();
  res.redirect("/");
});

app.get("/edit/:id", async (req, res) => {
  const post = await Post.findById(req.params.id);
  res.render("edit.ejs", { post });
});

app.post("/edit/:id", async (req, res) => {
  await Post.findByIdAndUpdate(req.params.id, {
    title: req.body.heading,
    image: req.body.image,
    text: req.body.text
  });
  res.redirect("/");
});

app.post("/delete/:id", async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.redirect("/");
});

// ✅ Start server
app.listen(port, () => {
  console.log(`🚀 Server started on port ${port}`);
});
