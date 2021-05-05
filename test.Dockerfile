FROM node:12

WORKDIR /

RUN mkdir server

WORKDIR server

# Install node packages beforehand
COPY package.json .
COPY package-lock.json .
RUN npm install

# Copy the project files into the container.
COPY . .

# Ensure the wait script is executable.
RUN chmod +x ./wait.sh

ENTRYPOINT ["./wait.sh", "db:3306", "-t", "120", "--", "npm", "run", "test-local"]
