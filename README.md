# Syncsphere

A real-time co-watching app where users can create rooms, invite others, and watch YouTube videos together in perfect sync. Users can add videos to a shared queue, upvote them, and see each other's timestamps to sync instantly.

## Note
This app is hosted on a free instance of Render.com, which may spin down due to inactivity. As a result, initial load times can be delayed by 50 seconds or more.

## Features

- Real-time video playback with manual syncing
- Create and join rooms
- Add YouTube videos to a shared queue
- Upvote videos to decide what plays next
- See others' timestamps and sync instantly
- Seamless co-watching experience
- If a user disconnects, the app will wait for 1 minute before removing them from the room or ending it if they were the host

### Installation

1. Clone the repository:

```
git clone https://github.com/SaribJawad/Sync-sphere.git
cd Sync sphere
```

2. Install dependencies:
```
cd backend
npm install
cd ../frontend
npm install
```
3. Start the backend server:
```
cd backend
npm run dev
```
4. Start the frontend server:
```
cd frontend
npm run dev
```
### Tech Stack

Frontend: React, TypeScript, Tailwind CSS

Backend: Node.js, Express.js, MongoDB

Real-time: WebSockets

### Contributing

Pull requests are welcome! Feel free to open an issue for feature suggestions or bug reports.
