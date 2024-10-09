const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid"); // UUID 모듈 가져오기

require("dotenv").config(); // .env 파일을 불러오는 코드

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

// JWT 인증 미들웨어
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ message: "토큰이 제공되지 않았습니다." });
  }

  try {
    const decoded = jwt.verify(token.split(" ")[1], JWT_SECRET); // 'Bearer <token>' 형식에서 <token> 부분을 분리
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "유효하지 않은 토큰입니다." });
  }
};

// MongoDB 연결 설정
const mongoURI = process.env.MONGO_URI;
mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB에 연결되었습니다."))
  .catch((err) => console.error("MongoDB 연결 에러:", err));

// MongoDB를 위한 Schema와 Model 정의
const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  studentId: { type: String, required: true },
  name: { type: String, required: true },
});

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  post: { type: String, required: true },
  author: { type: String, required: true }, // 작성자 이름 필드 추가
  id: { type: String, unique: true, default: uuidv4 }, // 고유한 ID 추가
});

const User = mongoose.model("User", userSchema);
const Article = mongoose.model("Article", articleSchema);

app.listen(8080, function () {
  console.log("listening on 8080");
});

app.use(express.json());

app.post("/signup", async (req, res) => {
  const { id, password, studentId, name } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      id,
      password: hashedPassword,
      studentId,
      name,
    });

    await newUser.save();
    res.status(201).json({ message: "회원가입 성공", user: { id, studentId } });
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).json({ message: "이미 존재하는 사용자 ID입니다." });
    } else {
      res.status(500).json({ message: "서버 오류가 발생했습니다.", error });
    }
  }
});

app.post("/login", async (req, res) => {
  const { id, password } = req.body;

  try {
    const user = await User.findOne({ id });

    if (!user) {
      return res.status(400).json({ message: "존재하지 않는 사용자입니다." });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "비밀번호가 일치하지 않습니다." });
    }

    const token = jwt.sign(
      { id: user.id, studentId: user.studentId, name: user.name },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "로그인 성공",
      token,
      user: { id: user.id, studentId: user.studentId, name: user.name },
    });
  } catch (error) {
    res.status(500).json({ message: "서버 오류 발생", error });
  }
});

// 글 작성 요청 처리
app.post("/write", verifyToken, async (req, res) => {
  const { title, post } = req.body;

  const newArticle = new Article({
    title: title,
    post: post,
    author: req.user.name,
  });

  try {
    await newArticle.save();
    res.status(201).json({ message: "Article successfully saved!" });
  } catch (error) {
    console.error("Error saving article:", error);
    res.status(500).json({ message: "Failed to save article" });
  }
});

// 게시글 가져오기
app.get("/articles", verifyToken, async (req, res) => {
  try {
    const articles = await Article.find(); // 모든 게시글을 데이터베이스에서 가져오기
    res.status(200).json(articles); // 가져온 게시글들을 클라이언트에 응답
  } catch (error) {
    console.error("Error fetching articles:", error);
    res.status(500).json({ message: "Failed to fetch articles" });
  }
});

// 게시글 수정 요청 처리
// 게시글 수정 요청 처리
app.put("/articles/:id", verifyToken, async (req, res) => {
  const { id } = req.params; // 클라이언트에서 전달된 게시글 ID
  const { title, post } = req.body;

  try {
    // UUID를 사용하는 경우 findById 대신 findOne을 사용
    const article = await Article.findOne({ id });

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    // 수정하려는 사용자가 해당 게시글의 작성자인지 확인
    if (article.author !== req.user.name) {
      return res.status(403).json({ message: "Permission denied" });
    }

    article.title = title;
    article.post = post;

    await article.save();

    res.status(200).json({ message: "Article successfully updated!", article });
  } catch (error) {
    console.error("Error updating article:", error);
    res.status(500).json({ message: "Failed to update article" });
  }
});

// 게시글 삭제 요청 처리
// 게시글 삭제 요청 처리
app.delete("/articles/:id", verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    // UUID를 사용하는 경우 findOne을 통해 게시글 찾기
    const article = await Article.findOne({ id });

    if (!article) {
      return res.status(404).json({ message: "Article not found" });
    }

    // 삭제하려는 사용자가 해당 게시글의 작성자인지 확인
    if (article.author !== req.user.name) {
      return res.status(403).json({ message: "Permission denied" });
    }

    // 삭제 작업을 findOneAndDelete 또는 deleteOne으로 처리
    await Article.deleteOne({ id });

    res.status(200).json({ message: "Article successfully deleted!" });
  } catch (error) {
    console.error("Error deleting article:", error);
    res.status(500).json({ message: "Failed to delete article" });
  }
});

// 정적 파일 제공
app.use(express.static(path.join(__dirname, "../build/")));

// 기본 페이지 제공
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "../build/index.html"));
});

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "../build/index.html"));
});
