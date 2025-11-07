# 🧩 Distributed E-commerce Microservices (Node.js + TypeScript)

A fully functional **microservices-based e-commerce system** built using:

- Node.js + TypeScript  
- Express.js  
- Prisma ORM  
- PostgreSQL  
- Redis (Redis Stack)  
- RabbitMQ  
- Mailhog  
- API Gateway  
- Docker Compose  

This project demonstrates modern backend engineering skills including:  
microservices, event-driven communication, Redis caching, queues, transactions, and scalable architecture.

---

# 🏗️ Architecture Overview

```md
## Architecture Overview


                                +-----------------------+
                                |      API Gateway      |
                                |     (Reverse Proxy)   |
                                +-----------+-----------+
                                            |
            ------------------------------------------------------------------------
            |          |           |           |           |           |           |
            Auth    Product    Inventory     Cart       Orders       Email        User
            4003     4001        4002        4005        4006        4007         4004
            |        |            |           |           |           |            |
            ------------------------------------------------------------------------

                                RabbitMQ (Events)
                    send-email  •  clear-cart  •  update-inventory

                    Redis (Cart + Sessions)
                    PostgreSQL (All Microservice Databases)
                    Mailhog (Email Testing + SMTP Capture) 

```



---

# 🚀 Microservices Overview

## 🔐 Auth Service (4003)
- Register  
- Login  
- Verify email  
- Verify token  
- Issues and validates JWT  

## 🛍 Product Service (4001)
- Create product  
- Update product  
- Get product list and details  

## 📦 Inventory Service (4002)
- Create inventory record  
- Update stock (IN / OUT)  
- Inventory history tracking  
- Real-time stock check  

## 🛒 Cart Service (4005)
- Add to cart  
- View cart  
- Clear cart  
- Redis session-based cart  
- Inventory lock when cart added  

## 📑 Order Service (4006)
- Checkout  
- Create order  
- Fetch order(s)  
- Publishes `send-email` + `clear-cart` events  

## 📬 Email Service (4007)
- Send email via Mailhog SMTP  
- Store emails in DB  
- Queued email consumer  

## 👤 User Service (4004)
- Create user  
- Fetch user  

---

# 🚌 API Gateway

- Acts as the single entry point  
- Handles routing to services  
- Applies middleware (auth required routes)  
- Uses `config.json` to dynamically map routes  

Example:

```json
{
  "/auth": "http://localhost:4003",
  "/products": "http://localhost:4001"
}

```


# Database Architecture

Each service has its own Prisma schema and database tables.
PostgreSQL runs in Docker and all services connect independently.

---

## 🔧 Redis Usage

#### 1. Cart Storage
```
1. cart:<sessionId> = {
  "productId": { quantity, inventoryId }
}
```
#### 2. Session TTL
```
session:<sessionId> (EXPIRE)
```

## 📩 RabbitMQ Messaging
#### Events Published
- send-email → Order confirmation email
- clear-cart → Clear cart after successful checkout
#### Events Consumed
- Cart service consumes clear-cart
- Email service consumes send-email

### 🐳 Docker Setup
```
docker-compose up -d
```
---
#### Access Services
| Service     | URL                                              |
| ----------- | ------------------------------------------------ |
| PostgreSQL  | localhost:5432                                   |
| pgAdmin     | [http://localhost:5050](http://localhost:5050)   |
| Redis UI    | [http://localhost:8001](http://localhost:8001)   |
| RabbitMQ UI | [http://localhost:15672](http://localhost:15672) |
| Mailhog     | [http://localhost:8025](http://localhost:8025)   |

### ⚙️ Running Locally (Development Mode)
```
npm install
npm run dev
```
#### Apply database migrations:
```
yarn migrate:dev
```
---
### 📡 API Endpoints

#### AUTH
```
POST /auth/register
POST /auth/login
POST /auth/verify-token
POST /auth/verify-email
```
#### PRODUCT
```
GET /products
GET /products/:id
POST /products
PUT /products/:id
```
#### INVENTORY
```
POST /inventories
GET /inventories/:id
PUT /inventories/:id
GET /inventories/:id/details
```
#### CART
```
POST /cart/add-to-cart
GET /cart/me
GET /cart/clear
```
#### ORDER
```
POST /orders/checkout
GET /orders/:id
GET /orders
```
#### EMAIL
```
POST /emails/send
GET /emails
```
#### USER
```
POST /users
GET /users/:id
```
---

### 🧠 Skills Demonstrated

##### **This project highlights:**

- Microservices architecture

- Distributed system design

- Event-driven patterns (RabbitMQ)

- Redis caching + session design

- Transaction-based inventory update

- Strong TypeScript structure

- Docker-based orchestration

- Clean controller + service architecture

- API Gateway routing

- PostgreSQL + Prisma ORM
---

### 📞 Contact

For support,

**email: arifur.sew@gmail.com**

### Authors
[@Arif-Devs](https://github.com/Arif-Devs)









