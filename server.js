const path = require("path");
const express = require("express");
const bcrypt = require("bcryptjs");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "10kb" }));
app.use(express.static(path.join(__dirname, "public")));

// demo user (in memory). in real apps, store in a db and never keep plaintext passwords
const DEMO_EMAIL = "demo@example.com";
const DEMO_PASSWORD_PLAINTEXT = "Password123!";
const DEMO_PASSWORD_HASH = bcrypt.hashSync(DEMO_PASSWORD_PLAINTEXT, 12);

function isNonEmptyString(x) {
    return typeof x === "string" && x.trim().length > 0;
}

function validateLoginOnServer(body) {
    const email = body?.email;
    const password = body?.password;

    if (!isNonEmptyString(email) || !isNonEmptyString(password)) {
        return { ok: false, status: 400, error: "Email and password are required." };
    }
    if (!email.includes("@")) {
        return { ok: false, status: 400, error: "Invalid email format." };
    }
    if (password.length < 8) {
        return { ok: false, status: 400, error: "Password must be at least 8 characters." };
    }
    if (email.length > 254 || password.length > 128) {
        return { ok: false, status: 400, error: "Input too long." };
    }
    return { ok: true, email: email.trim().toLowerCase(), password };
}

app.post("/api/login", (req, res) => {
    const v = validateLoginOnServer(req.body);
    if (!v.ok) return res.status(v.status).json({ ok: false, error: v.error });

    const emailMatches = v.email === DEMO_EMAIL;
    const passwordMatches = bcrypt.compareSync(v.password, DEMO_PASSWORD_HASH);

    // generic error message to reduce account enumeration
    if (!emailMatches || !passwordMatches) {
        return res.status(401).json({ ok: false, error: "Invalid email or password." });
    }

    // demo only success. real apps should create a secure session/token
    return res.json({ ok: true, message: "Login successful (demo)." });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Demo credentials: ${DEMO_EMAIL} / ${DEMO_PASSWORD_PLAINTEXT}`);
});

