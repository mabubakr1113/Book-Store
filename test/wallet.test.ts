import request from "supertest";
import app from "../src/app";

describe("Finance Endpoint Validations", () => {
  const systemAdmin = "admin@dummy-library.com";

  it("should retrieve current wallet stats", async () => {
    const res = await request(app)
      .get("/admin/wallet/balance")
      .set("x-user-email", systemAdmin);

    expect(res.status).toBe(200);
    expect(res.body.balance).toBeDefined();
    expect(typeof res.body.balance).toBe("string");
    expect(parseFloat(res.body.balance)).toBeGreaterThanOrEqual(0);
  });

  it("should fetch wallet transaction logs", async () => {
    const res = await request(app)
      .get("/admin/wallet/transactios")
      .set("x-user-email", systemAdmin);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.movements)).toBe(true);
    expect(res.body.movements.length).toBeGreaterThan(0);

    res.body.movements.forEach(
      (entry: {
        id: unknown;
        type: string;
        amount: number;
        reason: string;
        createdAt: string;
        walletId: string;
      }) => {
        expect(entry.id).toBeDefined();
        expect(entry.type).toBeDefined();
        expect(entry.amount).toBeDefined();
        expect(typeof entry.amount).toBe("number");
        expect(entry.reason).toBeDefined();
        expect(entry.createdAt).toBeDefined();
        expect(new Date(entry.createdAt).toString()).not.toBe("Invalid Date");
        expect(entry.walletId).toBeDefined();
      }
    );

    const allowedTypes = ["CREDIT", "DEBIT"];

    res.body.movements.forEach((entry: { type: string }) => {
      expect(allowedTypes).toContain(entry.type);
    });
  });
});
