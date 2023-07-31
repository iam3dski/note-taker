const express = require('express');
const notes = express.Router();
const { readFromFile, readAndAppend, writeToFile } = require('../helpers/fsUtils');
const { v4: uuidv4 } = require('uuid');

// GET Route for retrieving all the notes
notes.get('/notes', (req, res) => {
  readFromFile('./db/db.json')
    .then((data) => res.json(JSON.parse(data)))
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'Failed to retrieve notes' });
    });
});

// POST Route for adding a new note
notes.post('/notes', (req, res) => {
  const { title, text } = req.body;
  if (title && text) {
    const newNote = {
      id: uuidv4(), // Use uuid to generate a unique ID for the new note
      title,
      text,
    };
    readAndAppend(newNote, './db/db.json')
      .then(() => {
        res.json({ message: 'Note added successfully 🚀', note: newNote });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ error: 'Failed to add note' });
      });
  } else {
    res.status(400).json({ error: 'Title and text are required fields' });
  }
});

// DELETE Route for deleting a note by ID
notes.delete('/notes/:id', (req, res) => {
  const noteId = req.params.id;
  readFromFile('./db/db.json')
    .then((data) => JSON.parse(data))
    .then((notes) => {
      const updatedNotes = notes.filter((note) => note.id !== noteId);
      if (updatedNotes.length !== notes.length) {
        writeToFile('./db/db.json', JSON.stringify(updatedNotes))
          .then(() => {
            res.json({ message: 'Note deleted successfully.' });
          })
          .catch((err) => {
            console.error(err);
            res.status(500).json({ error: 'Failed to delete note' });
          });
      } else {
        res.status(404).json({ error: 'Note not found' });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: 'Failed to retrieve notes' });
    });
});

module.exports = notes;
