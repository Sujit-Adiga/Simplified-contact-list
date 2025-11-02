# Simplified-contact-list
# Contact List Application

A simple and intuitive contact management application built with React.js and JSON Server.

## Features

- View all contacts
- Add new contacts
- Edit existing contacts
- View contact details
- Delete contacts
- Responsive design

## Prerequisites

Before running this application, make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v14.0.0 or higher)
- npm (comes with Node.js)

## Installation

1. Clone the repository
```bash
git clone https://github.com/Sujit-Adiga/Simplified-contact-list.git
cd Simplified-contact-list
```

2. Install dependencies for the React application
```bash
cd contact-list
npm install
```

3. Install dependencies for the JSON server
```bash
cd server
npm install
```

## Running the Application

You need to run both the frontend and backend servers:

1. Start the JSON Server (Backend)
```bash
cd server
npm start
```
The server will start on http://localhost:3001

2. In a new terminal, start the React application (Frontend)
```bash
cd contact-list
npm start
```
The application will open in your default browser at http://localhost:3000

## Project Structure

```
contact-list/
├── public/             # Public assets
├── server/             # Backend server
│   └── db.json        # Database file
└── src/
    ├── components/    # React components
    │   ├── Contacts/  # Contact-related components
    │   ├── NavBar/    # Navigation component
    │   └── Spinner/   # Loading spinner component
    ├── services/      # API services
    └── assets/        # Static assets

```

## Tech Stack

- React.js
- JSON Server
- React Router
- CSS
- JavaScript/JSX

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).
