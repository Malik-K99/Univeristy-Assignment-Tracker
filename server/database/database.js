const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

//make data folder
const dataDirectory = path.join(__dirname, "..", "data");

fs.mkdirSync(dataDirectory, {recursive: true});

//make sql database
const dbPath = path.join(dataDirectory, "assignments.db");
const db = new Database(dbPath);

db.pragma("journal_mode = WAL");

db.exec(`
    CREATE TABLE IF NOT EXISTS assignments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    module TEXT NOT NULL,
    dueDate TEXT NOT NULL,
    completed INTEGER NOT NULL DEFAULT 0,
    createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
`);

const count = db
.prepare("SELECT COUNT(*) AS count FROM assignments")
.get();

if(count.count === 0)
{
    const insert = db.prepare(`
        INSERT INTO assignments
        (title, module, dueDate, completed)
        VALUES(?,?,?,?)
    `);

    const addStarterData = db.transaction(() => {
        insert.run(
            "Project_01",
            "CS564",
            "2026-09-11",
            0
        );

        insert.run(
            "Report_01",
            "CS599",
            "2026-09-18",
            0
        );

        insert.run(
            "Assignment_02",
            "CS002",
            "2026-09-25",
            1
        );
    });

    addStarterData();
}

module.exports = db;