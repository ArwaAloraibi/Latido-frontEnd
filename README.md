# Latido - Music Streaming Platform

![Latido Logo](https://i.imgur.com/EjaLh0F.png)

**Latido** is a modern, full-stack music streaming application built with the MERN stack. It provides a seamless experience for both artists and listeners, allowing artists to create and manage albums with MP3 uploads, while listeners can discover music, create playlists, and stream songs directly from the platform.

## 🎵 About Latido

Latido was built to provide a comprehensive music streaming experience that bridges the gap between artists and their audience. The platform enables artists to showcase their work by uploading albums and songs, while giving listeners the freedom to discover new music and curate their personal playlists.

### Why We Built Latido

Music streaming has become an essential part of how we consume music today. Latido was created to offer a focused, user-friendly platform that prioritizes both the artist's ability to share their work and the listener's ability to discover and organize music. The application demonstrates modern web development practices with a clean, elegant interface and robust functionality.

## ✨ Features

### For Artists
- **Album Management**: Create, update, and delete albums with custom cover images
- **Song Upload**: Upload MP3 files directly to albums with optional song cover images
- **My Albums Dashboard**: View and manage all your created albums in one place
- **Full CRUD Operations**: Complete control over your music content

### For Listeners
- **Music Discovery**: Browse albums from artists around the world
- **Playlist Creation**: Build custom playlists with your favorite songs
- **Audio Playback**: Stream songs directly from albums or playlists with a modern audio player
- **Recently Played**: Track your listening history
- **Recently Viewed**: Quick access to albums you've recently explored

### For Everyone
- **User Authentication**: Secure sign-up and sign-in with role-based access
- **Responsive Design**: Beautiful, modern UI that works on all devices
- **Real-time Updates**: Instant state synchronization across the application
- **Smooth Animations**: Polished transitions and loading states

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or cloud instance)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Latido-frontEnd
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory:
```env
VITE_BACK_END_SERVER_URL=http://localhost:3000
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Backend Setup

The backend repository is required for full functionality. See the [Backend Repository](#backend-repository) section below.

## 🔗 Links

- **Deployed App**: [Add your deployed app URL here]
- **Planning Materials**: [https://trello.com/b/m0hrTL6O/my-trello-board]
- **Backend Repository**: [https://github.com/ArwaAloraibi/Latido-backend]

## 🛠️ Technologies Used

### Frontend
- **React** - UI library for building interactive user interfaces
- **React Router** - Client-side routing and navigation
- **Vite** - Fast build tool and development server
- **CSS3** - Modern styling with CSS variables and animations
- **JavaScript (ES6+)** - Modern JavaScript features

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database for data storage
- **Mongoose** - MongoDB object modeling for Node.js
- **Multer** - Middleware for handling multipart/form-data (file uploads)
- **JWT (JSON Web Tokens)** - Authentication and authorization
- **bcrypt** - Password hashing

### Key Libraries & Tools
- **React Context API** - State management
- **Fetch API** - HTTP requests
- **FileReader API** - Client-side file reading
- **HTML5 Audio API** - Audio playback functionality

## 📸 Screenshots

[Add screenshots of your application here]
- Landing Page
- Dashboard
- Album Discovery
- Playlist Management
- Audio Player

## 🎨 Design

Latido features a modern, elegant design with:
- **Color Palette**: Electropink (#ff00ff), Dark Blue (#0a0e27), Purple (#6b46c1), Beige (#f5f1e8)
- **Typography**: Inter font family for clean, readable text
- **Animations**: Smooth transitions and hover effects throughout
- **Responsive Layout**: Mobile-first design that adapts to all screen sizes

## 📁 Project Structure

```
Latido-frontEnd/
├── src/
│   ├── components/       # React components
│   │   ├── AlbumDetail/
│   │   ├── AlbumList/
│   │   ├── AudioPlayer/
│   │   ├── CreateAlbum/
│   │   ├── CreatePlaylist/
│   │   ├── Dashboard/
│   │   ├── Landing/
│   │   ├── MyAlbums/
│   │   ├── NavBar/
│   │   ├── PlaylistDetail/
│   │   ├── PlaylistList/
│   │   ├── SignInForm/
│   │   └── SignUpForm/
│   ├── contexts/         # React Context providers
│   ├── services/         # API service functions
│   ├── App.jsx           # Main application component
│   ├── App.css           # Global styles
│   └── main.jsx          # Application entry point
├── public/               # Static assets
└── package.json          # Dependencies
```

## 🔐 Authentication

Latido uses JWT-based authentication with role-based access control:
- **Roles**: `artist` or `listener`
- **Artists** can create and manage albums
- **Listeners** can create playlists and discover music
- Secure token storage in localStorage

## 🎯 Next Steps (Stretch Goals)

- [ ] User profiles with customizable avatars
- [ ] Social features: follow artists, share playlists
- [ ] Advanced search and filtering
- [ ] Music recommendations based on listening history
- [ ] Collaborative playlists
- [ ] Song lyrics display
- [ ] Playlist sharing and collaboration
- [ ] Integration with external music APIs
- [ ] Offline playback support
- [ ] Progressive Web App (PWA) capabilities
- [ ] Real-time notifications
- [ ] Advanced audio controls (shuffle, repeat, queue)
- [ ] Analytics dashboard for artists

## 👥 Contributing

This project was built as part of a General Assembly project. Contributions and improvements are welcome!

## 🙏 Acknowledgments

- General Assembly for project guidance
- React and Vite communities for documentation
- W3schools
- GeeksforGeeks


---

**Note**: This application requires a backend server to function. Make sure to set up and run the backend repository before using the frontend application.
