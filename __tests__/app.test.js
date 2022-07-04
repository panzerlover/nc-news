const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index.js");
const db = require("../db/connection.js");
const request = require("supertest");
const app = require("../api/app.js");
const { dropTables } = require("../db/helpers/manage-tables");

beforeEach(() => seed(testData));

afterAll(() => db.end());

describe("express app", () => {
  describe("bad path", () => {
    it("should return 404 for invalid paths", () => {
      return request(app)
        .get("/api/this_path_does_not_exist")
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Path Not Found :(");
        });
    });
  });
  describe("GET /api/topics", () => {
    it("status: 200 with slug and description properties", () => {
      return request(app)
        .get("/api/topics")
        .then(({ body }) => {
          expect(body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    slug: expect.any(String),
                    description: expect.any(String)
                })])
          );
        });
    });
    it('should return uncaught error when table does not exist', async () => {
        await dropTables();
        const res = await request(app).get("/api/topics")
        expect(res.status).toBe(500)
        expect(res.body.hasOwnProperty("error")).toBe(true);
        expect(res.body.error.code).toBe("42P01"); 
    });
    it('should return custom error when table is length 0', async () => {
        await db.query('DROP TABLE comments');
        await db.query('DROP TABLE articles');
        await db.query('DELETE FROM topics');
        const res = await request(app).get("/api/topics")
        expect(res.body.location).toEqual("models/fetchTopics")
    });
  });
});
