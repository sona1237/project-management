### `Project-management`

### `Description`
This project is a task management application built with React and Node.js. It allows users to create projects, add tasks to projects, and export project summaries as Gists on GitHub.

### `Features`
- Project Management: Users can create new projects with titles and descriptions.

- Task Management: Within each project, users can add, update, and delete tasks. Tasks have titles, descriptions, and statuses (pending or completed).

- Drag and Drop: Tasks can be organized using drag and drop functionality.

- Export to GitHub Gist: Users can export project summaries as Gists on GitHub, including pending and completed tasks.

### `Technologies Used`

- Frontend: React, react-beautiful-dnd, axios

- Backend: Node.js, Express.js, MongoDB

- External APIs: GitHub API for Gists

- Others: Joi for validation, Mongoose for MongoDB object modeling


### ` Installation`

- Clone the repository: git clone https://github.com/your-username/project-name.git

- Navigate to the project directory: cd project-name

- Install dependencies:

- Frontend: cd frontend && npm install

- Backend: cd backend && npm install

- Set up environment variables:

- Create a .env file in the backend directory.

- Add environment variables like  `MONGODB_URI`, `GITHUB_ACCESS_TOKEN`, etc.

- Start the backend server:  `npm run serve` in the backend directory.

- Start the frontend server:  `npm run start` in the frontend directory.


###  `Packages used`
- Tailwindcss

- Headlessui

- React router

- Axios

- UUID

- Joi

- Cors

- Dotenv

### `Usage`
Access the application in your web browser at http://localhost:3000.

LOGIN PAGE

![WhatsApp Image 2024-05-09 at 10 24 19_569433b8](https://github.com/sona1237/project-management-task/assets/146066244/2579a436-bd09-4bf7-8129-a0a67a91d7af)

Create a new project by clicking the "Add Project" button.

![WhatsApp Image 2024-05-09 at 09 53 22_66e718ad](https://github.com/sona1237/project-management-task/assets/146066244/5d1d3d11-08a7-4342-a2a5-8bbbcb07e61f)


![WhatsApp Image 2024-05-09 at 10 31 40_4b36f821](https://github.com/sona1237/project-management-task/assets/146066244/50326010-73ac-428f-9db6-1c86dcaceed6)


Add tasks to the project by clicking the "Add Todo" button.

![WhatsApp Image 2024-05-09 at 09 42 54_a5519871](https://github.com/sona1237/project-management-task/assets/146066244/913beea9-aedf-4a8d-aa3e-8ba5ad34c8b6)

Drag and drop tasks between columns to change their status.

![WhatsApp Image 2024-05-09 at 09 41 33_7fb72854](https://github.com/sona1237/project-management-task/assets/146066244/1ae04153-a8a4-48b9-9cf3-ad91ea5ea04c)

Export the project summary to GitHub Gist by clicking the "Export Gist" button.


![WhatsApp Image 2024-05-09 at 09 38 47_46b8d5be](https://github.com/sona1237/project-management-task/assets/146066244/cb17bf7e-9354-450d-9827-5ebd021755ca)

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.



