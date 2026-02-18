<!-- =========================================================                -->

<!-- README TEMPLATE FOR PORTFOLIO PROJECTS                                   -->
<!-- =========================================================                -->
<!-- Название скриншота: preview.png                                          -->
<!-- Блок Tech Stack обязателен                                               -->
<!-- Граница блока: от 🧩 Tech Stack до <!-- end:tech-stack -->
<!-- Между ними — только теги (бейджи) и подзаголовки                        -->
<!-- Названия в [] отображаются в портфолио, соблюдать регистр                -->
<!-- Основной стек и вспомогательные библиотеки разделены стоп-комментарием   -->
<!-- Название самого файла README.md                                          -->
<!-- =========================================================                -->

# **🚧 Work in Progress 🚧**

# Project name: FlavorFit - backend

### 💎 Description

<!-- [<img src="preview.png" height="250" align="right" style="margin-left:20px" />](preview.png) -->

Backend for the project [**FlavorFit**](https://github.com/Inna-B10/FlavorFit), built with
`Nest.js`, `Prisma` and `GraphQL`.

### 🧩 Tech Stack

![Nest.js](https://img.shields.io/badge/Nest.js_11.0.1-424242?logo=nestjs&logoColor=E0234E)
![Prisma](https://img.shields.io/badge/Prisma_7.3.0-424242?logo=prisma)
![TypeScript](https://img.shields.io/badge/TypeScript_5.7.3-424242?logo=typescript&logoColor=3178C6)

<!-- end:tech-stack -->

#### **⚙️ Libraries & Technologies**

![graphql](https://img.shields.io/badge/graphql_16.12.0-424242?logo=graphql&logoColor=E10098)
![@as-integrations/express5](https://img.shields.io/badge/%40as--integrations%2Fexpress5_1.1.2-424242)
![@nestjs/graphql](https://img.shields.io/badge/%40nestjs%2Fgraphql_13.2.3-424242?logo=nestjs&logoColor=E0234E)
![@nestjs/apollo](https://img.shields.io/badge/%40nestjs%2Fapollo_13.2.3-424242?logo=nestjs&logoColor=E0234E)
![@nestjs/jwt](https://img.shields.io/badge/%40nestjs%2Fjwt_11.0.2-424242?logo=nestjs&logoColor=E0234E)
![@nestjs/passport](https://img.shields.io/badge/%40nestjs%2Fpassport_11.0.5-424242?logo=nestjs&logoColor=E0234E)
![@nestjs/config](https://img.shields.io/badge/%40nestjs%2Fconfig_4.0.2-424242?logo=nestjs&logoColor=E0234E)
![dotenv](https://img.shields.io/badge/dotenv_17.2.3-424242?logo=dotenv)
![passport-jwt](https://img.shields.io/badge/passport--jwt_4.0.1-424242)
![argon2](https://img.shields.io/badge/argon2_0.44.0-424242)
![cookie-parser](https://img.shields.io/badge/cookie--parser_1.4.7-424242)
![@prisma/client](https://img.shields.io/badge/%40prisma%2Fclient_7.3.0-424242)
![@prisma/adapter-pg](https://img.shields.io/badge/%40prisma%2Fadapter--pg_7.3.0-424242)
![decimal.js](https://img.shields.io/badge/decimal.js_10.6.0-424242)
![class-validator](https://img.shields.io/badge/class--validator_0.14.3-424242)
![class-transformer](https://img.shields.io/badge/class--transformer_0.5.1-424242)
![reflect-metadata](https://img.shields.io/badge/reflect--metadata_0.2.2-424242)

<details style="border:1px solid #d4d4d4; border-radius:2px; padding:1rem;">
<summary><h4 style="display:inline; padding-left:6px;">🗃 Dependencies</h4></summary>

```bash
npm install @nestjs/graphql
npm install @nestjs/apollo
npm install graphql
npm install prisma @prisma/client
npm install @prisma/adapter-pg
npm i @as-integrations/express5
npm install @nestjs/config
npm install -D dotenv
npm install @nestjs/jwt
npm install argon2
npm install @nestjs/passport
npm install @nestjs/passport-jwt
npm install -D @types/passport-jwt
npm install cookie-parser
npm install -D @types/cookie-parser
npm install -D prisma-nestjs-graphql
npm install graphql-type-json
npm install decimal.js
npm i class-validator
npm i class-transformer
npm i express-rate-limit
npm i helmet

```

</details>

---

### 📋 TODOs:

#### **frontend:**

- [ ] в Shopping list добавить возможность "отметить все ингредиенты данного рецепта"
- [ ] product without variants in cart!! view message

#### **backend:**

- [ ] verification email
- [ ] **Recipes, CRUD:**
  - [ ] ? при удалении проверка тегов на удаление
- [ ] **Products, CRUD:**
- [ ] ? meal type enum (breakfast, dinner, lunch,snacks desserts drinks)
- [ ] ? dietary tags (vegetar, gluten-free)
- [ ] Captcha
- [ ] CORS-configuration

<details style="border:1px solid #d4d4d4; border-radius:2px; padding:1rem;">
<summary><h4 style="display:inline; padding-left:6px;">✅ Done</h4></summary>

- [x] **input rules** + password rules/auth.input.ts
- [x] **user info:** 2 separate pages
  - [x] account
  - [x] profile+fitness
  - [x] **split user update and test it** = account/profile+fitness
- [x] **filtering:**
  - [x] searchTerm (name, desc, ingredient)
  - [x] difficulty
  - [x] tags (meal, dietary)
  - [x] dish type (main, bowl, sandwich, salad, wrap)
- [x] **sorting:**
  - [x] default (by data)
  - [x] recommended (by likes)
  - [x] popularity (by views)
  - [x] cookingTime
- [x] Order
- [x] Cart
- [x] Shopping list
- [x] pagination
- [x] likes, comments
- [x] **Recipes, CRUD:**
  - [x] обновить код после добавления isActive для товаров
  - [x] create, update delete recipe, get by slug, by ID
  - [x] admin service
- [x] **Products, CRUD:**
  - [x] Get all products without productVariant
  - [x] add field "isActive"
  - [x] Create, Edit, Delete, Get all, Get 1 by ID
  - [x] Create table/schema for variants of product(productVariant)
  - [x] productVariant CRUD
- [x] **Additional practice tasks:**
  - [x] Checking user existence before updating
- [x] Updating user
- [x] Updating body measurements
- [x] Updating profile details
- [x] **Additional tasks for practice:**
  - [x] In the console, create a full-fledged log output like NestJS, instead of the ugly "✅ Prisma
        connected to PostgreSQL" format, change the format to "[Nest] 54756 - 01/29/2026, 9:58:22 AM
        LOG [RouterExplorer] Mapped {/, GET} route +1ms"
  - [x] Replace **process.env** in `prisma.service` with **configService**
- [x] Get profile
- [x] **Login/Logout/Authorization:**
  - [x] Roles guard, auth guard
    - [x] Guard (endpoint protection by roles) Conditionally only for admin or only for authorized
          users
    - [x] For admin
    - [x] For authorized users
  - [x] Get new tokens
  - [x] Logout
  - [x] Attach and detach refreshToken in http-only cookies
  - [x] Validate user
  - [x] Login
  - [x] Generating JWT tokens (access + refresh)
  - [x] Password hashing
  - [x] Check if exist
  - [x] Registration
- [x] **Configure DB, Prisma, GraphQL:**
  - [x] Test the first test request to /graphql
  - [x] Configure graphql for nest.js
  - [x] Connect config service to access .env
  - [x] Create a prisma module and connect it to nest.js
  - [x] Create modules (module + resolver (or controller if REST API) + service) for auth, users,
        recipes, orders
  - [x] Write the remaining tables/models (userProfile, recipe, order, likes+comments)
  - [x] Verify that the users table has appeared in the database
  - [x] Run the first migration
  - [x] Write the first model (user)
  - [x] Install the database
  - [x] Create the Nest.js project

</details>
