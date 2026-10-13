const express = require("express");
const cors = require("cors");

const db = require("./database/database");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 3000;

function formatAssignment(row) {
    return {
        id: row.id,
        title: row.title,
        module: row.module,
        dueDate: row.dueDate,
        completed: Boolean(row.completed),
        createdAt: row.createdAt
    };
}

app.get("/api/assignments", (req,res) => {
    const rows = db.prepare(`
        SELECT *
        FROM assignments
        ORDER BY dueDate ASC
    `)
    .all();

    const assignments = rows.map(formatAssignment);

    res.json(assignments);
});

//add
app.post("/api/assignments", (req, res) => {
    const{title,module,dueDate} = req.body;

    if(!title || !title.trim())
    {
        return res.status(400).json({
            message: "Assignment title is required"
        });
    }

    if(title.trim().length > 100)
    {
        return res.status(400).json({
            message: "Max Assignment title length is 100 characters"
        });
    }

    if(!module || !module.trim())
    {
        return res.status(400).json({
            message: "Module is required"
        });
    }

    if(!dueDate)
    {
        return res.status(400).json({
            message: "Due date is required"
        });
    }

    if(Number.isNaN(Date.parse(dueDate)))
    {
        return res.status(400).json({
            message: "Due date must be a valid date."
        });
    }

    const result = db.prepare(`
        INSERT INTO assignments
        (title,module,dueDate,completed)
        VALUES (?,?,?,?)
    `)
    .run(
        String(title).trim(),
        String(module).trim(),
        String(dueDate),
        0
    );

    const newAssignment = db.prepare(`
        SELECT *
        FROM assignments
        WHERE id = ?
    `)
    .get(result.lastInsertRowid);

    res.status(201).json(newAssignment);
});

//update
app.put("/api/assignments/:id", (req, res) => {
    const id  = Number(req.params.id);

    if(!Number.isInteger(id))
    {
        return res.status(400).json({
            message: "Invalid assignment ID."
        });
    }

    const assignment = db.prepare(`
        SELECT *
        FROM assignments
        WHERE id = ?
    `)
    .get(id);

    if(!assignment)
    {
        return res.status(404).json({
            message: "Assignment not found."
        });
    }

    if (typeof req.body.completed !== "boolean")
    {
        return res.status(400).json({
            message: "Completed must be true or false."
        });
    }

    db.prepare(`
        UPDATE assignments
        SET completed = ?
        WHERE id = ?
    `)
    .run(
        req.body.completed ? 1 : 0,
        id
    );

    const updatedAssignment = db.prepare(`
            SELECT *
            FROM assignments
            WHERE id = ?
    `)
    .get(id);

    res.json(formatAssignment(updatedAssignment));

});

//delete
app.delete("/api/assignments/:id", (req, res) => {
    const id = Number(req.params.id);

    if(!Number.isInteger(id))
    {
        return res.status(400).json({
            message: "Invalid assignment ID."
        });
    }

    const result = db.prepare(`
        DELETE FROM assignments
        WHERE id = ?
    `)
    .run(id);

    if (result.changes === 0)
    {
        return res.status(404).json({
            message: "Assignment not found."
        });
    }

    res.json({
        message: "Assignment deleted succuessfully."
    });

});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
