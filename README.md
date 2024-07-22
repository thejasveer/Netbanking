# Netbanking App

Dummy Netbanking app to manage multiple banks, which supports ![Wallet App](https://github.com/thejasveer/WalletApp) for Onramping and Offramping money.

## High Level Design

![Alt text](./HighLevel.svg)

# Wallet App demo

<img src="https://raw.githubusercontent.com/thejasveer/WalletApp/main/apps/user-app/app/demo.gif" alt="Demo" width="300" height="500" />

## Features

1.  Create Netbanking acoount and provide you login token which you can use/access pre-added banks with fake credentials.
2.  OffRamp fake money from netbanking app.
3.  OnRamp fake money.
4.  Notifies Wallet Webhook server.

## STACK

🧰 **Turbo Repo:** Efficient monorepo management for the netbanking server.

🔗 **tRPC:** Enables efficient, type-safe communication between the client and server.

🔄 **WebSocket, React, Next.js:** Real-time updates ensure that users receive instant notifications of their transactions. The dynamic and responsive UI built with React and Next.js enhances the user experience with fast loading times and smooth navigation.

💾 **Redis:** Used for caching and ensuring fast access to frequently used data.

🏦 **Bank Client:** Manages communication with the bank servers from wallet app.

⚙️ **Worker:** Processes transactions efficiently, ensuring smooth and reliable operation (PUB/SUB).

🌐 **Express:** A robust backend framework used to build our webhook server, ensuring reliable handling of transaction updates and secure communication between services.

🛠️ **Prisma:** A powerful ORM that simplifies database management with type-safe queries, making it easier to handle complex database operations and maintain data integrity.

💻 **TypeScript:** Provides a type-safe codebase that helps catch errors early in the development process, improving code quality and maintainability.

🐳 **Docker & Docker Compose:** Simplified development, testing, and deployment by containerizing applications, ensuring consistent environments across all stages of the development lifecycle.

☁️ **AWS EC2:** Scalable and secure cloud hosting that ensures high availability and performance, allowing the app to handle a growing number of users and transactions seamlessly.

🔄 **CI/CD Pipeline:** An automated deployment process that facilitates continuous integration and delivery, ensuring that new features and updates are deployed quickly and reliably.

🎨 **Tailwind CSS:** A utility-first CSS framework that helps create elegant and responsive UI designs, making the app visually appealing and user-friendly.

## CI/CD jobs

1.  On pull requests build job will be run.
2.  On push to main branch it will be pushed docker image.
3.  On push to main branch it will push new docker image and pull on ec2 server and will start the app via docker compose.
