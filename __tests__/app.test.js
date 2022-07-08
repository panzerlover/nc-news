const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index.js");
const db = require("../db/connection.js");
const request = require("supertest");
const app = require("../api/app.js");
const { dropTables } = require("../db/helpers/manage-tables");
const ERR_MSGS = require("../api/utils/enum-errors");
const endpoints = require("../endpoints.json");

beforeEach(() => seed(testData));

afterAll(() => db.end());

describe("express app", () => {
  describe("bad path", () => {
    it("should return 404 for invalid paths", async () => {
      const {
        body: { msg },
        status,
      } = await request(app).get("/api/banana");
      expect(status).toBe(404);
      expect(msg).toBe("Path Not Found :(");
    });
  });
  describe("topics", () => {
    describe("GET /api/topics", () => {
      it("status: 200 with slug and description properties", async () => {
        const {
          body: { topics },
          status,
        } = await request(app).get("/api/topics");
        expect(status).toBe(200);
        topics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
      it("status 500: when table or db does not exist", async () => {
        await dropTables();
        const { msg, tip, status: errStatus } = ERR_MSGS.PG["42P01"];
        const { body, status } = await request(app).get("/api/topics");
        expect(status).toBe(errStatus);
        expect(body).toEqual({
          msg: msg,
          tip: tip,
        });
      });
    });
  });
  describe("articles", () => {
    describe("GET /api/articles/:article_id", () => {
      it("status: 200 with correct properties", async () => {
        const output = {
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          comment_count: 11,
        }
        const {
          body: { article },
          status,
        } = await request(app).get("/api/articles/1");
        expect(status).toBe(200);
        expect(article).toEqual(output);
      });
      it("should return 400 when given article_id that is not a number ", async () => {
        const { msg, tip, status: errStatus } = ERR_MSGS.PG["22P02"];
        const { body, status } = await request(app).get(
          "/api/articles/1; SELECT * FROM users"
        );
        expect(status).toBe(errStatus);
        expect(body).toEqual({
          msg: msg,
          tip: tip,
        });
      });
      it("should return 404 when article id does not exist", async () => {
        const { msg, tip, status: errStatus } = ERR_MSGS.DOES_NOT_EXIST;
        const { body, status } = await request(app).get("/api/articles/9001");
        expect(status).toBe(errStatus);
        expect(body).toEqual({
          msg: msg,
          tip: tip,
        });
      });
    });
    describe("PATCH /api/articles/:article_id", () => {
      it("status 200: with updated article votes when votes is positive", async () => {
        const input = { inc_votes: 40 };
        const output = {
          article_id: 4,
          title: "Student SUES Mitch!",
          topic: "mitch",
          author: "rogersop",
          body: "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
          created_at: "2020-05-06T01:14:00.000Z",
          votes: 40,
        }
        const {
          body: { article },
          status,
        } = await request(app).patch("/api/articles/4").send(input);
        expect(status).toBe(201);
        expect(article).toEqual(output);
      });
      it("status 200: with updated article votes when votes is negative", async () => {
        const input = { inc_votes: -400 };
        const output = {
          article_id: 4,
          title: "Student SUES Mitch!",
          topic: "mitch",
          author: "rogersop",
          body: "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
          created_at: "2020-05-06T01:14:00.000Z",
          votes: -400,
        }
        const {
          body: { article },
          status,
        } = await request(app).patch("/api/articles/4").send(input);
        expect(status).toBe(201);
        expect(article).toEqual(output);
      });
      it("status 400: missing vote body", async () => {
        const { msg, tip, status: errStatus } = ERR_MSGS.PG["23502"];
        const { body, status } = await request(app).patch("/api/articles/4");
        expect(status).toBe(errStatus);
        expect(body).toEqual({
          msg: msg,
          tip: tip,
        });
      });
      it("status 400: vote is wrong data type", async () => {
        const input = { inc_votes: "1; SELECT * FROM users;" };
        const { msg, tip, status: errStatus } = ERR_MSGS.PG["22P02"];
        const { body, status } = await request(app)
          .patch("/api/articles/1")
          .send(input);
        expect(status).toBe(errStatus);
        expect(body).toEqual({
          msg: msg,
          tip: tip,
        });
      });
      it("status 400: invalid article_id data type", async () => {
        const input = { inc_votes: 10 };
        const { msg, tip, status: errStatus } = ERR_MSGS.PG["22P02"];
        const { body, status } = await request(app)
          .patch("/api/articles/banana")
          .send(input);
        expect(status).toBe(errStatus);
        expect(body).toEqual({
          msg: msg,
          tip: tip,
        });
      });
      it("status 404: article does not exist", async () => {
        const input = { inc_votes: 10 };
        const { msg, tip, status: errStatus } = ERR_MSGS.DOES_NOT_EXIST;
        const { body, status } = await request(app)
          .patch("/api/articles/9001")
          .send(input);
        expect(status).toBe(errStatus);
        expect(body).toEqual({
          msg: msg,
          tip: tip,
        });
      });
    });
    describe("GET /api/articles", () => {
      it("status 200: with array of articles", async () => {
        const {
          body: { articles },
          status,
        } = await request(app).get("/api/articles");
        expect(status).toBe(200);
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
          status,
        } = await request(app).get("/api/articles");
        expect(status).toBe(200);
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
          const column = columns[i];
          const input = { sort_by: column };
          const {
            body: { articles },
            status,
          } = await request(app).get("/api/articles").query(input);
          expect(status).toBe(200);
          expect(articles).toBeSortedBy(column, {
            descending: true,
            coerce: true,
          });
        }
      });
      it("status 200: accepts ascending order query", async () => {
        const input = { order: "asc" };
        const {
          body: { articles },
          status,
        } = await request(app).get("/api/articles").query(input);
        expect(status).toBe(200);
        expect(articles).toBeSortedBy("created_at", { ascending: true });
      });
      it("status 200: accepts sort_by AND order query", async () => {
        const input = { sort_by: "title", order: "asc" };
        const {
          body: { articles },
          status,
        } = await request(app).get("/api/articles").query(input);
        expect(status).toBe(200);
        expect(articles).toBeSortedBy("created_at", {
          ascending: true,
          coerce: true,
        });
      });
      it("status 200: accepts topic query", async () => {
        const input = { topic: "mitch" };
        const {
          body: { articles },
          status,
        } = await request(app).get("/api/articles").query(input);
        expect(status).toBe(200);
        articles.forEach((article) => {
          expect(article.topic).toBe("mitch");
        });
      });
      it("status 200: accepts valid sort_by, order, and topic queries", async () => {
        const input = { sort_by: "title", order: "asc", topic: "mitch" };
        const {
          body: { articles },
          status,
        } = await request(app).get("/api/articles").query(input);
        expect(status).toBe(200);
        expect(articles).toBeSortedBy("created_at", {
          ascending: true,
          coerce: true,
        });
        articles.forEach((article) => {
          expect(article.topic).toBe("mitch");
        });
      });
      it('status 200: limits to 10 entries by default', async () => {
        const {
          body: { articles },
          status,
        } = await request(app).get("/api/articles").query();
        expect(status).toBe(200);
        expect(articles).toHaveLength(10);
      });
      it('status 200: returns first 10 entries by default', async () => {
        const input = {sort_by: "article_id", order: "asc"};
        const {
          body: { articles },
          status,
        } = await request(app).get("/api/articles").query(input)
        const last = articles[9];
        expect(status).toBe(200);
        expect(last.article_id).toBe(10);
      });
      it('status 200: accepts limit query', async () => {
        const input = {limit: 5}
        const {
          body: { articles },
          status,
        } = await request(app).get("/api/articles").query(input);
        expect(status).toBe(200);
        expect(articles).toHaveLength(input.limit);
      });
      it('status 200: accepts page query', async () => {
        const input = {p: 2}
        const {
          body: { articles },
          status,
        } = await request(app).get("/api/articles").query(input);
        expect(status).toBe(200);
        expect(articles).toHaveLength(2);
      });
      it('status 200: articles object has total_count, displaying, and page properties', async () => {
        const message = "showing results 1 to 10"
        const {
          body: { total_count, displaying, page },
          status,
        } = await request(app).get("/api/articles");
        expect(status).toBe(200);
        expect(total_count).toBe(12);
        expect(displaying).toBe(message);
        expect(page).toBe(1)
      });
      it("status 400: rejects invalid order", async () => {
        const input = { order: "desc; SELECT * FROM users" };
        const { msg, tip, status: errStatus } = ERR_MSGS.INVALID_QUERY;
        const { body, status } = await request(app)
          .get("/api/articles")
          .query(input);
        expect(status).toBe(errStatus);
        expect(body).toEqual({
          msg: msg,
          tip: tip,
        });
      });
      it("status 400: rejects invalid sort_by column", async () => {
        const input = { sort_by: "age; SELECT * FROM users" };
        const { msg, tip, status: errStatus } = ERR_MSGS.INVALID_QUERY;
        const { body, status } = await request(app)
          .get("/api/articles")
          .query(input);
        expect(status).toBe(errStatus);
        expect(body).toEqual({
          msg: msg,
          tip: tip,
        });
      });
      it('status 400: rejects invalid limit value', async () => {
        const input = { limit : "banana"};
        const {msg, tip, status: errStatus} = ERR_MSGS.PG["22P02"];
        const {body, status} = await request(app).get("/api/articles").query(input)
        expect(status).toEqual(errStatus)
        expect(body).toEqual({
          msg: msg,
          tip:tip
        })
      });
      it('status 400: rejects invalid p value', async () => {
        const input = { p: "banana"};
        const {msg, tip, status: errStatus} = ERR_MSGS.PG["22P02"];
        const {body, status} = await request(app).get("/api/articles").query(input)
        expect(status).toEqual(errStatus)
        expect(body).toEqual({
          msg: msg,
          tip:tip
        })
      });
      it("status 404: when topic does not exist", async () => {
        const input = {topic: "non-existent topic"}
        const { msg, tip, status: errStatus } = ERR_MSGS.DOES_NOT_EXIST;
        const { body, status } = await request(app)
          .get("/api/articles")
          .query(input);
        expect(status).toBe(errStatus);
        expect(body).toEqual({
          msg: msg,
          tip: tip,
        });
      });
      it("status 500: when table does not exist", async () => {
        await dropTables();
        const { msg, tip, status: errStatus } = ERR_MSGS.PG["42P01"];
        const { body, status } = await request(app).get("/api/articles");
        expect(status).toBe(errStatus);
        expect(body).toEqual({
          msg: msg,
          tip: tip,
        });
      });
    });
    describe("POST /api/articles", () => {
      it("status 201: with created article", async () => {
        const input = {
          author: "lurker",
          title: "AITA for never once brushing my teeth, ever?",
          body: "I literally never brush my teeth. As a result My breath could kill a small child or animal, and people have complained. Somebody pointed this out and made me feel bad. AITA for trying to get them fired?",
          topic: "mitch",
        };
        const {
          body: { article },
          status,
        } = await request(app).post("/api/articles").send(input);
        expect(status).toBe(201);
        expect(article).toEqual({
          article_id: 13,
          created_at: expect.any(String),
          votes: 0,
          ...input
        });
      });
      it("status 400: invalid username ", async () => {
        const input = {
          author: "banana",
          title: "AITA for never once brushing my teeth, ever?",
          body: "I literally never brush my teeth. As a result My breath could kill a small child or animal, and people have complained. Somebody pointed this out and made me feel bad. AITA for trying to get them fired?",
          topic: "mitch",
        };
        const { msg, tip, status: errStatus } = ERR_MSGS.PG["23503"];
        const { body, status } = await request(app)
          .post("/api/articles")
          .send(input);
        expect(status).toBe(errStatus);
        expect(body).toEqual({
          msg: msg,
          tip: tip,
        });
      });
      it("status 400: invalid topic", async () => {
        const input = {
          author: "lurker",
          title: "AITA for never once brushing my teeth, ever?",
          body: "I literally never brush my teeth. As a result My breath could kill a small child or animal, and people have complained. Somebody pointed this out and made me feel bad. AITA for trying to get them fired?",
          topic: "banana",
        };
        const { msg, tip, status: errStatus } = ERR_MSGS.PG["23503"];
        const { body, status } = await request(app)
          .post("/api/articles")
          .send(input);
        expect(status).toBe(errStatus);
        expect(body).toEqual({
          msg: msg,
          tip: tip,
        });
      });
      it("status 400: missing fields", async () => {
        const input = {
          author: "lurker",
          body: "I literally never brush my teeth. As a result My breath could kill a small child or animal, and people have complained. Somebody pointed this out and made me feel bad. AITA for trying to get them fired?",
          topic: "mitch",
        };
        const { msg, tip, status: errStatus } = ERR_MSGS.PG["23502"];
        const { body, status } = await request(app)
          .post("/api/articles")
          .send(input);
        expect(status).toBe(errStatus);
        expect(body).toEqual({
          msg: msg,
          tip: tip,
        });
      });
      it("status 400: no body", async () => {
        const { msg, tip, status: errStatus } = ERR_MSGS.PG["23502"];
        const { body, status } = await request(app).post("/api/articles");
        expect(status).toBe(errStatus);
        expect(body).toEqual({
          msg: msg,
          tip: tip,
        });
      });
      it("stats 500: table does not exist", async () => {
        await dropTables();
        const { msg, tip, status: errStatus } = ERR_MSGS.PG["42P01"];
        const { body, status } = await request(app).post("/api/articles");
        expect(status).toBe(errStatus);
        expect(body).toEqual({
          msg: msg,
          tip: tip,
        });
      });
    });
    describe("GET api/articles/:article_id/comments", () => {
      it("status 200: array of comments with only specified article id", async () => {
        const {
          body: { comments },
          status,
        } = await request(app).get("/api/articles/1/comments");
        expect(status).toBe(200);
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
        const { msg, tip, status: errStatus } = ERR_MSGS.DOES_NOT_EXIST;
        const { body, status } = await request(app).get(
          "/api/articles/9001/comments"
        );
        expect(status).toBe(errStatus);
        expect(body).toEqual({
          msg: msg,
          tip: tip,
        });
      });
      it("status 400: invalid article_id (invalid type)", async () => {
        const { msg, tip, status: errStatus } = ERR_MSGS.PG["22P02"];
        const { body, status } = await request(app).get(
          "/api/articles/1; SELECT * FROM users/comments"
        );
        expect(status).toEqual(errStatus);
        expect(body).toEqual({
          msg: msg,
          tip: tip,
        });
      });
      it("status 500: when table does not exist", async () => {
        await dropTables();
        const { msg, tip, status: errStatus } = ERR_MSGS.PG["42P01"];
        const { body, status } = await request(app).get(
          "/api/articles/1/comments"
        );
        expect(status).toBe(errStatus);
        expect(body).toEqual({
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
        expect(comment).toEqual({
            comment_id: 19,
            article_id: 1,
            votes: 0,
            created_at: expect.any(String),
            author: input.username,
            body: input.body
          });
      });
      it("status 400: when no request body", async () => {
        const { msg, tip, status: errStatus } = ERR_MSGS.PG["23502"];
        const { body, status } = await request(app).post(
          "/api/articles/1/comments"
        );
        expect(status).toEqual(errStatus);
        expect(body).toEqual({
          msg: msg,
          tip: tip,
        });
      });
      it("status 400: when missing username", async () => {
        const input = { body: "me REALLY no like" };
        const { msg, tip, status: errStatus } = ERR_MSGS.PG["23502"];
        const { body, status } = await request(app)
          .post("/api/articles/1/comments")
          .send(input);
        expect(status).toEqual(errStatus);
        expect(body).toEqual({
          msg: msg,
          tip: tip,
        });
      });
      it("status 400: when missing body", async () => {
        const input = { username: "lurker" };
        const { msg, tip, status: errStatus } = ERR_MSGS.PG["23502"];
        const { body, status } = await request(app)
          .post("/api/articles/1/comments")
          .send(input);
        expect(status).toEqual(errStatus);
        expect(body).toEqual({
          msg: msg,
          tip: tip,
        });
      });
      it("status 404: user does not exist", async () => {
        const input = { username: "hunter2", body: "<insert inside joke>" };
        const { msg, tip, status: errStatus } = ERR_MSGS.DOES_NOT_EXIST;
        const { body, status } = await request(app)
          .post("/api/articles/1/comments")
          .send(input);
        expect(status).toEqual(errStatus);
        expect(body).toEqual({
          msg: msg,
          tip: tip,
        });
      });
      it("status 404: article does not exist", async () => {
        const input = { username: "lurker", body: "<insert inside joke>" };
        const { msg, tip, status: errStatus } = ERR_MSGS.DOES_NOT_EXIST;
        const { body, status } = await request(app)
          .post("/api/articles/9001/comments")
          .send(input);
        expect(status).toEqual(errStatus);
        expect(body).toEqual({
          msg: msg,
          tip: tip,
        });
      });
      it("status 404: invalid username (sql injection)", async () => {
        const input = {
          username: "1); SELECT * FROM users",
          body: "<insert inside joke>",
        };
        const { msg, tip, status: errStatus } = ERR_MSGS.DOES_NOT_EXIST;
        const { body, status } = await request(app)
          .post("/api/articles/1/comments")
          .send(input);
        expect(status).toEqual(errStatus);
        expect(body).toEqual({
          msg: msg,
          tip: tip,
        });
      });
    });
  });
  describe("comments", () => {
    describe("DELETE /api/comments/:comment_id", () => {
      it("status 204: and no content when valid comment_id", async () => {
        const { body, status } = await request(app).delete("/api/comments/1");
        expect(status).toBe(204);
        expect(body).toEqual({});
      });
      it("status 400: invalid comment ", async () => {
        const { msg, tip, status: errStatus } = ERR_MSGS.PG["22P02"];
        const { body, status } = await request(app).delete(
          "/api/comments/1; SELECT * FROM users;"
        );
        expect(status).toBe(errStatus);
        expect(body).toEqual({ msg: msg, tip: tip });
      });
      it("status 404: comment does not exist", async () => {
        const { msg, tip, status: errStatus } = ERR_MSGS.DOES_NOT_EXIST;
        const { body, status } = await request(app).delete(
          "/api/comments/9001"
        );
        expect(status).toBe(errStatus);
        expect(body).toEqual({
          msg: msg,
          tip: tip,
        });
      });
    });
    describe("PATCH /api/comments/:comment_id", () => {
      it("status 201: with updated comment votes when votes is positive", async () => {
        const input = { inc_votes: 40 };
        const output = {
          body: " I carry a log — yes. Is it funny to you? It is not to me.",
          votes: -60,
          author: "icellusedkars",
          article_id: 1,
          comment_id: 4,
          created_at: "2020-02-23T12:01:00.000Z",
        }
        const {
          body: {
            comment: { votes },
          },
          body: { comment },
          status,
        } = await request(app).patch("/api/comments/4").send(input);
        expect(status).toBe(201);
        expect(comment).toEqual(output);
      });
      it("status 201: with updated comment votes when votes is negative", async () => {
        const input = { inc_votes: -400 };
        const output = {
          body: " I carry a log — yes. Is it funny to you? It is not to me.",
          votes: -500,
          author: "icellusedkars",
          article_id: 1,
          comment_id: 4,
          created_at: "2020-02-23T12:01:00.000Z",
        };
        const {
          body: { comment },
          status,
        } = await request(app).patch("/api/comments/4").send(input);
        expect(status).toBe(201);
        expect(comment).toEqual(output);
      });
      it("400: missing vote body", async () => {
        const { msg, tip, status: errStatus } = ERR_MSGS.PG["23502"];
        const { body, status } = await request(app).patch("/api/comments/4");
        expect(status).toBe(errStatus);
        expect(body).toEqual({
          msg: msg,
          tip: tip,
        });
      });
      it("400: vote is wrong data type", async () => {
        const input = { inc_votes: "1; SELECT * FROM users;" };
        const { msg, tip, status: errStatus } = ERR_MSGS.PG["22P02"];
        const { body, status } = await request(app)
          .patch("/api/comments/1")
          .send(input);
        expect(status).toBe(errStatus);
        expect(body).toEqual({
          msg: msg,
          tip: tip,
        });
      });
      it("400: invalid comment_id data type", async () => {
        const input = { inc_votes: 10 };
        const { msg, tip, status: errStatus } = ERR_MSGS.PG["22P02"];
        const { body, status } = await request(app)
          .patch("/api/comments/banana")
          .send(input);
        expect(status).toBe(errStatus);
        expect(body).toEqual({
          msg: msg,
          tip: tip,
        });
      });
      it("should return 404 custom error when valid comment id but comment does not exist", async () => {
        const input = { inc_votes: 10 };
        const { msg, tip, status: errStatus } = ERR_MSGS.DOES_NOT_EXIST;
        const { body, status } = await request(app)
          .patch("/api/comments/9001")
          .send(input);
        expect(status).toBe(errStatus);
        expect(body).toEqual({
          msg: msg,
          tip: tip,
        });
      });
    });
  });
  describe("users", () => {
    describe("GET /api/users", () => {
      it("status 200: with array of users", async () => {
        const {
          body: { users },
          status,
        } = await request(app).get("/api/users");
        expect(status).toBe(200);
        users.forEach((user)=> {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          )
        })
      });
      it("status 500: when table does not exist", async () => {
        await dropTables();
        const { msg, tip, status: errStatus } = ERR_MSGS.PG["42P01"];
        const { body, status } = await request(app).get("/api/users");
        expect(status).toBe(errStatus);
        expect(body).toEqual({
          msg: msg,
          tip: tip,
        });
      });
    });
    describe("GET /api/users/:username", () => {
      it("status 200: with specified user", async () => {
        const output = {
          username: "lurker",
          name: "do_nothing",
          avatar_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
        }
        const {
          body: { user },
          status,
        } = await request(app).get("/api/users/lurker");
        expect(status).toBe(200);
        expect(user).toEqual(output);
      });
      it("status 404: user does not exist", async () => {
        const { msg, tip, status: errStatus } = ERR_MSGS.DOES_NOT_EXIST;
        const { body, status } = await request(app).get(
          "/api/users/1; SELECT * FROM topics"
        );
        expect(status).toBe(errStatus);
        expect(body).toEqual({
          msg: msg,
          tip: tip,
        });
      });
      it("status 500: table does not exist", async () => {
        await dropTables();
        const { msg, tip, status: errStatus } = ERR_MSGS.PG["42P01"];
        const { body, status } = await request(app).get("/api/users/lurker");
        expect(status).toBe(errStatus);
        expect(body).toEqual({
          msg: msg,
          tip: tip,
        });
      });
    });
  });
  describe("endpoints", () => {
    describe("GET /api", () => {
      it("status 200: responds with array of endpoints", async () => {
        const {
          body: { endpoints: foundEndpoints },
        } = await request(app).get("/api");
        expect(foundEndpoints).toEqual(endpoints);
      });
    });
  });
});
