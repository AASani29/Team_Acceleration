import express from "express";
import { exec } from "child_process";

const router = express.Router();

// Route to trigger training
router.post("/train-model", (req, res) => {
  exec("python3 ./scripts/train_model.py", (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing script: ${error.message}`);
      return res.status(500).json({ message: "Training failed." });
    }
    if (stderr) {
      console.error(`Script error: ${stderr}`);
      return res.status(500).json({ message: "Training encountered an error." });
    }
    console.log(`Script output: ${stdout}`);
    res.status(200).json({ message: "Model trained successfully." });
  });
});

export default router;
