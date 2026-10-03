# NovaChat

NovaChat is a full-stack AI chat application inspired by modern conversational AI platforms. It enables users to securely create, manage, and search conversations while interacting with an AI assistant powered by the OpenAI API.

## Live Demo

https://nova-chat-chi-sandy.vercel.app/

## Features

### Authentication and Security

* User registration and login
* JWT-based authentication and authorization
* Secure password hashing using bcrypt
* Forgot password functionality
* Password reset via email
* User-specific access to conversations

### AI Chat

* AI-powered conversations using the OpenAI API
* Creation of new conversations
* Persistent chat history
* Automatic conversation titles
* Markdown rendering for AI responses
* Syntax highlighting for code responses

### Conversation Management

* View recent conversations
* Search conversations
* Rename conversations
* Delete conversations
* Export conversations
* Persistent thread management
* User-specific conversation history

### User Interface

* Responsive chat interface
* Separate Chat Mode and Interview Mode structure
* Modern conversational interface
* Code syntax highlighting
* Interactive conversation management

Chat Mode is currently functional, while Interview Mode is under development.

## Tech Stack

### Frontend

* React
* Vite
* JavaScript
* CSS
* React Markdown
* Highlight.js
* Lucide React
* UUID

### Backend

* Node.js
* Express.js
* REST APIs
* OpenAI API
* bcrypt
* JSON Web Token (JWT)
* Nodemailer
* dotenv
* CORS
* Crypto

### Database

* MongoDB
* Mongoose

### Development and Deployment

* Git
* GitHub
* Visual Studio Code
* Nodemon
* Vercel

## Architecture

NovaChat follows a client-server architecture consisting of a React frontend, Express backend, OpenAI API integration, and MongoDB database.

```text
React + Vite Frontend
        |
        | REST API
        v
Node.js + Express Backend
        |
        +-- Authentication
        +-- Chat API
        +-- OpenAI API Integration
        +-- Password Reset
        |
        v
MongoDB + Mongoose
```

## Authentication

NovaChat uses JWT-based authentication to secure protected resources and ensure that users can access only their own conversations.

```text
User
 |
 +-- Registration / Login
 |
 v
Express Authentication API
 |
 +-- bcrypt Password Hashing
 +-- JWT Authentication
 |
 v
Authenticated API Requests
 |
 v
User-specific Threads and Messages
```

Password reset functionality uses email-based verification through Nodemailer.

## Chat Flow

```text
User Message
      |
      v
React Frontend
      |
      v
Express REST API
      |
      v
OpenAI API
      |
      v
AI Response
      |
      +-- Displayed in Chat Interface
      |
      +-- Stored in MongoDB
```

## Project Structure

```text
NovaChat/
|
+-- frontend/
|   +-- src/
|   |   +-- components/
|   |       +-- Chat.jsx
|   |       +-- ChatWindow.jsx
|   |       +-- Sidebar.jsx
|   |       +-- Login.jsx
|   |       +-- Signup.jsx
|   |       +-- Dashboard.jsx
|   |       +-- ...
|   |
|   +-- package.json
|
+-- backend/
|   +-- routes/
|   |   +-- auth.js
|   |   +-- chat.js
|   |
|   +-- models/
|   |   +-- User.js
|   |   +-- Thread.js
|   |
|   +-- middleware/
|   |   +-- authMiddleware.js
|   |
|   +-- server.js
|   +-- package.json
|
+-- README.md
```

## Local Setup

### Clone the Repository

```bash
git clone <your-github-repository-url>
cd NovaChat
```

### Install Frontend Dependencies

```bash
cd frontend
npm install
```

### Install Backend Dependencies

```bash
cd ../backend
npm install
```

### Environment Variables

Create a `.env` file in the backend directory and configure the required environment variables.

```env
PORT=8080
MONGODB_URI=your_mongodb_connection_string
OPENAI_API_KEY=your_openai_api_key
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

### Run the Backend

```bash
npm run dev
```

### Run the Frontend

Open a separate terminal:

```bash
cd frontend
npm run dev
```

The frontend will run using Vite, while the Express backend will run on the configured port.

## Future Improvements

* Complete Interview Mode
* AI-generated interview questions
* Automated answer evaluation
* Interview performance scoring
* Weak-area identification
* Personalized interview practice sets
* Additional AI model support
* Improved application monitoring

## Project Status

NovaChat is an actively developed full-stack application.

### Implemented

* User authentication
* JWT authorization
* AI chat functionality
* Persistent conversations
* Thread management
* Conversation search
* Conversation renaming
* Conversation deletion
* Conversation export
* Password reset
* Production deployment

### In Development

* Interview Mode

## License

This project is developed for educational and portfolio purposes.
