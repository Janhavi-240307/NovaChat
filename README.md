# NovaChat

NovaChat is a full-stack AI chat application inspired by modern conversational AI platforms. It allows users to create, manage, and search conversations while interacting with an AI assistant powered by the OpenAI API.

## Live Demo

https://nova-chat-chi-sandy.vercel.app/

<img width="1907" height="1027" alt="NovaChat" src="https://github.com/user-attachments/assets/29b9b2e9-1d28-4f3f-a14c-14e3f31d2b59" />

## Features

### Authentication and Security

- User registration and login
- JWT-based authentication and authorization (7-day token expiry)
- Secure password hashing using bcrypt
- Forgot password functionality
- Password reset via email (secure random token, valid for 15 minutes)
- User-specific access to conversations
- Protected API routes using authentication middleware

### AI Chat

- AI-powered conversations using the OpenAI API (`gpt-4o-mini`)
- Create new conversations
- Persistent chat history stored in MongoDB
- Automatic conversation titles (generated from the first message)
- Markdown rendering for AI responses
- Syntax highlighting for code responses
- Typing effect for new AI replies

### Conversation Management

- View recent conversations
- Search conversations by title
- Rename conversations
- Delete conversations
- Export conversations as a `.txt` file
- Persistent thread management
- User-specific conversation history

### User Interface

- Responsive chat interface with a collapsible sidebar on mobile
- Welcome dashboard with Chat Mode and Interview Mode cards
- Interactive sidebar for conversation management
- Markdown and code rendering support

Chat Mode is currently functional, while Interview Mode is under development.

## Tech Stack

### Frontend

- React 19
- Vite
- JavaScript
- CSS
- React Markdown
- rehype-highlight (Highlight.js)
- React Spinners
- Font Awesome (icons)
- UUID

### Backend

- Node.js
- Express.js
- REST APIs
- OpenAI API (Chat Completions)
- bcrypt
- JSON Web Token (JWT)
- Resend (transactional email)
- dotenv
- CORS
- Node.js `crypto` module

### Database

- MongoDB
- Mongoose

### Development and Deployment

- Git
- GitHub
- Visual Studio Code
- Nodemon
- Vercel (frontend)

## Project Structure

```
NovaChat/
├── Backend/
│   ├── middleware/   # JWT auth middleware
│   ├── models/       # User and Thread schemas
│   ├── routes/       # auth and chat routes
│   ├── utils/        # OpenAI and Resend helpers
│   └── server.js
└── Frontend/
    └── src/
        └── components/   # Login, Signup, Dashboard, Sidebar, ChatWindow, etc.
```

## Authentication

NovaChat uses JWT-based authentication to protect user-specific resources and conversations.

Passwords are securely hashed using bcrypt before being stored in the database. Protected API routes use authentication middleware to validate the token and associate conversations with the authenticated user.

The application also includes email-based password reset functionality using Resend. A reset link containing a random token is emailed to the user and expires after 15 minutes.

## Chat Functionality

The frontend communicates with the Express REST API to process user messages. The backend sends the conversation history to the OpenAI API and stores conversations and messages in MongoDB using Mongoose.

AI responses support Markdown formatting and syntax highlighting for code blocks.

## API Endpoints

### Auth (`/api/auth`)

| Method | Endpoint                  | Description                     |
| ------ | ------------------------- | ------------------------------- |
| POST   | `/signup`                 | Register a new user             |
| POST   | `/login`                  | Log in and receive a JWT        |
| POST   | `/forgot-password`        | Email a password reset link     |
| POST   | `/reset-password/:token`  | Set a new password              |
| GET    | `/me`                     | Get the logged-in user (auth)   |

### Chat (`/api`) — all routes require authentication

| Method | Endpoint             | Description                    |
| ------ | -------------------- | ------------------------------ |
| GET    | `/thread`            | List all of the user's threads |
| GET    | `/thread/:threadId`  | Get messages of a thread       |
| PUT    | `/thread/:threadId`  | Rename a thread                |
| DELETE | `/thread/:threadId`  | Delete a thread                |
| POST   | `/chat`              | Send a message and get a reply |

## Getting Started

### Backend

```bash
cd Backend
npm install
npm run dev
```

Create a `.env` file in `Backend/`:

```
PORT=8080
MongoDB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key
RESEND_API_KEY=your_resend_api_key
FRONTEND_URL=http://localhost:5173
```

### Frontend

```bash
cd Frontend
npm install
npm run dev
```

Create a `.env` file in `Frontend/`:

```
VITE_API_URL=http://localhost:8080
```

## Author

**Janhavi Singh**

[GitHub](https://github.com/Janhavi-240307) · [LinkedIn](https://www.linkedin.com/in/janhavisingh2403)
