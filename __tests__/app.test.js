const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index.js");
const db = require("../db/connection.js");
const request = require("supertest");
const app = require("../api/app.js");
const { dropTables } = require("../db/helpers/manage-tables");
const ERR_MSGS = require("../api/utils/enum-errors");

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
        .expect(200)
        .then(({ body }) => {
          expect(body).toEqual(
            expect.arrayContaining([
              expect.objectContaining({
                slug: expect.any(String),
                description: expect.any(String),
              }),
            ])
          );
        });
    });
    it("should call custom error handler when table does not exist", async () => {
      await dropTables();
      const { body, status } = await request(app).get("/api/topics");
      const { msg, tip } = ERR_MSGS.PG["42P01"]
      expect(status).toBe(500);
      expect(body).toEqual({
        status: 500,
        msg: msg,
        tip: tip
      });
    });
  });
  describe("GET /api/articles/:article_id", () => {
    it("status: 200 with correct properties", async () => {
      const {
        body: { article },
        status,
      } = await request(app).get("/api/articles/1");
      expect(status).toBe(200);
      expect(article).toEqual({
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: "2020-07-09T20:11:00.000Z",
        votes: 100,
        comment_count: 11,
      });
    });
    it("should return 400 when given article_id that is not a number ", async () => {
      const { body, status } = await request(app).get(
        "/api/articles/1; SELECT * FROM users"
      );
      const { msg, tip } = ERR_MSGS.PG["22P02"];
      expect(status).toBe(400);
      expect(body).toEqual(
        expect.objectContaining({
          status: 400,
          msg: msg,
          tip: tip
        })
      );
    });
    it("should return 404 when article id does not exist", async () => {
      const { body, status } = await request(app).get("/api/articles/9001");
      const { msg, tip } = ERR_MSGS.DOES_NOT_EXIST(9001, "article")
      expect(status).toBe(404);
      expect(body).toEqual({
        status: 404,
        msg: msg,
        tip: tip
      });
    });
  });
  describe("PATCH /api/articles/:article_id", () => {
    it("status 200: with updated article votes when votes is positive", async () => {
      const input = { inc_votes: 40 };
      const {
        body: {
          article: { votes: oldVotes },
        },
      } = await request(app).get("/api/articles/4");
      const {
        body: { 
          article: {votes: newVotes}},
        body: {article},
        status,
      } = await request(app).patch("/api/articles/4").send(input);
      expect(status).toBe(201);
      expect(newVotes).toBe(oldVotes + input.inc_votes);
      expect(article).toEqual({
        article_id: 4,
        title: "Student SUES Mitch!",
        topic: "mitch",
        author: "rogersop",
        body: "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
        created_at: "2020-05-06T01:14:00.000Z",
        votes: 40,
      });
    });
    it("status 200: with updated article votes when votes is negative", async () => {
      const input = { inc_votes: -400 };
      const {
        body: {
          article: { votes: oldVotes },
        },
      } = await request(app).get("/api/articles/4");
      const {
        body: {
          article: { votes: newVotes },
        },
        body: { article },
        status,
      } = await request(app).patch("/api/articles/4").send(input);
      expect(status).toBe(201);
      expect(newVotes).toBe(oldVotes + input.inc_votes);
      expect(article).toEqual(
        expect.objectContaining({
          article_id: 4,
          title: "Student SUES Mitch!",
          topic: "mitch",
          author: "rogersop",
          body: "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
          created_at: "2020-05-06T01:14:00.000Z",
          votes: -400,
        })
      );
    });
    it("400: missing vote body", async () => {
      const { body, status } = await request(app).patch("/api/articles/4");
      const {msg, tip} = ERR_MSGS.PG["23502"]
      expect(status).toBe(400);
      expect(body).toEqual({
        status: 400,
        msg: msg,
        tip: tip
      });
    });
    it("400: vote is wrong data type", async () => {
      const input = { inc_votes: "1; SELECT * FROM users;" };
      const {msg, tip} = ERR_MSGS.PG["22P02"]
      const { body, status } = await request(app)
        .patch("/api/articles/1")
        .send(input);
      expect(status).toBe(400);
      expect(body).toEqual({
        status: 400,
        msg: msg,
        tip: tip
      });
    });
    it("400: invalid article_id data type", async () => {
      const input = { inc_votes: 10 };
      const {msg,tip} = ERR_MSGS.PG["22P02"];
      const { body, status } = await request(app)
        .patch("/api/articles/banana")
        .send(input);
      expect(status).toBe(400);
      expect(body).toEqual({
        status: 400,
        msg: msg,
        tip: tip
      });
    });
    it("should return 404 custom error when valid article id but article does not exist", async () => {
      const input = { inc_votes: 10 };
      const {msg, tip} = ERR_MSGS.DOES_NOT_EXIST(9001, "article")
      const { body, status } = await request(app)
        .patch("/api/articles/9001")
        .send(input);
      expect(status).toBe(404);
      expect(body).toEqual({
        status: 404,
        msg: msg,
        tip: tip
      });
    });
  });
  describe("GET /api/users", () => {
    it("status 200: with array of users", async () => {
      const {
        body: { users },
        status,
      } = await request(app).get("/api/users");
      expect(status).toBe(200);
      expect(users).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          }),
        ])
      );
    });
    it('status 500: when table does not exist', async () => {
      await dropTables();
      const {msg, tip} = ERR_MSGS.PG["42P01"];
      const { body, status } = await request(app).get("/api/users");
      expect(status).toBe(500);
      expect(body).toEqual({
        status: 500,
        msg: msg,
        tip: tip
      });
    });
  });
  describe.only('GET /api/articles', () => {
    it('status 200: with array of articles', async () => {
      const {body: {articles}} = await request(app).get("/api/articles")
      expect(articles).toEqual(expect.arrayContaining([
        expect.objectContaining({
          article_id: expect.any(Number),
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          comment_count: expect.any(Number)
      })
    ]))
    });
    it('status 200: sorted in descending order', async () => {
      const {body: {articles}} = await request(app).get("/api/articles")
      expect(articles).toBeSortedBy("created_at", {descending: true})
    });
    it('status 500: when table does not exist', async () => {
      await dropTables();
      const {msg, tip} = ERR_MSGS.PG["42P01"];
      const { body, status } = await request(app).get("/api/articles");
      expect(status).toBe(500);
      expect(body).toEqual({
        status: 500,
        msg: msg,
        tip: tip
      });
    });
  });
});
