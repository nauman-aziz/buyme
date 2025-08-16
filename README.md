# Welcome to your buyme project

## Project info


**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in buyme.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```


**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- JavaScript
- React
- Tailwind CSS
- Stripe
- Next js
- Prisma
- seeding
- db migration

## 🧩 How They All Work Together

Docker gives you Postgres running locally.

Prisma schema defines models (User, Product, Faq).

Migrations apply schema changes to the database.

Seeding fills the DB with test/demo data.

Frontend (Next.js) can now fetch data via APIs that talk to Prisma, which talks to Postgres.

So when you ran all those commands, you basically:

Brought up a database (docker compose up).

Told Prisma to sync schema with DB (prisma migrate dev).

Inserted starter data (npm run db:seed).

To get started:

# Install dependencies
npm install

# Setup database with Docker
docker-compose up -d

# TO check if docker is up
docker exec -e PGPASSWORD=postgres -it gearhub-postgres psql -U postgres -d gearhub -c "select 'connected' as status;"

# Run migrations and seed data
npx prisma generate 
npm run db:migrate
npm run db:seed

# Start development
npm run dev
Test accounts:

Admin: admin@demo.dev / Admin123!
Customer: customer@demo.dev / Customer123!
