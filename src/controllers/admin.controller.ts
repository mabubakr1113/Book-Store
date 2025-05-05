import { Request, Response } from "express";
import { searchBooks, getBookByIdService } from "../services/bookFetch.service";
import {
  fetchLedgerActivity,
  retrieveAccountBalance,
} from "../services/wallet.service";
import {
  summarizeUserHoldings,
  fetchBookActivityLogs,
} from "../services/activity.service";

export const getBooks = async (req: Request, res: Response) => {
  const search = req.query.search?.toString().trim().toLowerCase() || "";

  try {
    const books = await searchBooks(search);
    res.json(books);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({
      error: "Search failed",
      details: error instanceof Error ? error.message : String(error),
    });
  }
};

export const getBookById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const book = await getBookByIdService(id);

    if (!book) return res.status(404).json({ error: "Book not found" });

    res.json(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong." });
  }
};

export const getWallet = async (req: Request, res: Response) => {
  try {
    const wallet = await retrieveAccountBalance();

    if (!wallet) return res.status(404).json({ error: "Wallet not found" });

    res.json(wallet);
  } catch (error) {
    res.status(500).json({ error: "Something went wrong." });
  }
};

export const getTransactions = async (req: Request, res: Response) => {
  try {
    const { type, reason } = req.query;
    const logs = await fetchLedgerActivity(
      type?.toString(),
      reason?.toString()
    );

    if (!logs) {
      return res
        .status(404)
        .json({ error: "Transactions not found not found" });
    }
    res.json({ movements: logs });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong." });
  }
};

export const bookLogsHandler = async (req: Request, res: Response) => {
  try {
    const { bookId, type } = req.query;
    const actions = await fetchBookActivityLogs(
      bookId?.toString(),
      type?.toString()
    );
    res.json(actions);
  } catch (error) {
    console.error("Activity fetch error:", error);
    res.status(500).json({
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    });
  }
};

export const userLibrarySummaryHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const summary = await summarizeUserHoldings();
    res.json(summary);
  } catch (err) {
    console.error("Summary generation error:", err);
    res.status(500).json({ error: "Unable to generate user library summary" });
  }
};
