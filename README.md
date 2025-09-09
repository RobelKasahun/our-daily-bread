# OurDailyBread

OurDailyBread is a web application created for the Sunday School members of the Eritrean Trinity Orthodox Church. The platform provides a space to teach, read, and share spiritual content, helping members grow together in faith and knowledge.

## Mission

- Enrich the community by sharing spiritual insights and teachings.
- Support newcomers and those less experienced by providing accessible resources.
- Strengthen fellowship through collaboration, discussion, and knowledge sharing.

By combining learning with community engagement, OurDailyBread fosters an environment where every member—whether experienced or new—can contribute, learn, and deepen their spiritual journey.

## Figma Frontend Design

[View Design on Figma](https://www.figma.com/proto/Xu06twKOT2khQEdAfsXL1O/HolyShare?node-id=0-1&t=UsRRhIRuMXWMq9Tw-1)

## Live Demo

[OurDailyBread App](https://ourdailybread.app/)

## Features

- 🔑 **User Authentication** – Register, sign in, and reset password.
- 📝 **Post Management** – Create, edit, update, and delete posts.
- 🔍 **Search** – Search post content using the search input.
- 👥 **Follow System** – Follow and unfollow content creators.
- ❤️ **Likes** – Like and unlike creators’ posts.
- 💬 **Comments** – Leave comments on posts, as well as edit and delete them.
- 📌 **Saved Posts** – Save posts to read later.

## Tech Stack

**Frontend:**

- React
- Tailwind CSS (for styling)

**Backend:**

- Python
- Flask (RESTful API development)
- SQLAlchemy (ORM for database interaction)

**Database:**

- PostgreSQL

**Deployment & Hosting:**

- Vercel (Frontend)
- Render (Backend)

**Design & Collaboration:**

- Figma (UI/UX Design)
- Git & GitHub (Version Control)

## Installation & Setup
Follow the steps below to set up **OurDailyBread** locally.
### 1. Clone the repository
- git clone https://github.com/RobelKasahun/our-daily-bread.git
- open the project using your favorite IDE
## Install frontend dependencies
- The project is devided into folder (Frontend and Backend), therefore open two terminal windows one for frontend and one for backend
- cd frontend
- npm install
## Create & activate a virtual environment
- python -m venv venv
- source venv/bin/activate   # On macOS/Linux
- venv\Scripts\activate      # On Windows
## Install backend dependencies
- create requirements.txt file if it's not present
- pip install -r requirements.txt
## Set up environment variables
- Create a .env file in the root directory and add:
- SECRET_KEY=your_secret_key
- DATABASE_URL=postgres://username:password@localhost:5432/ourdailybread
