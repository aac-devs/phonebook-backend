import express from 'express';
import Person from './models/person.js';
import cors from 'cors';
import morgan from 'morgan';
import config from './morganConfig.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan(config));
app.use(express.static('build'));

const errorHandler = (error, request, response, next) => {
  console.error(error.message);
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }
  next(error);
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};

// CREATE
app.post('/api/persons', (req, res, next) => {
  if (!req.body?.name)
    return res.status(400).json({
      error: 'name missing',
    });
  if (!req.body?.number)
    return res.status(400).json({
      error: 'number missing',
    });
  const { name, number } = req.body;
  const person = new Person({ name, number });
  person
    .save()
    .then((savedPerson) => savedPerson.toJSON())
    .then((savedAndFormattedPerson) => res.json(savedAndFormattedPerson))
    .catch((error) => next(error));
});

// GET ALL
app.get('/api/persons', (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

// GET INFO
app.get('/info', (req, res) => {
  Person.find({}).then((persons) => {
    const msg = `<p>Phonebook has info for ${
      persons.length
    } people</p><p>${new Date()}</p>`;
    res.send(msg);
  });
});

// GET ONE
app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then((person) => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).send();
      }
    })
    .catch((error) => next(error));
});

// DELETE
app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then((result) => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

// PUT
app.put('/api/persons/:id', (req, res, next) => {
  const person = {
    number: req.body.number,
  };
  Person.findByIdAndUpdate(req.params.id, person, { new: true })
    .then((updatedPerson) => {
      res.json(updatedPerson);
    })
    .catch((error) => next(error));
});

app.use(errorHandler);
app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
