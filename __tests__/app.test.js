const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index.js");
const db = require("../db/connection.js");
const request = require("supertest");
const app = require("../api/app.js");
const { dropTables } = require("../db/helpers/manage-tables");
const ERR_MSGS = require("../api/utils/enum-errors")

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
    it.only('should call custom error handler when table does not exist', async () => {
        await dropTables();
        const {body} = await request(app).get("/api/topics");
        expect(body).toEqual({
            status: 500,
            msg: 'Something went wrong with GET topics :(',
            code: '42P01',
            pgDetails: {
              msg: 'The table or database you tried to reference may not exist',
              tip: 'Make sure your PSQL server has been spun up and seeded'
            },
            add_details: {}
          }
        )
    });
  });
});
