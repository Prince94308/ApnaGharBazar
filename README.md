# 🏠 ApnaGharBazar - Real Estate Marketplace

A full-stack MERN (MongoDB, Express, React, Node.js) application for buying, selling, and renting properties. ApnaGharBazar provides a seamless platform for users to explore property listings, manage their real estate needs, and make secure payments through PayPal integration.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Payment Integration](#payment-integration)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### 🔍 Property Management
- **Browse Listings**: Search and filter properties by location, type, price, bedrooms, and more
- **Property Details**: View detailed information including images, amenities, and location on map
- **Create Listings**: Users can create and manage their property listings
- **Image Upload**: Upload multiple images per listing with Cloudinary integration
- **Interactive Maps**: Integrated Leaflet maps for property location visualization

### 👤 User Features
- **User Authentication**: Secure sign-up and login with JWT tokens
- **User Profiles**: Manage user profile with avatar upload
- **Favorites**: Save favorite properties (if implemented)
- **Contact Information**: Multiple Indian contact number support with validation

### 💳 Payment Integration
- **PayPal Integration**: Secure payment processing through PayPal Sandbox/Production
- **Payment Gateway**: Complete payment flow for property transactions
- **Transaction History**: Track payment transactions (if implemented)

### 💬 Reviews & Ratings
- **Property Reviews**: Users can leave reviews and ratings for properties
- **Review Management**: View and manage property reviews

### 🎨 UI/UX Features
- **Responsive Design**: Fully responsive design using Tailwind CSS
- **Modern UI**: Clean and intuitive user interface
- **Loading States**: Smooth loading and error handling
- **Search Functionality**: Advanced search with filters

## 🛠 Tech Stack

### Frontend
- **React 19.1.0** - UI library
- **Vite 6.5.5** - Build tool and dev server
- **Redux Toolkit 2.8.2** - State management
- **React Router DOM 7.6.2** - Routing
- **Tailwind CSS 4.1.8** - Styling framework
- **Leaflet & React-Leaflet** - Maps integration
- **React Icons** - Icon library
- **Swiper** - Image carousel/slider
- **PayPal React SDK** - PayPal payment integration
- **Firebase 11.9.0** - Additional services (if used)

### Backend
- **Node.js** - Runtime environment
- **Express.js 5.0.1** - Web framework
- **MongoDB & Mongoose 8.15.1** - Database and ODM
- **JWT (jsonwebtoken)** - Authentication
- **Bcryptjs** - Password hashing
- **Multer 2.0.1** - File upload handling
- **Cloudinary** - Image storage and management
- **PayPal Checkout SDK** - Server-side payment processing
- **CORS** - Cross-origin resource sharing
- **Cookie Parser** - Cookie handling
- **Dotenv** - Environment variable management

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **MongoDB** (local installation or MongoDB Atlas account)
- **Git** for version control
- **PayPal Developer Account** (for payment integration)
- **Cloudinary Account** (for image storage)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Prince94308/ApnaGharBazar.git
cd ApnaGharBazar
```

### 2. Install Dependencies

#### Install Root Dependencies
```bash
npm install
```

#### Install Client Dependencies
```bash
cd client
npm install
cd ..
```

Or use the root script:
```bash
npm run build
```

This will install dependencies for both root and client.

### 3. Set Up Environment Variables

Create a `.env` file in the `api` directory:

```env
# MongoDB Connection
MONGO=mongodb://localhost:27017/apnagharbazar
# or for MongoDB Atlas:
# MONGO=mongodb+srv://username:password@cluster.mongodb.net/apnagharbazar

# Server Configuration
PORT=3000

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here

# Cloudinary Configuration
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# PayPal Configuration (Sandbox)
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
```

**Note**: Copy the `.env.example` file if available, or create a new `.env` file with the above variables.

### 4. Set Up Cloudinary

1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Get your Cloud Name, API Key, and API Secret from the dashboard
3. Add them to your `.env` file

### 5. Set Up PayPal (Optional)

For payment integration:

1. Create a [PayPal Developer Account](https://developer.paypal.com/)
2. Create a new app in the Sandbox environment
3. Get your Client ID and Secret
4. Add them to your `.env` file

For detailed PayPal setup instructions, see [README_PAYPAL.md](./README_PAYPAL.md)

### 6. Update PayPal Client ID in Frontend

In `client/src/pages/TestPayment.jsx` (or wherever PayPal is initialized), update:

```javascript
const initialOptions = {
    "client-id": "your_paypal_client_id_here",
    currency: "USD",
    intent: "capture",
};
```

## ⚙️ Configuration

### MongoDB Setup

#### Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Update `MONGO` in `.env` to `mongodb://localhost:27017/apnagharbazar`

#### MongoDB Atlas (Cloud)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Create a database user
4. Whitelist your IP address (or use `0.0.0.0/0` for development)
5. Get your connection string and update `MONGO` in `.env`

### CORS Configuration

The server is configured to accept requests from `http://localhost:5173` (default Vite port). To change this, update `api/index.js`:

```javascript
cors({
  origin: 'http://localhost:5173', // Change this to your frontend URL
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
})
```

## 💻 Usage

### Development Mode

#### Start Backend Server
```bash
npm run server
# or
npm start
```

The API will run on `http://localhost:3000`

#### Start Frontend Development Server
```bash
npm run client
# or
cd client && npm run dev
```

The frontend will run on `http://localhost:5173`

### Production Build

#### Build Frontend
```bash
cd client
npm run build
```

This creates a `dist` folder with production-ready files.

#### Serve Production Build
The Express server is configured to serve the production build from `client/dist` when running in production mode.

```bash
NODE_ENV=production npm start
```

## 📁 Project Structure

```
ApnaGharBazar/
│
├── api/                        # Backend API
│   ├── controllers/           # Route controllers
│   │   ├── auth.controller.js
│   │   ├── listing.controller.js
│   │   ├── payment.controller.js
│   │   ├── review.controller.js
│   │   └── user.controller.js
│   ├── models/                # MongoDB models
│   │   ├── listing.model.js
│   │   ├── review.model.js
│   │   └── user.model.js
│   ├── routes/                # API routes
│   │   ├── auth.route.js
│   │   ├── listing.route.js
│   │   ├── payment.route.js
│   │   ├── review.route.js
│   │   └── user.route.js
│   ├── utils/                 # Utility functions
│   ├── uploads/               # Temporary upload storage (gitignored)
│   ├── index.js               # Express app entry point
│   └── .env                   # Environment variables (gitignored)
│
├── client/                    # Frontend React app
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/            # Page components
│   │   ├── store/            # Redux store configuration
│   │   ├── App.jsx           # Main App component
│   │   └── main.jsx          # React entry point
│   ├── dist/                 # Build output (gitignored)
│   ├── package.json
│   └── vite.config.js
│
├── uploads/                   # Root uploads folder (gitignored)
├── .gitignore                # Git ignore rules
├── package.json              # Root package.json
└── README.md                 # This file
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `POST /api/auth/signout` - User logout
- `GET /api/auth/verify` - Verify user token

### Users
- `GET /api/user/:id` - Get user by ID
- `PUT /api/user/:id` - Update user
- `DELETE /api/user/:id` - Delete user

### Listings
- `GET /api/listing` - Get all listings (with filters)
- `GET /api/listing/:id` - Get listing by ID
- `POST /api/listing` - Create new listing
- `PUT /api/listing/:id` - Update listing
- `DELETE /api/listing/:id` - Delete listing

### Payments
- `POST /api/payment/create` - Create PayPal payment order
- `POST /api/payment/capture` - Capture PayPal payment

### Reviews
- `GET /api/review/:listingId` - Get reviews for a listing
- `POST /api/review` - Create a review
- `PUT /api/review/:id` - Update review
- `DELETE /api/review/:id` - Delete review

### Uploads
- `POST /upload` - Upload images to Cloudinary (max 6 images)

## 💳 Payment Integration

This project uses PayPal for payment processing. The integration supports:

- **Sandbox Mode**: For testing (default)
- **Production Mode**: For live transactions

### PayPal Setup Steps

1. Create a PayPal Developer account
2. Create a Sandbox app
3. Get Client ID and Secret
4. Add credentials to `.env`
5. Update frontend PayPal client ID

For detailed instructions, refer to [README_PAYPAL.md](./README_PAYPAL.md)

### Testing Payments

Use the PayPal Sandbox accounts provided in `README_PAYPAL.md` for testing payment flows.

## 🧪 Testing

To test the application:

1. Start the backend server: `npm run server`
2. Start the frontend dev server: `npm run client`
3. Open `http://localhost:5173` in your browser
4. Sign up or sign in to access features
5. Create a listing or browse existing listings
6. Test payment integration using PayPal Sandbox accounts

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Prince94308**

- GitHub: [@Prince94308](https://github.com/Prince94308)

## 🙏 Acknowledgments

- React team for the amazing framework
- Express.js for the robust backend framework
- MongoDB for the flexible database solution
- Tailwind CSS for the utility-first CSS framework
- PayPal for the payment integration
- Cloudinary for image storage solutions
- All open-source contributors whose packages made this project possible

## 📞 Support

For support, email or create an issue in the GitHub repository.

---

**Made with ❤️ for the real estate community**

