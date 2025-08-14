Budyz Frontend

This is the frontend client for the Budyz project. The frontend interacts with the Budyz backend and the Pi Network, enabling users to authenticate, view their NFT minting status, and interact with the Budyz ecosystem.

Features

Modern UI built with React, Vue, or your framework of choice
Pi Network integration for user authentication
NFT minting interface, allowing users to mint NFTs and view their count
API communication with the Budyz backend for authentication and NFT supply
Validation and error handling for user input and API responses
Environment configuration using a .env file for API base URLs and keys

Requirements

Node.js version 16 or higher
npm or yarn

Getting Started

Clone the repository

git clone https://github.com/YOUR_USERNAME/budyz-frontend.git
cd budyz-frontend

Install dependencies

npm install
or
yarn install

Configure environment variables

Create a .env file in the root directory. Example:

REACT_APP_API_BASE_URL=http://localhost:3000

Start the frontend app

npm start
or
yarn start

The app will start in development mode at http://localhost:3000 or http://localhost:5173 for Vite

File Structure

src         main frontend source code
public      static assets
.env        environment variables, do not commit
.gitignore  files and folders to ignore in version control
package.json  project dependencies and scripts

Notes

This frontend is designed to work with the Budyz backend. Make sure the backend is running and REACT_APP_API_BASE_URL points to the correct address
Pi Network authentication is required for core features
For production builds, use npm run build or yarn build

License

ISC, see LICENSE file for details