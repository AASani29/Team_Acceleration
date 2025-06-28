# Welcome to **Blingo**! 📖✨  

**Blingo** is an AI-powered collaborative story-writing platform designed for Bangla writers and storytellers. Whether you're crafting a story solo or collaborating with friends, **Blingo** provides powerful tools like **real-time translation (Banglish → Bangla), AI-generated titles, voice input, and an intelligent chatbot assistant** to enhance your creativity.  

🔹 **Write together** in a shared editor with access control.  
🔹 **Auto-translate** from Banglish to Bangla and listen to your story.  
🔹 **AI-powered assistance** for suggestions, feedback, and story ideas.  
🔹 **Smart chatbot** that learns from your stories and responds intelligently.  
🔹 **Save, download, and share** your stories with privacy controls.  
🔹 **Search** for users and stories effortlessly.  
🔹 **Analytical dashboard** to track your writing journey.  

Start crafting beautiful Bangla stories today!  

<img src="https://github.com/AASani29/Team_Acceleration/blob/main/Images/Landing%20Page.png" alt="BLingo Landing Page" width="700"/>  

---

## 🚀 **Quick Start Guide**  

1. **Sign Up / Log In** – Create an account to save and manage your stories.  
2. **Start Writing** – Use the collaborative editor or write solo.  
3. **Translate & Listen** – Convert Banglish to Bangla and hear your story read aloud.  
4. **AI Assistance** – Get AI-generated titles, suggestions, and feedback.  
5. **Save & Share** – Download as PDF or share with others (public/private control).  
6. **Chat with AI** – Interact with a chatbot that understands your writing style.  
7. **Track Progress** – Check analytics on translations, stories, and interactions.  

---

## ✨ **Key Features**  

### **1. Collaborative Story Editor**  
- Real-time collaboration with access control.  
- Share stories via link with friends or co-authors.  

<img src="https://github.com/AASani29/Team_Acceleration/blob/main/Images/collaborative%20feature.png" alt="Collaborative Editor" width="600"/>  

---  

### **2. Auto-Translation (Banglish → Bangla)**  
- Seamlessly convert written Banglish to proper Bangla.  
- Listen to the translated text with **text-to-speech**.  

<img src="Images/Auto Translation.png" alt="Auto-Translation" width="600"/>  

---  

### **3. Voice Input & Audio Playback**  
- **Speak instead of typing** – supports voice input.  
- **Listen to your story** in Bangla for proofreading.  

<img src="Images/Voice and Audio.png" alt="Voice Input" width="600"/>  

---  

### **4. AI-Powered Story Assistance**  
- **AI-generated titles** for your stories.  
- **Smart suggestions** for plot, grammar, and creativity.  
- **Feedback & improvements** from AI.  

<img src="Images/ai assistant.png" alt="AI Assistant" width="600"/>  

---  

### **5. Smart Chatbot (RAG-Powered)**  
- Learns from your past stories for personalized responses.  
- Supports **voice input** for natural conversations.  
- Helps with story ideas, corrections, and more.  

<img src="Images/chatbot.png" alt="Chatbot" width="300"/>  

---  

### **6. Story Management & Privacy Controls**  
- **Save stories** to your profile.  
- **Download as PDF** (Bangla supported).  
- **Control visibility** (public/private stories).  

<img src="Images/Save and Download.png" alt="Profile & Stories" width="600"/>  
<img src="Images/profile.png" alt="Profile & Stories" width="600"/>

--- 

### **7. Search Functionality**  
- **Find users** and their public stories.  
- **Search stories** by keywords or genres.  

<img src="Images/search.png" alt="Search Feature" width="600"/>  

---  

### **8. Analytics Dashboard**  
- Visual insights on **translations, stories written, chatbot usage**.  
- Graphs and stats to track progress.  

<img src="Images/analytics dashboard.png" alt="Analytics Dashboard" width="600"/>  

---  

## 🛠 **Tech Stack**  

### **Frontend**  
![React](https://img.shields.io/badge/-React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/-Tailwind%20CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Redux](https://img.shields.io/badge/-Redux-764ABC?style=for-the-badge&logo=redux&logoColor=white)  

### **Backend**  
![Node.js](https://img.shields.io/badge/-Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/-Express-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/-MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Firebase](https://img.shields.io/badge/-Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![Cloudinary](https://img.shields.io/badge/-Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)
![OAuth](https://img.shields.io/badge/-OAuth-4285F4?style=for-the-badge&logo=google&logoColor=white)

### Voice & Audio
![Web Speech API](https://img.shields.io/badge/-Web%20Speech%20API-5C8DBC?style=for-the-badge&logo=google-chrome&logoColor=white)
![SpeechSynthesis](https://img.shields.io/badge/-SpeechSynthesis-2596BE?style=for-the-badge&logo=audio-description&logoColor=white)
![SpeechRecognition](https://img.shields.io/badge/-SpeechRecognition-DC3545?style=for-the-badge&logo=microphone&logoColor=white)


### **AI & NLP**  
![Python](https://img.shields.io/badge/-Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![RAG (Retrieval-Augmented Generation)](https://img.shields.io/badge/-RAG-FF6F00?style=for-the-badge&logo=openai&logoColor=white)
![Text-to-Speech](https://img.shields.io/badge/-TTS-4285F4?style=for-the-badge&logo=google-cloud&logoColor=white)
![Groq](https://img.shields.io/badge/-Groq-00FF00?style=for-the-badge&logo=groq&logoColor=white)

---

## 🔍 **RAG Implementation**

**Retrieval-Augmented Generation** system that:
1. Stores user stories as vector embeddings
2. Retrieves relevant context for queries
3. Generates personalized Bangla/Banglish responses

![RAG Architecture Diagram](Images/deepseek_mermaid_20250628_d30019.png)  
*Figure 1: RAG System Workflow*

### **Key Components**
| Component | Technology | Purpose |
|-----------|------------|---------|
| Embedding Model | Xenova/all-MiniLM-L6-v2 | Text-to-vector conversion |
| Vector Database | MongoDB Atlas | Fast semantic search |
| LLM | Groq (Llama-3-70b) | Context-aware generation |

### **Data Flow**
![RAG Data Flow Diagram](Images/deepseek_mermaid_20250627_32e9a5.png)  
*Figure 2: End-to-End Data Pipeline*

### **Why This Works**
- 💡 **Bangla-Optimized**: Handles code-mixing (Banglish) effectively
- 🔐 **Private**: Each user only accesses their own stories
- ⚡ **Fast**: Groq's LPU enables <1s responses
- 🧠 **Accurate**: Vector search finds relevant story segments
---
## 👥 Contributors

- [Ahmed Alfey Sani](https://github.com/AASani29)
- [Md Hasibur Rahman Alif](https://github.com/mdhralif) 
- [Niaz Rahman](https://github.com/niazbuoy08)

Want to contribute? Feel free to fork the repository and submit a pull request!

## 📄 License

**Blingo** is licensed under the MIT License. Open to all storytellers and creators!

**🌟 Let's Revolutionize Bangla Storytelling Together!**

At **Blingo**, we believe every story matters and every voice deserves to be heard. Start writing, collaborate freely, and let's create a vibrant community of Bangla storytellers together. ✍️🌍

Keep creating and sharing your stories! 📖💙
