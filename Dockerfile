# Use official Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
#COPY package*.json ./

# Install dependencies
#RUN npm install -g @angular/cli
#RUN ng new trans-admin-web

#RUN npm install

# Copy app files
#COPY . .

# Expose the port for Angular
EXPOSE 4200

# Start the app
#CMD ["npm", "start"]
