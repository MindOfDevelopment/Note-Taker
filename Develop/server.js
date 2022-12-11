const express = require("express");
const fs = require("fs");

const app = express();
// Middlewares
app.use(express.json());

// Set Public folder
app.use(express.static("public"));

// Routes
app.get("/notes", (req, res) => {
  res.sendFile(__dirname + "/public/notes.html");
});

// API Routes
app.get("/api/notes", (req, res) => {
  fs.readFile("db/db.json", "utf-8", (err, data) => {
    if (err) throw err;

    res.json(JSON.parse(data));
  });
});

// Add new Note Route
app.post("/api/notes", (req, res) => {
  const title = req.body.title;
  const text = req.body.text;

  const newNote = { title, text, id: Date.now() }; // new item unique id
  const notes = fs.readFileSync("db/db.json", "utf-8"); // Read all existing notes from the db.js
  const notesData = JSON.parse(notes); // convert json data to javascript objects
  notesData.push(newNote); // Add the nnew note object to the array of all note data
  const jsonNotes = JSON.stringify(notesData); // convert the notes data to json strings
  // Write the new modified notes data to the file
  fs.writeFile("db/db.json", jsonNotes, "utf-8", (error) => {
    if (error) {
      throw error;
    }
    // Send response with the new note object
    res.status(201).json(newNote);
  });
});

app.delete("/api/notes/:id", (req, res) => {
  const id = req.params.id;

  const notes = fs.readFileSync("db/db.json", "utf-8");
  const notesData = JSON.parse(notes);
  const index = notesData.findIndex((note) => note.id === id); // Get an index of a note with the request ID
  notesData.splice(index, 1); // delete a note at thi index
  const jsonNotes = JSON.stringify(notesData);
  fs.writeFile("db/db.json", jsonNotes, "utf-8", (error) => {
    if (error) {
      throw error;
    }
    res.status(204).json({ message: "Deleted!" });
  });
});

app.get("*", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running at port 3000");
});
