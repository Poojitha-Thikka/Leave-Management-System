Leave Management System - MVP
# Leave Management System

This project is a full-stack application designed to simplify leave management for both employees and administrators. It's built with modern web technologies to provide a smooth and efficient experience.

## What It Does

**For Employees:**
- You can easily check your leave balances (Annual, Sick, Casual).
- Apply for new leave requests with a straightforward process.
- Keep track of the status of your submitted leave requests.
- Stay informed about upcoming company holidays.
- Read important company announcements.
- There's also a dark mode option for comfortable viewing.

**For Administrators (Future Enhancements):
- The plan is to enable administrators to approve or reject leave requests.
- Manage employee details.
- Add and update company holidays and announcements.
- Generate various leave reports.

## Under the Hood

**Frontend Technologies:**
- **React.js:** For building the interactive user interface.
- **React Router DOM:** Handles navigation within the application.
- **Axios:** Used for making API calls to the backend.
- **React Toastify:** Provides neat notification pop-ups.
- **Font Awesome:** For all the icons you see.
- **Tailwind CSS:** Helps in styling the application quickly and efficiently.
- **Vite:** Powers the fast development server and build process.

**Backend Technologies:**
- **Node.js & Express.js:** The foundation for our server-side logic and API.
- **Prisma:** A modern ORM that makes database interactions a breeze.
- **PostgreSQL (or SQLite for development):** Our chosen database system.
- **bcryptjs:** Securely handles password hashing.
- **jsonwebtoken:** For secure user authentication.
- **cors:** Manages cross-origin requests.
- **dotenv:** Keeps our sensitive configuration separate and secure.

## Getting Started

Here’s how you can get this project up and running on your local machine.

### What You'll Need

- Node.js (the latest LTS version is recommended)
- npm (comes with Node.js)
- Git

### 1. First, Clone the Repository

```bash
git clone <your-repository-url>
cd Leave-Management-System # Or whatever your project folder is called
```

### 2. Setting Up the Backend

Go into the `backend` directory, install the necessary packages, and configure your environment.

```bash
cd backend
npm install
```

**Environment Configuration:**

You'll need a `.env` file in the `backend` directory. Populate it with these details:



DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public" # Your database connection string
JWT_SECRET="a_very_long_and_random_secret_key_for_jwt" # Make this truly random and strong!
ADMIN_SECRET="your_special_admin_registration_key" # A secret for registering admin users





**Database Setup:**

Run Prisma migrations to prepare your database. If you're using SQLite, a `dev.db` file will be created automatically.

```bash
npx prisma migrate dev --name init
```

**Start the Backend Server:**

```bash
npm start
```

The backend will be accessible at `http://localhost:5000`.

### 3. Setting Up the Frontend

Open a new terminal window, navigate to the `frontend` directory, and install its dependencies.

```bash
cd ../frontend # This takes you from backend to frontend
npm install
```

**Start the Frontend Development Server:**

```bash
npm run dev
```

Your frontend application should now be running, typically at `http://localhost:5173`.

## How to Use It

1. Open your web browser and go to `http://localhost:5173`.
2. You can register as a new employee, or as an administrator if you use the `ADMIN_SECRET` during registration.
3. Log in with your new credentials to explore the dashboard.

## Want to Contribute?

Contributions are always welcome! Feel free to fork this repository, create a new branch for your features or fixes, and submit a pull request. 

## License

This project is open-source and available under the MIT License. See the `LICENSE` file for more details.
