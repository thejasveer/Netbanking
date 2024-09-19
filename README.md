# Netbanking App

The **Netbanking App** acts as a dummy netbanking platform where users can create multiple bank accounts and simulate financial activities. It works closely with the [Wallet App](https://github.com/thejasveer/WalletApp) to handle OnRamp and OffRamp money transfers. With real-time transaction updates using WebSocket and Redis for caching, it supports robust and efficient transactions. A key feature of the app is its ability to notify the Wallet App's webhook server about any financial activities, ensuring smooth synchronization across platforms.

## High-Level Design

![High-Level Design](./HighLevel.svg)

## Netbanking App Demo - (User redirected to app when withdraw or deposit is triggered)

<img src="https://raw.githubusercontent.com/thejasveer/WalletApp/main/apps/user-app/app/demo.gif" alt="Demo" width="300" height="500" />

## Design Patterns and Architectures

- **Module Pattern**: Applied across the project to expose specific methods and variables, promoting code reusability and maintainability.
- **Monorepo Architecture**: Managed with **Turbo Repo**, enabling seamless handling of multiple services, dependencies, and builds in a single codebase.
- **Singleton Pattern**: Utilized for managing database instances efficiently, ensuring that only one instance is used across the app.
- **WebSocket PUB/SUB Pattern**: Implemented for real-time communication across services, ensuring users get live transaction updates.
- **Component-Based Architecture**: Used in the frontend (React) to maintain clean, modular, and reusable UI components.

## Features

1. **Create Netbanking Account**: Users can create accounts and receive login tokens, which give them access to pre-added banks with fake credentials.
2. **OffRamp Transactions**: Allows users to transfer fake money from the netbanking app to the wallet system.
3. **OnRamp Transactions**: Users can simulate adding money from the wallet back to the netbanking app.
4. **Transaction Notifications**: Notifies the Wallet Webhook server about each transaction for real-time status updates.

## Tech Stack

🧰 **Turbo Repo**: Efficient monorepo management for the netbanking server, allowing for streamlined handling of dependencies and builds.

🔗 **tRPC**: Facilitates type-safe communication between the client and server, ensuring efficient data flow across services.

🔄 **WebSocket, React, Next.js**: Real-time updates provide instant transaction notifications. The dynamic UI, built with React and Next.js, enhances the user experience with fast loading times and smooth navigation.

💾 **Redis**: Used for caching frequently accessed data, ensuring fast and efficient processing.

🏦 **Bank Client**: Manages the communication between the wallet app and bank servers, facilitating OnRamp and OffRamp transactions.

⚙️ **Worker**: Processes transactions efficiently using the PUB/SUB system, ensuring smooth and reliable operation.

🌐 **Express**: Provides a robust backend framework for building the webhook server, which handles transaction updates and secures communication between services.

🛠️ **Prisma**: A powerful ORM that simplifies database management with type-safe queries, enabling easier handling of complex operations while maintaining data integrity.

💻 **TypeScript**: Ensures a type-safe codebase, catching potential errors early in the development process to improve code quality and maintainability.

🐳 **Docker & Docker Compose**: Simplifies development, testing, and deployment by containerizing applications, ensuring consistency across all stages of the development lifecycle.

☁️ **AWS EC2**: Provides secure and scalable cloud hosting, ensuring high availability and performance to handle growing user and transaction demands.

🔄 **CI/CD Pipeline**: Automated deployment through a CI/CD pipeline ensures fast, reliable updates and continuous integration.

🎨 **Tailwind CSS**: A utility-first CSS framework that enables elegant, responsive, and user-friendly UI designs.

## CI/CD Pipeline

1. **Pull Requests**: Automatically triggers a build job for each pull request to ensure code integrity and stability.
2. **Push to Main Branch**: When changes are pushed to the main branch, the Docker image is automatically built and pushed to the registry.
3. **Deployment on AWS EC2**: The new Docker image is pulled onto the EC2 server, and the app is automatically restarted via Docker Compose for continuous operation.

## Wallet App Integration

This **Netbanking App** directly integrates with the Wallet App to handle financial transactions, notifying the wallet's webhook server in real-time. Users can manage multiple accounts and simulate adding or withdrawing funds, while staying informed of their transaction statuses through live WebSocket updates.
