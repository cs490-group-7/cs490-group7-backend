const request = require("supertest");
const app = require('./index');

describe("GET /health/check", () => {
    it("should return hello from server", async () => {
        const res = await request(app).get("/health/check");
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Hello World From Server!")
    });
});