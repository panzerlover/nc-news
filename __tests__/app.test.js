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
    it("status 500: when table or db does not exist", async () => {
      await dropTables();
      const { body, status } = await request(app).get("/api/topics");
      const { msg, tip } = ERR_MSGS.PG["42P01"];
      expect(status).toBe(500);
      expect(body).toEqual({
        status: 500,
        msg: msg,
        tip: tip,
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
          tip: tip,
        })
      );
    });
    it("should return 404 when article id does not exist", async () => {
      const { body, status } = await request(app).get("/api/articles/9001");
      const { msg, tip } = ERR_MSGS.DOES_NOT_EXIST;
      expect(status).toBe(404);
      expect(body).toEqual({
        status: 404,
        msg: msg,
        tip: tip,
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
          article: { votes: newVotes },
        },
        body: { article },
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
      const { msg, tip } = ERR_MSGS.PG["23502"];
      expect(status).toBe(400);
      expect(body).toEqual({
        status: 400,
        msg: msg,
        tip: tip,
      });
    });
    it("400: vote is wrong data type", async () => {
      const input = { inc_votes: "1; SELECT * FROM users;" };
      const { msg, tip } = ERR_MSGS.PG["22P02"];
      const { body, status } = await request(app)
        .patch("/api/articles/1")
        .send(input);
      expect(status).toBe(400);
      expect(body).toEqual({
        status: 400,
        msg: msg,
        tip: tip,
      });
    });
    it("400: invalid article_id data type", async () => {
      const input = { inc_votes: 10 };
      const { msg, tip } = ERR_MSGS.PG["22P02"];
      const { body, status } = await request(app)
        .patch("/api/articles/banana")
        .send(input);
      expect(status).toBe(400);
      expect(body).toEqual({
        status: 400,
        msg: msg,
        tip: tip,
      });
    });
    it("should return 404 custom error when valid article id but article does not exist", async () => {
      const input = { inc_votes: 10 };
      const { msg, tip } = ERR_MSGS.DOES_NOT_EXIST;
      const { body, status } = await request(app)
        .patch("/api/articles/9001")
        .send(input);
      expect(status).toBe(404);
      expect(body).toEqual({
        status: 404,
        msg: msg,
        tip: tip,
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
    it("status 500: when table does not exist", async () => {
      await dropTables();
      const { msg, tip } = ERR_MSGS.PG["42P01"];
      const { body, status } = await request(app).get("/api/users");
      expect(status).toBe(500);
      expect(body).toEqual({
        status: 500,
        msg: msg,
        tip: tip,
      });
    });
  });
  describe("GET /api/articles", () => {
    it("status 200: with array of articles", async () => {
      const {
        body: { articles },
      } = await request(app).get("/api/articles");
      articles.forEach((article) =>
        expect(article).toEqual(
          expect.objectContaining({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(Number),
          })
        )
      );
    });
    it("status 200: sorted by created_at in descending order by default", async () => {
      const {
        body: { articles },
      } = await request(app).get("/api/articles");
      expect(articles).toBeSortedBy("created_at", { descending: true });
    });
    it("status 200: accepts alternate sort_by queries ", async () => {
      const columns = [
        "title",
        "topic",
        "author",
        "body",
        "created_at",
        "votes",
      ];
      for (let i = 0; i < columns.length; i++) {
        const {
          body: { articles },
        } = await request(app)
          .get("/api/articles")
          .query({ sort_by: columns[i] });
        expect(articles).toBeSortedBy(columns[i], {
          descending: true,
          coerce: true,
        });
      }
    });
    it("status 200: accepts ascending order query", async () => {
      const { body: {articles} } = await request(app)
      .get("/api/articles")
      .query({order: "asc"});
      expect(articles).toBeSortedBy("created_at", {ascending: true});
    });
    it('status 200: accepts sort_by AND order query', async () => {
      const { body: {articles} } = await request(app)
      .get("/api/articles")
      .query({sort_by: "title", order: "asc"});
      expect(articles).toBeSortedBy("created_at", {ascending: true, coerce: true});
    });
    it('status 200: accepts topic query', async () => {
      const {body: {articles}} = await request(app)
      .get("/api/articles")
      .query({topic: "mitch"});
      articles.forEach((article)=>{
        expect(article.topic).toBe("mitch");
      })
    });
    it('status 200: accepts valid sort_by, order, and topic queries', async () => {
      const { body: {articles} } = await request(app)
      .get("/api/articles")
      .query({sort_by: "title", order: "asc", topic: "mitch"});
      expect(articles).toBeSortedBy("created_at", {ascending: true, coerce: true})
      articles.forEach((article)=> {
        expect(article.topic).toBe("mitch")
      })
    });
    it("status 400: rejects invalid order", async () => {
      const { body } = await request(app)
        .get("/api/articles")
        .query({ order: "desc; SELECT * FROM users" });
      const errBody = ERR_MSGS.INVALID_QUERY;
      expect(body).toEqual(errBody);
    });
    it("status 400: rejects invalid sort_by column", async () => {
      const { body } = await request(app)
        .get("/api/articles")
        .query({ sort_by: "age; SELECT * FROM users" });
      const errBody = ERR_MSGS.INVALID_QUERY;
      expect(body).toEqual(errBody);
    });
    it('status 404: when topic does not exist', async () => {
      const {body} = await request(app)
      .get("/api/articles")
      .query({topic: "non-existent topic"});
      const errObj = ERR_MSGS.DOES_NOT_EXIST;
      expect(body).toEqual(errObj);
    });
    it("status 500: when table does not exist", async () => {
      await dropTables();
      const { msg, tip } = ERR_MSGS.PG["42P01"];
      const { body, status } = await request(app).get("/api/articles");
      expect(status).toBe(500);
      expect(body).toEqual({
        status: 500,
        msg: msg,
        tip: tip,
      });
    });
  });
  describe("GET api/articles/:article_id/comments", () => {
    it("status 200: array of comments with only specified article id", async () => {
      const {
        body: { comments },
      } = await request(app).get("/api/articles/1/comments");
      comments.forEach((comment) =>
        expect(comment).toEqual(
          expect.objectContaining({
            comment_id: expect.any(Number),
            body: expect.any(String),
            article_id: 1,
            author: expect.any(String),
            votes: expect.any(Number),
            created_at: expect.any(String),
          })
        )
      );
    });
    it("status 404: valid article_id (no such article id)", async () => {
      const { msg, tip } = ERR_MSGS.DOES_NOT_EXIST;
      const { body, status } = await request(app).get(
        "/api/articles/9001/comments"
      );
      expect(status).toBe(404);
      expect(body).toEqual({
        status: 404,
        msg: msg,
        tip: tip,
      });
    });
    it("status 400: invalid article_id (invalid type)", async () => {
      const { msg, tip } = ERR_MSGS.PG["22P02"];
      const { body, status } = await request(app).get(
        "/api/articles/1; SELECT * FROM users/comments"
      );
      expect(status).toBe(400);
      expect(body).toEqual({
        status: 400,
        msg: msg,
        tip: tip,
      });
    });
    it("status 500: when table does not exist", async () => {
      await dropTables();
      const { msg, tip } = ERR_MSGS.PG["42P01"];
      const { body, status } = await request(app).get(
        "/api/articles/1/comments"
      );
      expect(status).toBe(500);
      expect(body).toEqual({
        status: 500,
        msg: msg,
        tip: tip,
      });
    });
  });
  describe("POST /api/articles/:article_id/comments", () => {
    it("status: 201 with added comment", async () => {
      const input = { username: "lurker", body: "me no like" };
      const {
        body: { comment },
        status,
      } = await request(app).post("/api/articles/1/comments").send(input);
      expect(status).toBe(201);
      expect(comment).toEqual(
        expect.objectContaining({
          comment_id: 19,
          body: input.body,
          article_id: 1,
          author: input.username,
          votes: 0,
          created_at: expect.any(String),
        })
      );
    });
    it("status 400: when no request body", async () => {
      const { msg, tip, status: errStatus } = ERR_MSGS.PG["23502"];
      const { body, status } = await request(app).post(
        "/api/articles/1/comments"
      );
      expect(status).toEqual(errStatus);
      expect(body).toEqual({
        status: errStatus,
        msg: msg,
        tip: tip,
      });
    });
    it("status 400: when missing username", async () => {
      const { msg, tip, status: errStatus } = ERR_MSGS.PG["23502"];
      const input = { body: "me REALLY no like" };
      const { body, status } = await request(app)
        .post("/api/articles/1/comments")
        .send(input);
      expect(status).toEqual(errStatus);
      expect(body).toEqual({
        status: errStatus,
        msg: msg,
        tip: tip,
      });
    });
    it("status 400: when missing body", async () => {
      const { msg, tip, status: errStatus } = ERR_MSGS.PG["23502"];
      const input = { username: "lurker" };
      const { body, status } = await request(app)
        .post("/api/articles/1/comments")
        .send(input);
      expect(status).toEqual(errStatus);
      expect(body).toEqual({
        status: errStatus,
        msg: msg,
        tip: tip,
      });
    });
    it("status 404: user does not exist", async () => {
      const { msg, tip, status: errStatus } = ERR_MSGS.DOES_NOT_EXIST;
      const input = { username: "hunter2", body: "<insert inside joke>" };
      const { body, status } = await request(app)
        .post("/api/articles/1/comments")
        .send(input);
      expect(status).toEqual(errStatus);
      expect(body).toEqual({
        status: errStatus,
        msg: msg,
        tip: tip,
      });
    });
    it("status 404: article does not exist", async () => {
      const { msg, tip, status: errStatus } = ERR_MSGS.DOES_NOT_EXIST;
      const input = { username: "lurker", body: "<insert inside joke>" };
      const { body, status } = await request(app)
        .post("/api/articles/9001/comments")
        .send(input);
      expect(status).toEqual(errStatus);
      expect(body).toEqual({
        status: errStatus,
        msg: msg,
        tip: tip,
      });
    });
    it("status 404: invalid username (sql injection)", async () => {
      const { msg, tip, status: errStatus } = ERR_MSGS.DOES_NOT_EXIST;
      const input = {
        username: "1); SELECT * FROM users",
        body: "<insert inside joke>",
      };
      const { body, status } = await request(app)
        .post("/api/articles/1/comments")
        .send(input);
      expect(status).toEqual(errStatus);
      expect(body).toEqual({
        status: errStatus,
        msg: msg,
        tip: tip,
      });
    });
  });
});
