import express from "express";
import {
  getBooks,
  getBookById,
  getWallet,
  getTransactions,
  userLibrarySummaryHandler,
  bookLogsHandler,
} from "../controllers/admin.controller";
const router = express.Router();
// fetch all books
router.get("/book", async (req, res) => {
  try {
    await getBooks(req, res);
  } catch (error) {
    res.status(500).send({
      error:
        error instanceof Error
          ? error.message
          : "An error occurred while searching the books.",
    });
  }
});

// fetch books logs
router.get("/book/logs", async (req, res) => {
  try {
    await bookLogsHandler(req, res);
  } catch (error) {
    res.status(500).send({
      error:
        error instanceof Error
          ? error.message
          : "An error occurred while fetching the details.",
    });
  }
});

// fetch users library summary
router.get("/book/users", async (req, res) => {
  try {
    await userLibrarySummaryHandler(req, res);
  } catch (error) {
    res.status(500).send({
      error:
        error instanceof Error
          ? error.message
          : "An error occurred while fetching the details.",
    });
  }
});

// fetch books by id
router.get("/book/:id", async (req, res) => {
  try {
    await getBookById(req, res);
  } catch (error) {
    res
      .status(500)
      .send({ error: "An error occurred while getting the book detail." });
  }
});

// fetch wallet balance
router.get("/wallet/balance", async (req, res) => {
  try {
    await getWallet(req, res);
  } catch (error) {
    res
      .status(500)
      .send({ error: "An error occurred while fetching the wallet." });
  }
});
router.get("/wallet/transactios", async (req, res) => {
  try {
    await getTransactions(req, res);
  } catch (error) {
    res.status(500).send({
      error: "An error occurred while fetching the transctions history.",
    });
  }
});

export default router;
