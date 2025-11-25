# 🎨 Artovex – Virtual Art Gallery

Artovex is a full-stack **virtual art gallery platform** where users can:

- 🧑‍🎨 Create an account  
- 🔐 Log in securely  
- 🖼️ Upload their artworks (images + details)  
- 👀 View all artworks in a responsive gallery  

It is built as a portfolio-ready project to showcase full-stack development skills using **Node.js + Express + MongoDB + Vanilla JavaScript**.

---

## 🚀 Features

✅ **User Authentication**
- Signup & Login using MongoDB
- Passwords hashed using bcryptjs
- Session-based authentication (Express Session)
- Protected dashboard (`/dashboard`)

✅ **Artwork Upload**
- Upload images using Multer
- Title, description & category stored as metadata
- Uploaded images stored in `/uploads`

✅ **Dynamic Public Gallery**
- Fetches artworks from `/api/artworks`
- 3-column responsive grid
- Expandable “View Details / Hide Details” descriptions

✅ **Modern UI**
- Clean, aesthetic forms
- Responsive layout
- Vertical scrolling gallery

✅ **Deployment Ready**
- Backend hosted on Render
- Database hosted on MongoDB Atlas

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | HTML, CSS, JavaScript |
| Backend | Node.js, Express.js |
| Authentication | bcryptjs, express-session |
| Database | MongoDB Atlas |
| File Uploads | Multer |
| Deployment | Render |

---

## 📁 Project Structure

```text
Artovex/
  server.js
  package.json
  /public
    index.html
    login.html
    signup.html
    dashboard.html
    /assets
      /css/style.css
      /js/script.js
  /uploads             # ✅ Uploaded images
  /data
    artworks.json      # ✅ Metadata for artworks
```
## ⚙️ How It Works

### ✅ Users (Stored in MongoDB)

Users are stored in a MongoDB collection with the following schema:

```js
{
  name: String,
  email: String,
  password: String, // hashed
  createdAt: Date
}
```
### ✅ Artworks (Stored Locally)

- Metadata stored in `data/artworks.json`
- Images stored physically in `/uploads`
- Displayed using the API route:

```bash
GET /api/artworks
```
## 🧰 Run Locally

### ✅ 1. Clone Repository

```bash
git clone https://github.com/itzsv413/artovex.git
cd artovex
```

###✅ 2. Install Dependencies

```bash
npm install
```

###✅ 3. Configure MongoDB

-Set your MongoDB connection string inside server.js:

```bash
const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://<user>:<password>@cluster0.xxx.mongodb.net/artovex";
```
-Replace <user> and <password> with your MongoDB Atlas credentials.

###✅ 4. Start Server


