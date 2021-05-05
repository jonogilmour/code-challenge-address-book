FROM node:12

WORKDIR /

# Install node packages beforehand
COPY package.json .
COPY package-lock.json .
RUN npm install

# Copy the project files into the container.
COPY . .

# Ensure the wait script is executable.
RUN chmod +x ./wait.sh

ENTRYPOINT ["./wait.sh", "db:3306", "-t", "120", "--", "node", "./server.js"]
