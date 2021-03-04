const express = require("express");
const cors = require("cors");

const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url, 
    techs,
    likes: 0,
  }

  repositories.push(repository);

  return response.json(repository)
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  let index = 0
  
  const foundRepository = repositories.find(function(repository, repositoryIndex) {
    if(id == repository.id) {
      index = repositoryIndex
      return true
    }
  })

  if(!foundRepository) {
    return response.status(400).json({ error: "Repository not-found" });
  }

  const repository = {
    ...foundRepository,
    title,
    url,
    techs,
  }

  repositories[index] = repository

  return response.json(repository)
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id === id)

  if(repositoryIndex < 0) {
    return response.status(400).json({ menssage: "Error deleting repository" });
  }

  repositories.splice(repositoryIndex, 1)

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repository = repositories.find(repository => repository.id == id)

  if(!repository) {
    return response.status(400).json({ error: "Repository not-found" });
  }

  repository.likes++;

  return response.json(repository)
});

module.exports = app;
