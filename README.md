#  EventHub

EventHub is a **full‑stack event booking platform** that allows users to discover events, book seats in real time, and enables admins to manage events seamlessly. It is built with scalability, clean UI, and real‑world booking logic in mind.

---

## Features

### User Features

* Browse upcoming events
* View event details (date, location, price, seats)
* Real‑time seat availability
* Secure event booking
* Authentication & authorization

### Admin Features

* Create, update, and delete events
* Manage event listings
* Control seat availability
* Admin‑only protected routes

---

## Tech Stack

### Frontend

* React (Vite)
* CSS / Tailwind CSS
* Axios

### Backend

* Node.js
* Express.js
* MongoDB + Mongoose
* JWT Authentication

### Deployment

* Frontend: **Vercel**
* Backend: **Render**

---

## Project Structure

```
EventHub/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── services/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   └── server.js
│
└── README.md
```

---

##  Environment Variables

### Backend (`.env`)

```env
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
```

## Run Locally

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

## Future Enhancements

* Payment gateway integration
* Seat selection UI
* Email confirmations
* QR‑based ticket system
* Analytics dashboard for admins


