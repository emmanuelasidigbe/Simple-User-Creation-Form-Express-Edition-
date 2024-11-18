import { Request, Response } from "express"; // Ensure correct imports
import path from "path";

const notFound = (req: Request, res: Response) => {
  const filePath = path.join(__dirname, "..", "public", "error.html");

  res.status(404).sendFile(filePath); // Send the error page with a 404 status
};

const serverError = (
  err: Error,
  req: Request,
  res: Response,
  next: Function
) => {
  console.error(err.stack);
  res.status(500).send("Internal Server Error");
};

export { notFound, serverError };
