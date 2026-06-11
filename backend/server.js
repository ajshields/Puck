require("dotenv").config();
const jwt = require("jsonwebtoken");
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const pool = require("./db");
const auth = require("./middleware/auth");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get("/", (req, res) => {
  res.json({ message: "Puck API running" });
});

// DB test route
app.get("/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DB connection failed" });
  }
});

// REGISTER USER
app.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // 1. check if user already exists
    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: "User already exists" });
    }

    // 2. hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // 3. insert user into DB
    const newUser = await pool.query(
      `
      INSERT INTO users (first_name, last_name, email, password_hash)
      VALUES ($1, $2, $3, $4)
      RETURNING id, first_name, last_name, email, created_at
      `,
      [firstName, lastName, email, passwordHash]
    );
    await pool.query(
      `
      INSERT INTO user_preferences (user_id, favorite_teams, favorite_players, app_theme)
      VALUES ($1, $2, $3, $4)
      `,
      [
        newUser.rows[0].id,
        [],
        [],
        '#00F2FF'
      ]
    );

    const userId = newUser.rows[0].id;

    // 4. create default preferences row
    await pool.query(
      `
      INSERT INTO user_preferences (user_id)
      VALUES ($1)
      `,
      [userId]
    );

    // 5. return created user
    res.json(newUser.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// LOGIN USER
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. find user
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    const user = result.rows[0];
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // 2. check password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // 3. create JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 4. return token + user info
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

//GET USER PREFERENCES
app.get("/user/preferences", auth, async (req, res) => {
  try {
    const userId = req.user.userId;

    const result = await pool.query(
      `
      SELECT favorite_teams, favorite_players, app_theme
      FROM user_preferences
      WHERE user_id = $1
      `,
      [userId]
    );

    const prefs = result.rows[0];

    res.json({
      favorite_teams: prefs?.favorite_teams || [],
      favorite_players: prefs?.favorite_players || [],
      app_theme: prefs?.app_theme || "#00F2FF"
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

//SAVE USER PREFERENCES
app.post("/user/preferences", auth, async (req, res) => {
  try {
    const userId = req.user.userId;

    const {
      favorite_teams,
      favorite_players,
      app_theme
    } = req.body;

    const result = await pool.query(
      `
      UPDATE user_preferences
      SET
        favorite_teams = $1::jsonb,
        favorite_players = $2::jsonb,
        app_theme = $3,
        updated_at = NOW()
      WHERE user_id = $4
      RETURNING *
      `,
      [ JSON.stringify(favorite_teams),  JSON.stringify(favorite_players), app_theme, userId]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});