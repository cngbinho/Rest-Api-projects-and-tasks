const express = require("express");

const server = express();

server.use(express.json());

// Massa de dados
const projects = [
  {
    id: "1",
    title: "Projeto Teste",
    tasks: ["Task1, Task2"]
  }
];

let numExecute = 0;

// Middlewares
const checkExistProject = (req, res, next) => {
  const { id } = req.params;

  const existProject = projects.find(project => {
    if (project.id === id) {
      return true;
    }
  });

  if (!existProject) {
    return res.send({ message: "Project does not exist." });
  }

  next();
};

const numExecuteRotes = (req, res, next) => {
  console.log(numExecute++);
  next();
};

// Rotas
server.get("/projects", numExecuteRotes, (req, res) => {
  return res.send(projects);
});

server.post("/projects", numExecuteRotes, (req, res) => {
  projects.push(req.body);
  res.send(projects);
});

server.post(
  "/projects/:id/tasks",
  checkExistProject,
  numExecuteRotes,
  (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    const project = projects.find(project => {
      if (project.id === id) {
        if (project.tasks) {
          project.tasks.push(title);
        } else {
          project.tasks = [title];
        }
        return project;
      }
    });

    res.send(project);
  }
);

server.put("/projects/:id", checkExistProject, numExecuteRotes, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(project => {
    if (project.id === id) {
      project.title = title;
      return project;
    }
  });

  res.send(project);
});

server.delete(
  "/projects/:id",
  checkExistProject,
  numExecuteRotes,
  (req, res) => {
    const { id } = req.params;
    let msg = {};

    const project = projects.find(project => {
      if (project.id === id) {
        const idx = projects.indexOf(project);
        projects.splice(idx, 1);

        msg = { message: `Project ${project.title} has ben deleted` };

        return { message: `Project ${project.title} has ben deleted` };
      }
    });

    res.send(msg);
  }
);

server.listen(3000);
