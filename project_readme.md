# User Relationship & Hobby Network

A full-stack application for managing users, their relationships, and hobbies with an interactive graph visualization.

## 🎯 Features

- **User Management**: Create, update, and delete users with validation
- **Friendship System**: Connect users with drag-and-drop or API
- **Hobby Management**: Drag hobbies from sidebar onto users
- **Dynamic Graph**: Visual representation using React Flow with custom nodes
- **Popularity Scoring**: Automatic calculation based on friends and shared hobbies
- **Real-time Updates**: Graph updates instantly when relationships or hobbies change

## 🛠️ Tech Stack

**Backend:**
- Node.js + Express.js
- TypeScript
- SQLite (better-sqlite3)
- CORS for cross-origin requests

**Frontend:**
- React 18 + TypeScript
- React Flow for graph visualization
- React Context for state management
- Axios for API calls
- React Hot Toast for notifications
- Lucide React for icons
- Tailwind CSS for styling

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## 🚀 Installation & Setup

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd user-network-app
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Run tests (optional)
npm test

# Start development server
npm run dev
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start development server
npm run dev
```

The frontend will run on `http://localhost:5173`

## 📁 Project Structure

```
user-network-app/
├── backend/
│   ├── src/
│   │   ├── database.ts          # SQLite database setup
│   │   ├── types.ts              # TypeScript interfaces
│   │   ├── server.ts             # Express server
│   │   ├── routes/
│   │   │   └── userRoutes.ts    # API endpoints
│   │   ├── services/
│   │   │   └── userService.ts   # Business logic
│   │   └── tests/
│   │       └── userService.test.ts
│   ├── .env
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── GraphView.tsx        # React Flow graph
    │   │   ├── CustomNode.tsx       # Custom node components
    │   │   ├── HobbySidebar.tsx     # Hobby management
    │   │   └── UserPanel.tsx        # User creation form
    │   ├── context/
    │   │   └── AppContext.tsx       # Global state
    │   ├── services/
    │   │   └── api.ts               # API client
    │   ├── App.tsx
    │   └── main.tsx
    ├── .env
    ├── .env.example
    └── package.json
```

## 🔌 API Endpoints

### Users
- `GET /api/users` - Fetch all users
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Relationships
- `POST /api/users/:id/link` - Create friendship
- `DELETE /api/users/:id/unlink` - Remove friendship

### Graph
- `GET /api/graph` - Get graph data (nodes + edges)

## 📊 Business Logic

### Popularity Score Formula
```
popularityScore = numberOfFriends + (sharedHobbiesWithFriends × 0.5)
```

### Rules
1. **Deletion Protection**: Users with active friendships cannot be deleted
2. **Circular Prevention**: Friendships are stored once (A-B, not A-B and B-A)
3. **Validation**: All inputs are validated before processing

## 🎨 Frontend Features

### Custom Nodes
- **HighScoreNode**: Green gradient for popularity score > 5
- **LowScoreNode**: Blue gradient for popularity score ≤ 5
- Smooth transitions when node type changes

### Interactive Features
- Drag nodes to connect users (creates friendship)
- Drag hobbies from sidebar onto users
- Delete users with confirmation dialog
- Search/filter hobbies
- Real-time graph updates

## 🧪 Testing

Run backend tests:
```bash
cd backend
npm test
```

Tests cover:
- Popularity score calculation
- Circular friendship prevention
- Deletion rules enforcement

## 🚢 Deployment

### Backend (Render)
1. Create new Web Service
2. Connect your GitHub repository
3. Set build command: `cd backend && npm install && npm run build`
4. Set start command: `cd backend && npm start`
5. Add environment variables from `.env.example`

### Frontend (Vercel)
1. Import project from GitHub
2. Set root directory to `frontend`
3. Add environment variable: `VITE_API_URL=<your-backend-url>`
4. Deploy

## 📝 Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
DATABASE_PATH=./database.db
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
```

## 🎯 Assignment Requirements Checklist

✅ Backend API with CRUD operations  
✅ SQLite database  
✅ User object with all required fields  
✅ Popularity score calculation  
✅ Deletion rules enforcement  
✅ Circular friendship prevention  
✅ Error handling (400, 404, 409, 500)  
✅ React Flow graph visualization  
✅ Custom nodes (HighScore/LowScore)  
✅ Draggable hobbies  
✅ User management panel  
✅ React Context state management  
✅ Loading & error UI  
✅ API tests (3+ cases)  
✅ TypeScript for both frontend & backend  

## 🎁 Bonus Features Implemented

- ✅ Development mode with ts-node-dev
- ✅ API test coverage
- ✅ Custom React-Flow nodes with animations
- ✅ Debounced updates

## 👥 Usage

1. **Create Users**: Click the blue + button (bottom right)
2. **Add Hobbies**: Drag hobbies from the left sidebar onto user nodes
3. **Create Friendships**: Drag one node onto another
4. **Delete Users**: Click the × button on any node (must remove friendships first)
5. **View Stats**: Check the bottom of the sidebar for network statistics

## 🐛 Troubleshooting

**Backend not starting:**
- Check if port 5000 is available
- Verify all dependencies are installed
- Check .env file exists

**Frontend not connecting:**
- Verify backend is running
- Check VITE_API_URL in frontend .env
- Clear browser cache

**Database errors:**
- Delete `database.db` and restart backend
- Check file permissions

## 📄 License

MIT

## 👤 Author

Your Name - Cybernauts Development Assignment

---

Built with ❤️ using React, TypeScript, Express, and SQLite