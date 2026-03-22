# Minimal Login Form (Client + Server Validation)

## Run locally
1) Install Node.js
2) In this folder:
   npm install
   npm start
3) Open:
   http://localhost:3000

## Demo credentials
Email: demo@example.com
Password: Password123!

## What is validated
Client-side:
- Non empty fields
- Email must contain "@"
- Password length >= 8

Server-side:
- Same checks as client
- Input length limits
- Password verification using a bcrypt hash
- Generic error on invalid credentials
