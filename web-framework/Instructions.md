# How to Run the Web Framework

### Project Structure
```
PA-schools/
├── web-framework/
│   ├── client/         # React frontend
│   └── server/         # Node.js backend

```

## 0. Prerequisites
- Node.js (v16.0.0 or higher)
- npm (v8.0.0 or higher)
- SQLite3

## 1. Start the Backend Server
First, navigate to the server directory
```bash
$ cd ./PA-schools/web-framework/server
```

Install the required dependencies
```bash
$ npm install express
$ npm install sqlite3
$ npm install cors
$ npm install dotenv
$ npm install axios
```

Start the server:
```bash
$ node server.js
```

The server should now be running on http://localhost:5001

## 2. Start the Frontend Application

Open a new terminal window and navigate to the client directory
```bash
$ cd ./PA-schools/web-framework/client
```

Install the required dependencies
```bash
$ npm install react
$ npm install react-dom
$ npm install react-router-dom
$ npm install axios
$ npm install recharts
$ npm install @types/react
$ npm install @types/react-dom
$ npm install typescript
$ npm install tailwindcss
$ npm install @tailwindcss/typography
$ npm install @tailwindcss/forms
$ npm install lucide-react
```

Start the React application
```bash
$ npm start
```

The application should now be running on http://localhost:3000

## 3. Additional Configuration

Create a `.env` file in the server directory with the following content
```
PORT=5001
DB_PATH=../crawler/schools.db
```

## 4. Common Issues

1. Port Already in Use
```bash
$ lsof -i :5001  # check what's using port 5001
$ kill -9   # kill the process if needed
```

2. Database Connection Issues
```bash
# check database file permissions
$ chmod 644 ../crawler/schools.db
```

3. Node Modules Issues
```bash
# clear npm cache and reinstall dependencies
$ npm cache clean --force
$ rm -rf node_modules
$ npm install
```