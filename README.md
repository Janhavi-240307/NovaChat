# NovaChat

NovaChat is a full-stack AI chat application inspired by modern conversational AI platforms. It allows users to create, manage, and search conversations while interacting with an AI assistant powered by the OpenAI API.

## Live Demo

https://nova-chat-chi-sandy.vercel.app/

<img width="1907" height="1027" alt="NovaChat" src="https://github.com/user-attachments/assets/29b9b2e9-1d28-4f3f-a14c-14e3f31d2b59" />

## Features

### Authentication and Security

- User registration and login
- JWT-based authentication and authorization
- Secure password hashing using bcrypt
- Forgot password functionality
- Password reset via email
- User-specific access to conversations
- Protected API routes using authentication middleware

### AI Chat

- AI-powered conversations using the OpenAI API
- Create new conversations
- Persistent chat history
- Automatic conversation titles
- Markdown rendering for AI responses
- Syntax highlighting for code responses

### Conversation Management

- View recent conversations
- Search conversations
- Rename conversations
- Delete conversations
- Export conversations
- Persistent thread management
- User-specific conversation history

### User Interface

- Responsive chat interface
- Modern conversational interface
- Separate Chat Mode and Interview Mode structure
- Interactive sidebar for conversation management
- Markdown and code rendering support

Chat Mode is currently functional, while Interview Mode is under development.

## Tech Stack

### Frontend

- React
- Vite
- JavaScript
- CSS
- React Markdown
- Highlight.js
- Lucide React
- UUID

### Backend

- Node.js
- Express.js
- REST APIs
- OpenAI API
- bcrypt
- JSON Web Token (JWT)
- Nodemailer
- dotenv
- CORS
- Crypto

### Database

- MongoDB
- Mongoose

### Development and Deployment

- Git
- GitHub
- Visual Studio Code
- Nodemon
- Vercel

## Authentication

NovaChat uses JWT-based authentication to protect user-specific resources and conversations.

Passwords are securely hashed using bcrypt before being stored in the database. Protected API routes use authentication middleware to validate requests and associate conversations with the authenticated user.

The application also includes email-based password reset functionality using Nodemailer.

## Chat Functionality

The frontend communicates with the Express REST API to process user messages. The backend handles the OpenAI API integration and stores conversations and messages in MongoDB using Mongoose.

AI responses support Markdown formatting and syntax highlighting for code blocks.


## Author

**Janhavi Singh**

[GitHub](https://github.com/Janhavi-240307)· [LinkedIn](https://www.linkedin.com/in/janhavisingh2403)
