import express from 'express';
const app = express();

app.use(express.json());

let persons = [
  {
    name: 'Arto Hellas',
    number: '040-123456',
    id: 1,
  },
  {
    name: 'Ada Lovelace',
    number: '39-44-5323523',
    id: 2,
  },
  {
    name: 'Dan Abramov',
    number: '12-43-234345',
    id: 3,
  },
  {
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
    id: 4,
  },
];

app.get('/', (req, res) => {
  res.send('<h1>PHONEBOOK</h1>');
});

app.get('/api/persons', (req, res) => {
  res.json(persons);
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
  const { name, number } = req.body;
  const id = Math.floor(Math.random() * 10000);
  const newPerson = { name, number, id };
  persons = persons.concat(newPerson);
  res.json(newPerson);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
