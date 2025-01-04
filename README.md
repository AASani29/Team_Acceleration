
# Project Setup Instructions

## In the Root Directory:
To install the necessary dependencies, run the following command:
```bash
npm install
```

## In the Client Directory:
Navigate to the client directory and install dependencies:
```bash
cd client
npm install
```

## `.env` in the Root Directory:
Ensure to set up the environment variables for MongoDB and JWT Secret in the root directory:
```bash
MONGO = 'mongodb+srv://namisa:244466666@auth.d1zmqbi.mongodb.net/?retryWrites=true&w=majority&appName=auth'
JWT_SECRET = 'ivadhfvuiadhfviahuivyfvIEYR8AYB'
```

## `.env` in the Client Directory:
In the client folder, configure Firebase API key as follows:
```bash
VITE_FIREBASE_API_KEY = "AIzaSyBgZ6unZvCYpnqGeSCtxdg8KvHPvmY38eU"
```

# API Documentation

## 1. Authentication API

- **POST `/signup`**: Registers a new user.
- **POST `/signin`**: Logs in the user with their credentials.
- **POST `/google`**: Allows users to sign in via Google.
- **GET `/signout`**: Logs out the current user.

## 2. Banglish to Bangla Conversion API

- **POST `/translate`**: Converts Banglish text to Bangla.

## 3. Content Management API

- **POST `/upload`**: Uploads a PDF file.
- **GET `/user-pdfs`**: Retrieves the list of PDFs uploaded by the user.
- **POST `/make-public`**: Makes a PDF public.
- **POST `/make-private`**: Makes a PDF private.
- **GET `/search`**: Allows searching for PDFs based on content.

## 4. CSV Update API

- **POST `/update-csv`**: Appends new Banglish and Bangla text pairs to the dataset for training.

## 5. Chatbot API

- **POST `/chatbot`**: Interacts with the chatbot, responding to queries.
- **POST `/train-model`**: Triggers retraining of the translation model using the updated dataset.

## 6. User Management API

- **GET `/update/:id`**: Updates the user profile (authentication required).
- **DELETE `/delete/:id`**: Deletes a user account (authentication required).
- **GET `/search`**: Searches for users by username.

# Feature Overview

## 1. Authentication
Secure login and registration process, protecting API endpoints to ensure user data is secured.

## 2. Banglish to Bangla Conversion
A powerful translation system that converts Banglish text into Bangla, enhancing communication.

## 3. Content Management
Users can create content in Banglish, convert it into Bangla, and export it as a PDF. PDF visibility can be controlled (public/private) with auto-generated titles and captions.

## 4. Search Functionality
Allows users to search for PDFs and profiles in both Banglish and Bangla queries.

## 5. Chatbot Integration
The chatbot is capable of understanding and responding in both Banglish and Bangla and can handle PDF-based queries.

## 6. Translation System Improvement
Allows users to contribute new Banglish-to-Bangla text pairs, which are verified by admins and used to improve the model.

## 7. UI/UX Design
The user interface is intuitive and responsive, offering a seamless experience for content creation, searching, and chatbot interaction.

## 8. Backend & Infrastructure
The backend is scalable with MongoDB, utilizing environment variables for smooth development and deployment.

# Bonus Features
1. **Voice Interaction**: Enables hands-free content generation and voice-based chatbot responses in Bangla.
2. **Smart Editor**: Auto-corrects common Banglish typing errors.
3. **Real-Time Collaboration**: Multiple users can collaborate in real-time on content creation and translation.
4. **Analytics Dashboard**: Provides insights into user activity and engagement.
5. **Customizable Bangla Fonts**: Users can choose from various Bangla fonts when exporting PDFs.
6. **Dockerization**: Ensures consistency in development, testing, and production environments.

# Link:
The app is deployed on Render and can be accessed via the link below:
[Authentication](https://authentication-2-tzt5.onrender.com/)
