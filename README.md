# Image Processing Service API - By Ahmed Hesham

A RESTful API for user authentication, image upload, and image transformation.

## Base URL

```
/api/v1
```

## Features

- User registration and login with JWT authentication
- Secure endpoint access using JWTs
- Upload images (PNG, JPEG, etc.)
- Transform images (resize, crop, rotate, watermark, flip, mirror, compress, format conversion, grayscale, sepia)
- Retrieve image metadata
- List uploaded images with pagination
- Rate limiting to prevent abuse
- API documentation via Swagger/OpenAPI

## Authentication

### Register

- **POST** `/users/register`
- **Body:**  
  ```json
  { "username": "yourusername", "password": "yourpassword" }
  ```
- **Response:**  
  `201 Created` with user info.
- **Errors:**  
  `400 Bad Request` (missing fields), `409 Conflict` (username exists)

### Login

- **POST** `/users/login`
- **Body:**  
  ```json
  { "username": "yourusername", "password": "yourpassword" }
  ```
- **Response:**  
  `200 OK` with JWT token and user info.
- **Errors:**  
  `400 Bad Request` (missing fields), `401 Unauthorized` (invalid credentials)

## Images

All image endpoints require the `Authorization: Bearer <token>` header.

### Upload Image

- **POST** `/images`
- **Form Data:**  
  - `image`: (attach file)
- **Response:**  
  `201 Created` with image metadata.
- **Errors:**  
  `400 Bad Request` (no file uploaded), `401 Unauthorized`

### Transform Image

- **POST** `/images/:id/transform`
- **Body:**  
  ```json
  {
    "operations": {
      "resize": { "width": 100, "height": 100 },
      "rotate": 90,
      "filters": { "grayscale": true }
    }
  }
  ```
- **Response:**  
  Transformed image (binary, e.g. PNG).
- **Errors:**  
  `400 Bad Request` (no operations), `401 Unauthorized`, `404 Not Found`

### Get Image Metadata

- **GET** `/images/:id`
- **Response:**  
  ```json
  {
    "id": 1,
    "filename": "abc123.png",
    "userId": 2,
    "metadata": { "size": 12345, "mimetype": "image/png" }
  }
  ```
- **Errors:**  
  `401 Unauthorized`, `404 Not Found`

### List Images

- **GET** `/images?page=1&limit=10`
- **Response:**  
  Array of image metadata.
- **Errors:**  
  `401 Unauthorized`

## Running Locally

1. Install dependencies: `npm install`
2. Start MySQL and configure `.env` if needed.
3. Run migrations (e.g. with Sequelize CLI).
4. Start server: `npm start`

## API Reference

See [swagger.yaml](./swagger.yaml) for full OpenAPI documentation.

## Technologies Used

- Node.js, Express.js
- MySQL, Sequelize
- JWT (jsonwebtoken), bcrypt
- Multer (file uploads), Sharp (image processing)
- express-rate-limit, Joi/express-validator
- Winston/Pino (logging)
- Swagger/OpenAPI

## Project Structure

- `src/` - Main source code (controllers, routes, services, models)
- `uploads/` - Uploaded image files
- `tests/` - Automated tests
- `migrations/` - Database migrations
- `.env` - Environment variables

---
````
