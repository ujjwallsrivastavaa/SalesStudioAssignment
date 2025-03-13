# Round-Robin Coupon Distribution with Abuse Prevention

A simple web platform for fair coupon distribution with IP and cookie-based abuse prevention.

## Live Link

https://couponizer.vercel.app


## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)


## Overview

This web platform ensures fair and sequential coupon distribution to guest users. It prevents abuse by restricting multiple claims within a set time frame using IP tracking and browser cookies.

## Features

- **Round-Robin Coupon Allocation**: Ensures even distribution among users.
- **Guest Access**: No login or account creation required.
- **Abuse Prevention**:
    - **IP Tracking**: Restricts repeated claims from the same IP within a specified time.
    - **Cookie Tracking**: Prevents multiple claims from the same browser session.
- **User Feedback**: Displays messages for successful claims and cooldown periods.

## Installation

### 1. Fork & Clone the Repository

#### Fork the Repository:
Go to the repository URL and click on the Fork button to create a copy under your GitHub account.

#### Clone the Forked Repository:
In your terminal, clone the repository to your local machine:

```sh
git clone <your-forked-repository-url>
```
### Navigate to the Project Directory:

```sh
cd <project-directory>
```
### 2. Set Up the Client (React.js)

#### Navigate to the Client Directory:

```sh
cd client
```

#### Install Dependencies:

```sh
npm install
```

#### Set up your environment variables:
Create a .env file in the frontend directory and add the following variables:

```sh
VITE_API_BASE_URL=http://localhost:3000
```

#### Start the Client:
Run the following command to start the client:

```sh
npm run dev
```

The client will typically be available at http://localhost:5173

### 3. Set Up the Server (Express)

#### Navigate to the Server Directory:

```sh
cd server
```

#### Install Dependencies:

```sh
npm install
```

#### Set up your environment variables:

Create a .env file in the backend directory and add the following variables:

```sh
PORT=3000
MONGO_URI=<Your MongoDB URL>
FRONTEND_URI = http://localhost:5173
```

#### Start the Server:

Run the following command to start the server:

```sh
npm run dev
```

The server will typically run on: http://localhost:3000

