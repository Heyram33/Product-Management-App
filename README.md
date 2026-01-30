# Product Management App

A simple Product Management application built using React, TypeScript, and PrimeReact.  
It connects with Fake Store API to perform CRUD operations (Create, Read, Update, Delete) on products.

---

## 🧩 Features

### ✅ Part 1: Login
- Login using Fake Store API endpoint  
  `https://fakestoreapi.com/auth/login`
- Stores token in localStorage
- Shows toast notification on success
- Redirects to Products page after login

### ✅ Part 2: Product Management
- Fetch and display products from  
  `https://fakestoreapi.com/products`
- Add new product using POST request
- Edit product using PUT request
- Delete product using DELETE request
- Shows loading skeleton while fetching data
- Uses PrimeReact components for UI
- Basic form validation using Zod
- Protected route: users cannot access Products without login

---

## 🧰 Tech Stack

- React (TypeScript)
- PrimeReact
- TailwindCSS
- Axios
- React Router
- React Hook Form
- Zod
- Fake Store API

---

## 🚀 Setup & Run Locally

1. Clone repository  
   ```bash
   git clone https://github.com/Heyram33/Product-Management-App.git

2. Install dependencies  
   ```bash
   npm install

3. Start the development server  
   ```bash
   npm run dev


## 🚀 Login Credentials
  username: mor_2314
  password: 83r5^_
