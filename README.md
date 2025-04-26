**🛒 TrendTakeaway - Compare Smarter, Buy Better!**
TrendTakeaway is a full-stack product comparison and analysis platform that collects and analyzes real-time e-commerce data through web scraping. Built with the MERN stack, it enables users to compare products, view detailed analysis, and make better purchasing decisions. Authentication is managed securely using Auth0.
Deployed with Render, and styled beautifully using TailwindCSS and Framer Motion.

**🚀 Features**
🔎 Real-time Web Scraping using Puppeteer

📈 Product Price & Feature Comparison

📊 Data Visualization with Recharts

🔒 Secure Login and Authentication using Auth0

🎯 User-Friendly Interface (React + TailwindCSS + Vite)

💬 Review Sentiment Analysis (Optional with Sentiment Package)

🌐 Full-stack Architecture (Node.js + Express + MongoDB + React)

📥 Save & Share product links for later

🌟 Fast Loading with Vite build setup

**🏗️ Tech Stack**

Frontend	Backend	Database	Others
React (Vite)	Node.js	MongoDB Atlas	Puppeteer (Scraping)
TailwindCSS	Express.js	Mongoose	Auth0 (Authentication)
Framer Motion	JWT		dotenv, axios, recharts


**⚙️ Installation**
1. Clone the repository
```bash
git clone https://github.com/jsm1306/TrendTakeaway.git
cd TrendTakeaway
```
**2. Install Backend Dependencies**
```bash
cd backend
npm install
```
**3. Install Frontend Dependencies**
```bash
cd ../frontend
npm install
```
**4. Setup Environment Variables**
Create a .env file inside your backend/ folder:

```
MONGO_URI=your_mongodb_connection_string
AUTH0_DOMAIN=your_auth0_domain
AUTH0_CLIENT_ID=your_auth0_client_id
AUTH0_CLIENT_SECRET=your_auth0_client_secret
```
(You can create another .env inside frontend if you use Auth0 keys there.)

**🏃‍♂️ Run Locally**
**Start Backend Server**
```bash
cd backend
npm run dev
```
**Start Frontend (Vite Dev Server)**
```bash
cd frontend
npm run dev
```


**By default:**

Frontend runs on: http://localhost:5173

Backend runs on: http://localhost:5000

**🛠️ Deployment**
This project is deployed on Render.

Backend is deployed separately as a web service.

Frontend (Vite Build) is deployed as a static site.

**📚 Future Improvements**

Expand the database

Add AI-based recommendation system using Generative AI models.

**🤝 Contributing**
Contributions are welcome!
Feel free to fork the repo, create a new branch, and submit a pull request.

**📬 Contact**
**GitHub:** @jsm1306
**Email:** sindhu.j1729@gmail.com

