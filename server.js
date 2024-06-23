const express = require("express");
const app = express();
var db = require("./js/database.js");
const bodyParser = require("body-parser");
require("dotenv").config();
var session = require("express-session");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(bodyParser.json());
app.use(express.static("public"));
app.use(express.json());

app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true,
  })
);

function checkAuth(req, res, next) {
  if (!req.session.authenticated) {
    res.redirect("/login");
  } else {
    next();
  }
}

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/public/html/index.html");
});

app.post("/api/login", function (req, res) {
  let { username, password } = req.body;

  db.get(
    "SELECT * FROM users WHERE username = ? AND password = ?",
    [username, password],
    function (err, row) {
      if (err) {
        res.status(500).json({
          error: err.message,
        });
      } else if (row) {
        req.session.userid = row.id;
        req.session.username = username;
        req.session.password = password;
        req.session.authenticated = true;

        res.status(200).json({
          message: "Login successful",
        });
      } else {
        res.status(400).json({
          error: "Invalid username or password",
        });
      }
    }
  );
});

app.get("/login", function (req, res) {
  res.sendFile(__dirname + "/public/html/index.html");
});

app.post("/api/register", function (req, res) {
  let { username, password } = req.body;

  db.run(
    "INSERT INTO users (username, password) VALUES (?, ?)",
    [username, password],
    function (err) {
      if (err) {
        if (err.errno == 19) {
          res.status(400).json({
            error: "Username already exists",
          });
        } else {
          res.status(500).json({
            error: err.message,
          });
        }
      } else {
        res.status(200).json({
          message: "User created successfully",
        });
      }
    }
  );
});

app.get("/register", function (req, res) {
  res.sendFile(__dirname + "/public/html/register.html");
});

app.get("/api/cytaty", (req, res) => {
  const autor = req.query.autor;

  if (autor) {
    // Jeśli podano autora, pobierz cytaty tylko dla tego autora
    db.all(
      "SELECT * FROM cytaty WHERE autor = ? ORDER BY data DESC",
      [autor],
      (err, rows) => {
        if (err) {
          res.json({
            success: false,
            error: err.message,
          });
        } else {
          res.json({
            success: true,
            cytaty: rows,
          });
        }
      }
    );
  } else {
    // Jeśli nie podano autora, pobierz wszystkie cytaty
    db.all("SELECT * FROM cytaty ORDER BY data DESC", [], (err, rows) => {
      if (err) {
        res.json({
          success: false,
          error: err.message,
        });
      } else {
        res.json({
          success: true,
          cytaty: rows,
        });
      }
    });
  }
});

app.get("/cytaty", function (req, res) {
  if (req.session.authenticated == true) {
    res.sendFile(__dirname + "/public/html/main/cytaty.html");
  } else {
    res.redirect("/login");
  }
});

app.get("/api/getID", (req, res) => {
  res.json({
    id: req.session.userid,
  });
});

app.post("/api/dodaj_cytat", (req, res) => {
  const { tresc, autor, date, id_autora } = req.body;

  db.run(
    "INSERT INTO cytaty (tresc, autor, data, id_autora) VALUES (?, ?, ?, ?)",
    [tresc, autor, date, id_autora],
    function (err) {
      if (err) {
        res.json({
          success: false,
          error: err.message,
        });
      } else {
        const cytatyId = this.lastID;
        // Pobierz dodany cytat wraz z datą i odeślij do klienta
        db.get("SELECT * FROM cytaty WHERE id = ?", [cytatyId], (err, row) => {
          if (err) {
            res.json({
              success: false,
              error: err.message,
            });
          } else {
            res.json({
              success: true,
              cytat: row,
            });
          }
        });
      }
    }
  );
});

app.get("/api/cytaty/getAutors", (req, res) => {
  db.all(
    "SELECT DISTINCT autor FROM cytaty ORDER BY autor COLLATE NOCASE ASC",
    [],
    (err, rows) => {
      if (err) {
        res.json({
          success: false,
          error: err.message,
        });
      } else {
        res.json({
          success: true,
          autory: rows,
        });
      }
    }
  );
});

app.delete("/api/cytaty/:id", (req, res) => {
  const id = req.params.id;
  db.run("DELETE FROM cytaty WHERE id = ?", [id], (err) => {
    if (err) {
      res.json({
        success: false,
        error: err.message,
      });
    } else {
      res.json({
        success: true,
      });
    }
  });
});

app.put("/api/cytaty/:id", (req, res) => {
  const id = req.params.id;
  const { tresc } = req.body;
  db.run("UPDATE cytaty SET tresc = ? WHERE id = ?", [tresc, id], (err) => {
    if (err) {
      res.json({
        success: false,
        error: err.message,
      });
    } else {
      res.json({
        success: true,
      });
    }
  });
});

app.listen(80, () => {
  console.log(`Aplikacja jest dostępna na porcie 80`);
});
