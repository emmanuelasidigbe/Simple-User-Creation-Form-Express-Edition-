import express, { Express, Request, Response, urlencoded } from "express";
import path from "path";
import { readFile } from "fs";
import { notFound, serverError } from "./middleware/error_middleware";

const app: Express = express(); // Initialize Express app
const PORT = 3000; // Port for the server to listen on

// Middleware to parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

// Middleware to serve static files from the "public" directory
app.use(express.static("public"));

const users: string[] = ["ark1500j"]; // Array to store usernames

// Route to serve the homepage
app.get("/", (req: Request, res: Response) => {
  res.sendFile("index.html"); // Send the "index.html" file as a response
});

// Route to display the list of users
app.get("/users", (req: Request, res: Response) => {
  const filePath = path.join(__dirname, "public", "users.html"); // Path to the "users.html" file

  // Read the "users.html" file
  readFile(filePath, "utf8", (err, data) => {
    if (err) {
      res.status(500).send("Error reading the HTML file"); // Handle file read error
      return;
    }

    // Replace the {{users}} placeholder in the HTML file with the actual list of users
    const userList = users
      .map(
        (user) =>
          `<li class="p-3 cursor-pointer text-center rounded-md hover:bg-neutral-700 transition">${user}</li>`
      )
      .join(""); // Create a list item for each user
    const updatedHtml = data.replace(
      "{{users}}",
      `<ul class="w-96 space-y-4 p-4 text-neutral-500">${userList}</ul>`
    );

    // Send the modified HTML file as the response
    res.send(updatedHtml);
  });
});

// Route to handle form submissions and create a new user
app.post("/create-user", (req: Request, res: Response) => {
  const { username }: { username: string } = req.body; // Extract the "username" from the request body

  // Validate that the username is not empty or contains only whitespace
  if (username && username.trim() !== "") {
    users.push(username);
    console.log(`New User Created: ${username}`);
  } else {
    console.log("Username is empty."); // Log an error if the username is invalid
  }
  res.redirect("/"); // Redirect back to the home route
});

// Middleware to handle 404 (Not Found) errors
app.use(notFound);

// Middleware to handle internal server errors
app.use(serverError);

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
