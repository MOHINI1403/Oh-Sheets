
# Oh Sheets
[![Docker](https://img.shields.io/badge/docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Node.js](https://img.shields.io/badge/node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/mongodb-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Postman](https://img.shields.io/badge/postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white)](https://www.postman.com/)
[![Clerk](https://img.shields.io/badge/clerk-000000?style=for-the-badge&logo=clerk&logoColor=white)](https://clerk.dev/)
[![Socket.IO](https://img.shields.io/badge/socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)](https://socket.io/)


 ### Problem Statement:
We are modernizing SocialCalc, a web-based collaborative spreadsheet application that has become outdated. Originally part of the Socialtext platform, SocialCalc offered innovative solutions for collaborative editing and data management but has struggled to keep up with modern web technologies. Our challenge is to redevelop SocialCalc using contemporary frameworks like React, Node.js, MongoDB, and Express, while integrating modern features such as real-time collaboration, user authentication, and scalability.

## How are we addressing the Problem Statement:
We’ve named our modern version "Oh Sheets", and it addresses the core limitations of SocialCalc by providing a secure, scalable, and efficient solution for real-time collaborative data management.

Here’s how we’ve approached the modernization:

- **Core Spreadsheet Functionality**: Our application replicates key spreadsheet features like cell editing, formulas, sorting, and filtering, ensuring it handles large datasets effectively.

- **Real-Time Collaboration**: We've integrated real-time collaboration using Socket.IO, allowing multiple users to edit the same spreadsheet simultaneously with instant updates reflected across all sessions.

- **User Authentication**: We’ve implemented secure authentication using Clerk, allowing users to log in through their Google accounts, ensuring each user has a unique ID and a clean dashboard for managing their spreadsheets.

- **Data Persistence and Security**: Data is securely stored in MongoDB and persists across sessions. We've also added version control, allowing users to back up and restore data to protect against any data loss.

- **Responsive UI**: The frontend is built with React and Vite, providing a responsive, intuitive interface across devices, from desktops to smartphones.

- **Dark Mode and Extensibility**: We’ve added a dark mode feature to enhance user experience and built the system with extensibility in mind, allowing future developers to easily add new functionalities.

## Key Features:

Key Functionalities Demonstrated in the Prototype:

- **Dockerization**: The entire application is containerized using Docker, allowing for easy deployment and scalability across different environments.

- **Real-Time Collaboration**: Users can seamlessly collaborate in real time by simply clicking on a shared URL, with changes instantly reflected for all participants.

- **Robust APIs**: We've developed and thoroughly tested both frontend and backend APIs to ensure efficient, secure communication between the server and client.

- **Unique Spreadsheet Linking**: Every spreadsheet is linked to a specific sheet ID, ensuring data integrity and separation. Each user, identified via their unique Gmail account, can manage their own set of spreadsheets, which are all distinct from one another.

### Technologies Used: 
- **Frontend** : Vite ShadCN Clerk(for Authentication)
- **Backend** : Node.Js Express Js
- **Database** : MongoDB and Mongoose(for Data Modelling)
- **Real-Time-Collaboration** : Socket.IO
- **containerization** : Docker

## Architecture:
![OH Sheets Architecture](https://raw.githubusercontent.com/MOHINI1403/Oh-Sheets/main/OH-Sheets%20Architecture.png)

## Relevant Links:
- **Video Demonstration:** [Watch Video](https://www.youtube.com/watch?v=W1fe2un6SVY)
- **Deployed Link**: [Deployed Project Link](social-calc-internal-frontend.vercel.app)

## Steps to run the application in the local environment

### Prerequisites

Before running the application, make sure Nodejs have been installed on the system.

### Installation

- Clone this repository to your local machine:

   ```bash
   https://github.com/NerdChanOjas/SIH_INTERNAL_ROUND_1_BITWISER.git
   ```
- Open 2 terminal in the cloned directly
  
- Go to the following folder in one terminal and install the dependancies
    ```bash
      cd ./code/client
      npm install
    ```
- Go to the following folder in another terminaland install the dependancies
    ```bash
      cd ./code/server
      npm install
    ```
- Run the following command in both the directories.
    ```bash
    npm run dev
    ```
