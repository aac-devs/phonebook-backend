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

app.get('/api/persons', (req, res) => {
  Person.find({}).then((persons) => {
    res.json(persons);
  });
});

app.get('/info', (req, res) => {
  const msg = `<p>Phonebook has info for ${
    persons.length
  } people</p><p>${new Date()}</p>`;
  res.send(msg);
});

app.get('/api/persons/:id', (req, res) => {
  const { id } = req.params;
  const person = persons.find((p) => p.id === +id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).send();
  }
});

app.delete('/api/persons/:id', (req, res) => {
  const { id } = req.params;
  persons = persons.filter((p) => p.id !== +id);
  res.status(204).end();
});

app.post('/api/persons', (req, res) => {
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
  person.save().then((personSaved) => {
    res.json(personSaved);
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
