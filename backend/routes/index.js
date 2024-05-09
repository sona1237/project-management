import express from 'express';
import joi from 'joi';
import mongoose from 'mongoose';
import Project from '../models/index.js';
import axios from 'axios';
import fs from 'fs'; // Import the fs module

const api = express.Router();
const GITHUB_ACCESS_TOKEN = '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';

// Get all projects
api.get('/projects', async (req, res) => {
    try {
        const data = await Project.find({}, { task: 0, __v: 0, updatedAt: 0 });
        return res.send(data);
    } catch (error) {
        return res.send(error);
    }
});

// Get a specific project by ID
api.get('/project/:id', async (req, res) => {
    if (!req.params.id) res.status(422).send({ data: { error: true, message: 'Id is required' } });
    try {
        const data = await Project.find({ _id: mongoose.Types.ObjectId(req.params.id) }).sort({ order: 1 });
        return res.send(data);
    } catch (error) {
        return res.send(error);
    }
});

// Create a new project
api.post('/project', async (req, res) => {
    const project = joi.object({
        title: joi.string().min(3).max(30).required(),
        description: joi.string().required(),
    });

    const { error, value } = project.validate(req.body);
    if (error) return res.status(422).send(error);

    try {
        const data = await new Project(value).save();
        res.send({ data: { title: data.title, description: data.description, updatedAt: data.updatedAt, _id: data._id } });
    } catch (e) {
        if (e.code === 11000) {
            return res.status(422).send({ data: { error: true, message: 'Title must be unique' } });
        } else {
            return res.status(500).send({ data: { error: true, message: 'Server error' } });
        }
    }
});

// Update a project by ID
api.put('/project/:id', async (req, res) => {
    const project = joi.object({
        title: joi.string().min(3).max(30).required(),
        description: joi.string().required(),
    });

    const { error, value } = project.validate(req.body);
    if (error) return res.status(422).send(error);

    Project.updateOne({ _id: mongoose.Types.ObjectId(req.params.id) }, { ...value }, { upsert: true }, (error, data) => {
        if (error) {
            res.send(error);
        } else {
            res.send(data);
        }
    });
});

// Delete a project by ID
api.delete('/project/:id', async (req, res) => {
    try {
        const data = await Project.deleteOne({ _id: mongoose.Types.ObjectId(req.params.id) });
        res.send(data);
    } catch (error) {
        res.send(error);
    }
});

// Create a new task for a project
api.post('/project/:id/task', async (req, res) => {
    if (!req.params.id) return res.status(500).send(`Server error`);

    const task = joi.object({
       title:joi.string().required(),
        description: joi.string().required(),
        status: joi.boolean().required(),// Assuming false means pending and true means completed
        date: joi.date().iso()
    });

    const { error, value } = task.validate(req.body);
    if (error) return res.status(422).send(error);

    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).send({ error: true, message: 'Project not found' });

        project.Todos.push(value);
        await project.save();
        return res.send(project);
    } catch (error) {
        return res.status(500).send(error);
    }
});

// Get a specific task by task ID
api.get('/project/:id/task/:taskId', async (req, res) => {
    try {
        console.log("Fetching task details...");
        const project = await Project.findById(req.params.id);
        if (!project) {
            console.log("Project not found");
            return res.status(404).send({ error: true, message: 'Project not found' });
        }

        console.log("Project found. Searching for task...");
        const task = project.Todos.find(task => task._id.toString() === req.params.taskId);
        if (!task) {
            console.log("Task not found");
            return res.status(404).send({ error: true, message: 'Task not found' });
        }

        console.log("Task found. Sending task details.");
        return res.send(task);
    } catch (error) {
        console.error("Error while fetching task details:", error);
        return res.status(500).send(error);
    }
});

// Update a task by task ID
api.put('/project/:id/task/:taskId', async (req, res) => {
    console.log('PUT request received'); // Add a console.log statement to indicate the start of the PUT request handler

    const task = joi.object({
        title: joi.string().required(),
        description: joi.string().required(),
        status: joi.boolean().required(),
        date: joi.date().iso()
    });

    const { error, value } = task.validate(req.body);
    if (error) {
        console.log('Validation error:', error); // Log any validation errors
        return res.status(422).send(error);
    }

    try {
        console.log('Finding project by ID:', req.params.id); // Log the project ID being searched for
        const project = await Project.findById(req.params.id);
        if (!project) {
            console.log('Project not found'); // Log if project is not found
            return res.status(404).send({ error: true, message: 'Project not found' });
        }

        const taskIndex = project.Todos.findIndex(task => task._id.toString() === req.params.taskId);
        if (taskIndex === -1) {
            console.log('Task not found'); // Log if task is not found
            return res.status(404).send({ error: true, message: 'Task not found' });
        }

        console.log('Updating task with ID:', req.params.taskId); // Log the task ID being updated
        project.Todos[taskIndex].title = value.title; // Attempt to update the title

        await project.save();
        console.log('Project saved successfully:', project); // Log the updated project object
        return res.send(project);
    } catch (error) {
        console.error('Error:', error); // Log any other errors that occur
        return res.status(500).send(error);
    }
});


// Delete a task by task ID
api.delete('/project/:id/task/:taskId', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) return res.status(404).send({ error: true, message: 'Project not found' });

        const taskIndex = project.Todos.findIndex(task => task._id.toString() === req.params.taskId);
        if (taskIndex === -1) return res.status(404).send({ error: true, message: 'Task not found' });

        project.Todos.splice(taskIndex, 1);
        await project.save();
        return res.send(project);
    } catch (error) {
        return res.status(500).send(error);
    }
});



api.post('/project/:id/export-gist', async (req, res) => {
  try {
    // Fetch project details from the database
    const project = await Project.findById(req.params.id);
    if (!project) {
      console.log('Project not found.');
      return res.status(404).json({ error: 'Project not found' });
    }
    console.log('Project found:', project);

    // Check if project title exists before proceeding
    if (!project.title) {
      console.log('Project title is missing.');
      return res.status(500).json({ error: 'Project title is missing' });
    }

    // Generate markdown content for the project summary
    console.log('Generating markdown content...');
    const markdownContent = generateMarkdownContent(project);
    console.log('Markdown content generated:', markdownContent);

    // Save the exported gist file to the local system
    const filename = `${project.title}.md`;
    const directoryPath = './exports/'; // Directory path
    const filePath = `${directoryPath}${filename}`; // Full file path

    // Ensure the directory exists
    try {
      fs.mkdirSync(directoryPath, { recursive: true }); // Create directory recursively
    } catch (error) {
      console.error('Error creating directory:', error);
      return res.status(500).json({ error: 'Failed to create directory' });
    }

    console.log('Saving exported gist file to local system...');
    fs.writeFileSync(filePath, markdownContent);
    console.log('Exported gist file saved:', filePath);

    // Create Gist using GitHub API
    console.log('Creating Gist using GitHub API...');
    const response = await axios.post('https://api.github.com/gists', {
      files: {
        [`${project.title}.md`]: {
          content: markdownContent
        }
      },
      public: false
    }, {
      headers: {
       Authorization: `token ${GITHUB_ACCESS_TOKEN}` // Use the actual token variable here
      }
    });
    console.log('Gist created:', response.data.html_url);

    // Send only the gist URL in the response
    res.json({ gistUrl: response.data.html_url });

  } catch (error) {
    console.error('Error exporting Gist:', error);
    res.status(500).json({ error: 'Failed to export Gist' });
  }
});


// Helper function to generate markdown content
function generateMarkdownContent(project) {
    console.log('Generating markdown content for project:', project);

    // Check if project or project.todos is undefined
    if (!project || !project.Todos || !Array.isArray(project.Todos)) {
        console.error('Invalid project object or missing Todos array.');
        return ''; // Return an empty string if project or Todos array is invalid or missing
    }

    const pendingTodos = getPendingTodos(project);
    const completedTodos = getCompletedTodos(project);

    const pendingTasksList = pendingTodos.map(todo => `   - ◻ ${todo.title}`).join('\n');
    const completedTasksList = completedTodos.map(todo => `   - ☑ ${todo.title}`).join('\n');

    return `
*${project.title}*

Summary: *${getCompletedTodoCount(project)}* / ${project.Todos.length} todos completed

*Pending*
${pendingTasksList}

*Completed*
${completedTasksList}
`;
}


// Function to generate a formatted task list
function generateFormattedTaskList(tasks) {
    let formattedList = '';
    tasks.forEach(task => {
        // Determine the status icon and text color
        const statusIcon = task.status ? '☑️' : '◻️';
        const textColor = task.status ? '#00FF00' : '#FF0000';

        // Format the task item
        const formattedTask = `${statusIcon} ${task.title.padEnd(20)} ${task.description.padEnd(30)}\n`;
        
        // Add the formatted task to the list
        formattedList += `<span style="color: ${textColor}">${formattedTask}</span>`;
    });
    return formattedList;
}

// Helper functions
function getCompletedTodoCount(project) {
  console.log('Calculating completed todo count for project:', project);
  if (!project || !project.Todos || !Array.isArray(project.Todos)) {
    console.error('Invalid project object or missing Todos array.');
    return 0; // Return 0 if project or Todos array is invalid or missing
  }
  return project.Todos.filter(todo => todo.status === true).length;
}

function getPendingTodos(project) {
  console.log('Fetching pending todos for project:', project);
  return project.Todos.filter(todo => todo.status === false); // Filter based on boolean value
}

function getCompletedTodos(project) {
  console.log('Fetching completed todos for project:', project);
  return project.Todos.filter(todo => todo.status === true); // Filter based on boolean value
}

export default api;
