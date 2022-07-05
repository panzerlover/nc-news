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
    it('should call custom error handler when table does not exist', async () => {
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
  describe('GET /api/articles/:article_id', () => {
    it('status: 200 with correct properties', async () => {
        const { body: {article} } = await request(app).get("/api/articles/1")
        expect(article).toEqual({
          article_id: 1,
          title: 'Living in the shadow of a great man',
          topic: 'mitch',
          author: 'butter_bridge',
          body: 'I find this existence challenging',
          created_at: '2020-07-09T20:11:00.000Z',
          votes: 100
        })
        
    });
    it('should return 500 when given article_id that is not a number ', async () => {
        const { body } = await request(app).get("/api/articles/1; SELECT * FROM users")
        expect(body).toEqual(expect.objectContaining({
                status: 500,
                msg: 'Something went wrong with GET articles :(',
                code: '22P02',
                pgDetails: {
                    msg: "Invalid text representation",
                    tip: "check the data type of your parameter"
                },
                add_details: {}
        })
        )
    });
    
  });
});
