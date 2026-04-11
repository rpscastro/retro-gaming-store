const express = require("express");
const bodyParser = require("body-parser");
const mongodb = require("./data/database");
const app = express();
const passport = require("passport");
const session = require("express-session");
const GitHubStrategy = require("passport-github2").Strategy;
const cors = require("cors");

const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app
  .use(
    session({
      secret: "secret",
      resave: false,
      saveUninitialized: true,
    }),
  )
  // This is the basic express session({..}) initialization.
  .use(passport.initialize())
  // init passport on every route call
  .use(passport.session());
// allow passport to use "express-session".

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS, PATCH",
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Z-Key, Authorization",
  );
  next();
});

app
  .use(cors({ methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"] }))
  .use(cors({ origin: "*" }));

app.use("/", require("./routes"));


mongodb.initDb((err) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port, () => {
      console.log(`Database is listening and node is running on port ${port}`);
    });
  }
});


passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
    },
    async function (accessToken, refreshToken, profile, done) {
      // Here, you would typically find or create a user in your database
      // For this example, we'll just return the GitHub profile
      // User.findOrCreate({ githubId: profile.id }, function (err, user) {
      //   return done(err, user);
      // });
      try {
        const db = mongodb.getDatabase();
        const users = db.db().collection("users");
          
        
        // Find user by GitHub ID
        let user = await users.findOne({ github_id: profile.id });

        if (!user) {
          // Insert new user
          const newUser = {
            github_id: profile.id,
            email: profile.emails?.[0]?.value || null,
            address: null, // optional, can be filled later
            phone: null, // optional, can be filled later
            name: profile.displayName || null,
            username: profile.username
          };
          const result = await users.insertOne(newUser);
          user = await users.findOne({ _id: result.insertedId });
        }

        return done(null, user);
      } catch (err) {
        console.error("Database error:", err);
        return done(err); // Passport will handle this as a 500 error
      }
    },
  ),
);


passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const db = mongodb.getDatabase();
    const users = db.db().collection("users");
    const user = await users.findOne({ _id: id });
    done(null, user);
  } catch (err) {
    done(err);
  }
});


app.get("/", (req, res) => {
  res.send(
    req.session.user !== undefined
      ? `Logged in as ${req.session.user.displayName || req.session.user.name || req.session.user.username}`
      : "Logged out",
  );
});

app.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/api-docs",
    session: false,
  }),
  (req, res) => {
    req.session.user = req.user;
    res.redirect("/");
  },
);

process.on("uncaughtException", (err, origin) => {
  console.log(
    process.stderr.fd,
    `Caught exception: ${err}\n` + `Exception origin: ${origin}`,
  );
});


