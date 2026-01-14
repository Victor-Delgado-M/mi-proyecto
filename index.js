const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Archivo users.json en la raíz del proyecto
const USERS_FILE = path.join(__dirname, "users.json");

// Helper: asegurar que exista users.json
function ensureUsersFile() {
    if (!fs.existsSync(USERS_FILE)) {
        fs.writeFileSync(USERS_FILE, JSON.stringify([], null, 2), "utf8");
    }
}

// Helper: leer usuarios
function readUsers() {
    ensureUsersFile();
    const raw = fs.readFileSync(USERS_FILE, "utf8");
    try {
        const data = JSON.parse(raw);
        return Array.isArray(data) ? data : [];
    } catch {
        return [];
    }
}

// Helper: guardar usuarios
function writeUsers(users) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf8");
}

// ✅ Endpoint raíz (lo que tu test espera)
app.get("/", (req, res) => {
    return res.status(200).json({ message: "Servidor en ejecución" });
});

// ✅ Crear un nuevo usuario (lo que tu test espera)
app.post("/users", (req, res) => {
    const { id, name, email } = req.body || {};

    if (!id || !name || !email) {
        return res.status(400).json({ message: "Faltan campos: id, name, email" });
    }

    const users = readUsers();

    // Evitar duplicado por id
    const exists = users.some((u) => u.id === id);
    if (exists) {
        return res.status(409).json({ message: "El usuario ya existe" });
    }

    const newUser = { id, name, email };
    users.push(newUser);
    writeUsers(users);

    return res.status(201).json({ user: newUser });
});

// ✅ Obtener todos los usuarios (tu test espera Array)
app.get("/users", (req, res) => {
    const users = readUsers();
    return res.status(200).json(users);
});

// ✅ Buscar usuario por id (tu test espera { user: ... })
app.get("/users/:id", (req, res) => {
    const { id } = req.params;
    const users = readUsers();
    const user = users.find((u) => u.id === id);

    if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
    }

    return res.status(200).json({ user });
});

// ✅ Exportar app para Jest
module.exports = app;

// ✅ Iniciar servidor solo si se ejecuta directamente (no en tests)
if (require.main === module) {
    app.listen(PORT, "0.0.0.0", () => {
        console.log(`Servidor corriendo en http://0.0.0.0:${PORT}`);
    });
}
