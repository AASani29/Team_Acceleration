import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();

// Route to append data to the CSV
router.post("/update-csv", (req, res) => {
  const { banglaText, banglishText } = req.body;

  if (!banglaText || !banglishText) {
    return res.status(400).json({ message: "Bangla and Banglish text are required." });
  }

  // Path to your CSV file
  //const csvPath = path.join(__dirname, "../data/dataset.csv");
  const csvPath = path.resolve("api/data/dataset.csv"); // Adjust based on your folder structure


  const newRow = `"${banglaText}","${banglishText}"\n`;

  fs.appendFile(csvPath, newRow, (err) => {
    if (err) {
      console.error("Error updating CSV:", err);
      return res.status(500).json({ message: "Failed to update CSV." });
    }
    res.status(200).json({ message: "CSV updated successfully." });
  });
});

export default router;
