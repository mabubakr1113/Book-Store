import request from "supertest";
import app from "../src/app";

describe("Administrative User-Book Summary Tests", () => {
  const adminHeader = { "x-user-email": "admin@dummy-library.com" };

  it("should retrieve user-wise book transaction summary", async () => {
    const res = await request(app).get("/admin/book/users").set(adminHeader);

    expect(res.status).toBe(200);
    expect(res.body).toBeDefined();

    const userEmails = Object.keys(res.body);
    expect(userEmails.length).toBeGreaterThan(0);

    userEmails.forEach((email) => {
      const transactions = res.body[email];
      expect(Array.isArray(transactions)).toBe(true);
      expect(transactions.length).toBeGreaterThan(0);
    });
  });

  it("should return valid structure for each user transaction entry", async () => {
    const res = await request(app).get("/admin/book/users").set(adminHeader);

    const userEntries = Object.values(res.body) as any[][];

    userEntries.forEach((records) => {
      records.forEach((entry) => {
        expect(entry).toHaveProperty("bookId");
        expect(entry).toHaveProperty("title");
        expect(entry).toHaveProperty("authors");
        expect(Array.isArray(entry.authors)).toBe(true);
        expect(entry).toHaveProperty("genres");
        expect(Array.isArray(entry.genres)).toBe(true);
        expect(entry).toHaveProperty("type");
        expect(["BORROW", "BUY"]).toContain(entry.type);
        expect(entry).toHaveProperty("quantity");
        expect(entry.quantity).toBeGreaterThan(0);
      });
    });
  });
});
