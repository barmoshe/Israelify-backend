
# Israelify-backend

Israelify-backend is the backend component of the Israelify project, providing essential services such as authentication, RESTful APIs, middleware handling, logging, and MongoDB integration.

**Main Repository (Frontend):** [IsraelifyApp](https://github.com/Gal-Or/IsraelifyApp)

## Features

- **Authentication and REST APIs**: Secure user authentication and RESTful endpoints.
- **Middlewares**: Customizable middleware support.
- **Logger**: Integrated logging system.
- **MongoDB Integration**: Efficient MongoDB querying and data manipulation.

## Installation

To get started with Israelify-backend, follow these steps:

1. **Clone the repository:**
    ```bash
    git clone https://github.com/barmoshe/Israelify-backend.git
    ```
2. **Navigate to the project directory:**
    ```bash
    cd Israelify-backend
    ```
3. **Install dependencies:**
    ```bash
    npm install
    ```

## Usage

To run the application, use the following command:

```bash
npm start
```

## Configuration

Configuration files are located in the `config` directory. Ensure you set up your MongoDB connection string and other environment variables as required.

## Folder Structure

- `api`: Contains the API endpoints.
- `config`: Configuration files.
- `middlewares`: Custom middleware functions.
- `public`: Public assets (the frontend build).
- `services`: Core business logic and services.
- `server.js`: Entry point for the application.
