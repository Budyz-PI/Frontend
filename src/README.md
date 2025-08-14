# Budyz Frontend

This is the frontend client for the **Budyz** project. The frontend interacts with the Budyz backend and the Pi Network, enabling users to authenticate, view their NFT minting status, and interact with the Budyz ecosystem.

---

## Features

- **Modern UI**: Built with (React/Vue/your framework here, update as appropriate).
- **Pi Network Integration**: Supports user authentication via the Pi Network.
- **NFT Minting Interface**: Allows users to mint NFTs and view their minted count.
- **API Communication**: Interacts with the Budyz backend for authentication and NFT supply.
- **Validation & Error Handling**: User-friendly feedback for input and API errors.
- **Environment Configuration**: Uses `.env` for API base URLs and keys.

---

## Requirements

- Node.js (v16 or above recommended)
- npm or yarn

---

## Getting Started

1. **Clone the repository**

   ```sh
   git clone https://github.com/YOUR_USERNAME/budyz-frontend.git
   cd budyz-frontend
   ```

2. **Install dependencies**

   ```sh
   npm install
   # or
   yarn install
   ```

3. **Configure Environment Variables**

   Create a `.env` file in the root directory. Example (adjust as needed):

   ```
   REACT_APP_API_BASE_URL=http://localhost:3000
   ```

4. **Start the frontend app**

   ```sh
   npm start
   # or
   yarn start
   ```

   The app will start in development mode (default: [http://localhost:3000](http://localhost:3000) or [http://localhost:5173](http://localhost:5173) for Vite).

---

## File Structure

- `src/` — Main frontend source code.
- `public/` — Static assets.
- `.env` — Store environment variables (never commit this file).
- `.gitignore` — Ensures sensitive/runtime data are not committed.
- `package.json` — Project dependencies and scripts.

---

## Notes

- The frontend is designed to work with the Budyz backend. Ensure the backend is running and `REACT_APP_API_BASE_URL` points to the correct address.
- Pi Network authentication is required for core features.
- For production builds, use `npm run build` or `yarn build`.

---

## License

[ISC](LICENSE)