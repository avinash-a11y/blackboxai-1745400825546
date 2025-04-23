# Trustable Cares - Blood Donation Platform

Trustable Cares is a comprehensive blood donation platform that connects blood donors with recipients in need. The platform facilitates matching based on pin codes, allowing donors to submit their details securely. When a recipient requests blood, the system checks for matching donors and provides their information to facilitate coordination.

## 🩸 Features

### For Donors
- **Registration & Profile Management**: Create and manage your donor profile
- **Donation History**: Track your donation history and schedule
- **Availability Management**: Update your availability status
- **Matching Notifications**: Get notified when your blood type is needed in your area

### For Recipients
- **Blood Request Creation**: Create requests specifying blood type, units needed, and urgency
- **Donor Matching**: Automatically find compatible donors in your area
- **Request Management**: Track and manage your blood requests
- **Direct Communication**: Connect directly with matching donors

### General Features
- **Location-Based Matching**: Find donors and recipients in your area using pin code matching
- **Blood Type Compatibility**: Automatic matching based on blood type compatibility
- **User-Friendly Interface**: Intuitive design for easy navigation
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## 🛠️ Technology Stack

- **Frontend**: HTML, CSS (Tailwind CSS), JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MariaDB
- **ORM**: Sequelize
- **Authentication**: Express Session
- **UI Components**: Font Awesome, Google Fonts

## 📋 Project Structure

```
trustable-cares/
├── config/             # Configuration files
│   └── database.js     # Database configuration
├── controllers/        # Request handlers
├── models/             # Database models
│   ├── donor.js        # Donor model
│   ├── recipient.js    # Recipient model
│   ├── bloodRequest.js # Blood request model
│   └── donation.js     # Donation model
├── public/             # Static files
│   ├── css/            # Stylesheets
│   ├── js/             # Client-side JavaScript
│   └── images/         # Images
├── routes/             # API routes
│   ├── index.js        # Main routes
│   ├── donors.js       # Donor routes
│   ├── recipients.js   # Recipient routes
│   └── api.js          # API endpoints
├── views/              # HTML templates
├── app.js              # Application entry point
├── package.json        # Project dependencies
└── README.md           # Project documentation
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MariaDB (v10 or higher)

### Installation

#### Quick Setup (Recommended)

We provide convenient scripts to set up and run the application:

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/trustable-cares.git
   cd trustable-cares
   ```

2. For production:
   ```bash
   ./run.sh
   ```
   This script will:
   - Install dependencies
   - Create a default `.env` file if it doesn't exist
   - Ask if you want to seed the database with sample data
   - Start the application

3. For development:
   ```bash
   ./dev.sh
   ```
   This script will:
   - Install dependencies
   - Install nodemon globally if not already installed
   - Create a default `.env` file if it doesn't exist
   - Ask if you want to seed the database with sample data
   - Start the application in development mode with auto-restart on file changes

4. Open your browser and navigate to `http://localhost:8000`

#### Manual Setup

If you prefer to set up the application manually:

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/trustable-cares.git
   cd trustable-cares
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=8000
   NODE_ENV=development
   SESSION_SECRET=your_session_secret

   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=trustable_cares
   DB_USER=your_db_username
   DB_PASSWORD=your_db_password
   ```

4. Create the database:
   ```bash
   mysql -u root -p
   CREATE DATABASE trustable_cares;
   exit
   ```

5. (Optional) Seed the database with sample data:
   ```bash
   npm run seed
   ```

6. Start the application:
   ```bash
   npm start
   ```
   
   Or for development mode with auto-restart:
   ```bash
   npm run dev
   ```

7. Open your browser and navigate to `http://localhost:8000`

### Testing

To test the API endpoints:

```bash
npm run test:api
```

This will check if the server is running and test various API endpoints to ensure they are working correctly.

### Static File Serving

If you just want to serve the static files without running the full backend:

```bash
npm run serve
```

This will start a simple HTTP server that serves the static files from the `public` directory. This is useful for testing the frontend without running the full backend.

## 📱 Usage

### For Donors

1. Register as a donor by providing your details and blood group
2. Log in to your account
3. Update your profile and availability status
4. Respond to blood requests that match your blood type and location

### For Recipients

1. Register as a recipient
2. Create a blood request specifying your blood type, units needed, and urgency
3. View matching donors in your area
4. Contact donors directly to coordinate the donation

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- Developed during the COVID-19 pandemic to connect plasma donors with recipients
- Inspired by the need to save lives through efficient blood donation matching
- Special thanks to all blood donors who make a difference in people's lives
