# README

## Introduction
This project is designed to automate the retrieval and transfer of files from a secure online platform (**ems.africacdc.org**) to a remote server via **SFTP**. It uses modern tools to handle web interactions, file downloads, and secure file transfers.

## Key Features
- Automates scheduled tasks using **node-cron**.
- Interacts with a secure web interface using **Puppeteer**.
- Downloads and saves necessary files locally.
- Transfers files to a remote server via **SFTP**.

---

## How the Process Works
This project is built to function seamlessly by automating complex tasks in a structured pipeline. Here's how the process works:

1. **Authentication and Navigation**:
   - The script uses Puppeteer to open a headless browser, simulating a real user logging into the platform.
   - It navigates to the login page and submits credentials securely fetched from the `.env` file.
   - After logging in, the script retrieves an authentication cookie (`JSESSIONID`), which is necessary for subsequent API interactions.

2. **Fetching and Downloading Files**:
   - The script references `downloadLinks.js`, which contains the URLs and filenames of the data files to be downloaded.
   - Using `axios`, the script sends HTTP requests with the authentication cookie to fetch the specified files.
   - Each file is saved locally with a specified name.

3. **Secure File Transfer (SFTP)**:
   - Once files are downloaded, the script connects to a remote SFTP server using credentials stored in the `.env` file.
   - The `ssh2-sftp-client` library handles this connection and securely transfers each file to the specified directory on the remote server.

4. **Scheduled Automation**:
   - The script uses `node-cron` to automate the entire process. By default, it runs every Sunday at midnight.
   - This ensures regular updates without requiring manual intervention.

5. **Logging and Debugging**:
   - Throughout the process, detailed logs are generated to track successes, failures, and potential errors.
   - These logs help diagnose issues quickly, ensuring the reliability of the script.

---

## Prerequisites
### Required Tools:
1. **Node.js** (v16 or later recommended)
2. **Google Chrome** or **Chromium** installed locally for Puppeteer to function.
3. The following npm modules (full list in `package.json`):
   - `puppeteer`
   - `ssh2-sftp-client`
   - `node-cron`
   - `dotenv`
   - `axios`

### `.env` File
You need to create a `.env` file at the root of the project containing the required sensitive information:

```
J_USERNAME=your_username_here
J_PASSWORD=your_password_here
SSH_HOST=your_sftp_server
SSH_USERNAME=your_sftp_username
SSH_PASSWORD=your_sftp_password
```

### Chrome Configuration for Puppeteer
Puppeteer requires **Google Chrome** or **Chromium**. If these browsers are unavailable or cannot be automatically detected, you can install them with the following command:
```bash
npx puppeteer browsers install chrome
```

---

## Project Structure

### **Main Files**

1. **`index.js`**
   - Contains the main logic to launch the synchronization process.
   - Implements a **cron job** to automate execution every Sunday at midnight.

2. **`downloadLinks.js`**
   - Contains the list of files to download, along with their URLs and corresponding filenames.

3. **`utils.js`**
   - Defines utility functions such as:
     - `getSessionCookie`: Retrieves the session cookie after authentication.
     - `downloadFiles`: Downloads files from the provided links.

4. **`config.js`**
   - Centralizes configurations for Puppeteer and SFTP.

---

## Installation and Usage

### Step 1: Install Dependencies
Run the following command in the project directory:
```bash
npm install
```

### Step 2: Configure the Environment
Create a `.env` file with your information (see the Prerequisites section).

### Step 3: Install Chrome for Puppeteer
Ensure Puppeteer has access to Google Chrome by running:
```bash
npx puppeteer browsers install chrome
```

### Step 4: Run the Script Manually
You can manually execute the script to test the process:
```bash
node index.js
```

### Step 5: Automate with Cron
The script is automatically executed every Sunday at midnight using **node-cron**.

### Force the download 
To force the download of the files, we execute:
```bash
node index.js --force
```
---

## Modules Used

### 1. **Puppeteer**
- **Usage**: Automates interactions with the web interface.
- **Purpose**: Simulates a user logging in, fetching data, and interacting with the platform programmatically.

### 2. **ssh2-sftp-client**
- **Usage**: Securely transfers files to an SFTP server.
- **Purpose**: Ensures the downloaded data is safely moved to a remote server.

### 3. **node-cron**
- **Usage**: Schedules the automatic execution of the script.
- **Purpose**: Eliminates the need for manual intervention by automating periodic runs.

### 4. **dotenv**
- **Usage**: Loads sensitive environment variables (e.g., credentials).
- **Purpose**: Keeps sensitive information out of the codebase for better security.

### 5. **axios**
- **Usage**: Downloads files from URLs.
- **Purpose**: Handles HTTP requests efficiently for fetching data files.

---

## Important Notes
- **Security**: Never share your `.env` file or credentials.
- **Debugging**: Console logs provide detailed information to diagnose potential issues.
- **Customization**: You can modify the `downloadLinks.js` file to add or remove files for synchronization.

---

## Next Steps: Deploy on a Server
To ensure the script runs continuously and reliably:
1. **Deploy to a Dedicated Server**:
   - Use a VPS or a cloud-based server (e.g., AWS, Azure, DigitalOcean).

2. **Run as a Background Process**:
   - Use **PM2** or similar tools to manage the script.
   - Install PM2 globally:
     ```bash
     npm install -g pm2
     ```
   - Start the script with PM2:
     ```bash
     pm2 start index.js --name "file-sync"
     ```
   - Ensure it restarts automatically on server reboot:
     ```bash
     pm2 startup
     pm2 save
     ```

3. **Containerize with Docker**:
   - Create a `Dockerfile` for the project:
     ```dockerfile
     FROM node:16

     WORKDIR /app

     COPY package*.json ./
     RUN npm install

     COPY . .

     CMD ["node", "index.js"]
     ```
   - Build and run the Docker container:
     ```bash
     docker build -t file-sync .
     docker run -d --name file-sync file-sync
     ```

4. **Monitor Logs and Performance**:
   - Use tools like **PM2 logs** or Docker logs to monitor execution.

---

## Contributions
For any improvements or suggestions, please open an issue or submit a pull request on the associated GitHub repository.

---

## Author
Code written and documented by **TANDOU Lenny**, tailored for professional automated use.

