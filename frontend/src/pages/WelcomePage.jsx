import React from 'react';
import { Link } from 'react-router-dom';

function WelcomePage() {
  return (
    <div style={styles.container}>

      <h1 style={styles.heading}>Welcome to Leave Management System</h1>
      <p style={styles.subheading}>Please choose an option to continue:</p>
      <div style={styles.buttonContainer}>
        <Link to="/login" style={styles.button}>
          Login
        </Link>
        <Link to="/signup" style={styles.button}>
          Sign Up
        </Link>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    width: '100vw', /* Add this line */
    backgroundColor: '#f0f2f5',
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
    textAlign: 'center',
  },

  heading: {
    fontSize: '2.5em',
    color: '#333',
    marginBottom: '15px',
  },
  subheading: {
    fontSize: '1.2em',
    color: '#555',
    marginBottom: '30px',
  },
  buttonContainer: {
    display: 'flex',
    gap: '20px',
    justifyContent: 'center',
  },
  button: {
    display: 'inline-block',
    padding: '12px 25px',
    fontSize: '1.1em',
    color: '#fff',
    backgroundColor: '#007bff',
    borderRadius: '5px',
    textDecoration: 'none',
    transition: 'background-color 0.3s ease',
    '&:hover': {
      backgroundColor: '#0056b3',
    },
  },
};

export default WelcomePage;