require("dotenv").config();

const { Pool } = require("pg");
const supertest = require("supertest");
const sequelize = require("../src/utils/database");

const app = require("../src/app");

const agent = supertest(app);
const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});

let genreIdTest;
let recommendationIdTest;

beforeAll(async () => {
    await db.query("DELETE FROM genre_recommend;");
    await db.query("DELETE FROM genres;");
    await db.query("DELETE FROM recommendations;");
});
  
afterAll(async () => {
    await db.end();
    await sequelize.close();
});

describe("POST /genres", () => {
    it("Should return 422 if there is no name", async () => {
        const body = { name: ""};

        const response = await agent.post("/genres").send(body);

        expect(response.status).toBe(422);
    });

    it("Should return 422 if there is invalid characters", async () => {
        const body = { name: "<Brega"};

        const response = await agent.post("/genres").send(body);

        expect(response.status).toBe(422);
    });

    it("Should return 201 and create genre correctly", async () => {
        const body = { name: "Brega Funk"};

        const response = await agent.post("/genres").send(body);

        expect(response.status).toBe(201);
        expect(response.body).toEqual(
            expect.objectContaining({
                id: response.body.id, 
                name: "Brega Funk"
            })
        );
        genreIdTest = response.body.id;
    });
})

describe("GET /genres", () => {
    it("Should return 200 and all genres", async () => {
        const response = await agent.get("/genres");

        expect(response.status).toBe(200);
        expect(response.body).toEqual(
            expect.arrayContaining([
                { 
                    id: response.body[0].id, 
                    name: "Brega Funk"
                }
            ])
        );
    });
})

describe("POST /recommendations", () => {
    it("Should return 422 if there any element empty", async () => {
        const body = { 
            name: "", 
            genresIds: [genreIdTest],
            youtubeLink: "https://www.youtube.com/"
        };
        const response = await agent.post("/recommendations").send(body);

        expect(response.status).toBe(422);
    });

    it("Should return 406 if the genresIds are invalid", async () => {
        const body = { 
            name: "musica", 
            genresIds: [0],
            youtubeLink: "https://www.youtube.com/"
        };
        const response = await agent.post("/recommendations").send(body);

        expect(response.status).toBe(406);
    });

    it("Should return 201 if create recommendation", async () => {
        const body = { 
            name: "musica", 
            genresIds: [genreIdTest],
            youtubeLink: "https://www.youtube.com/"
        };
        const response = await agent.post("/recommendations").send(body);

        expect(response.status).toBe(201);
        expect(response.body).toEqual(
            expect.objectContaining({
                id: response.body.id, 
                name: "musica", 
                score: 0, 
                url: "https://www.youtube.com/"
            })
        );
        recommendationIdTest = response.body.id;
    });

    it("Should return 200 if recommendation alredy exist", async () => {
        const body = { 
            name: "musica", 
            genresIds: [genreIdTest],
            youtubeLink: "https://www.youtube.com/"
        };
        const response = await agent.post("/recommendations").send(body);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(
            expect.objectContaining({
                id: response.body.id, 
                name: "musica", 
                score: 0, 
                url: "https://www.youtube.com/",
                genres: [{ 
                    id: genreIdTest, 
                    name: "Brega Funk"
                }]
            })
        );
    });
})

describe("GET /recommendations/random", () => {
    it("Should return 200 if create recommendation", async () => {
        const response = await agent.get("/recommendations/random");

        expect(response.status).toBe(200);
        expect(response.body).toEqual(
            expect.objectContaining({
                id: response.body.id, 
                name: "musica", 
                score: 0, 
                url: "https://www.youtube.com/",
                genres: [{ 
                    id: genreIdTest, 
                    name: "Brega Funk"
                }]
            })
        );
    });
});

describe("GET /recommendations/genres/:id/random", () => {
    it("Should return 404 id in params is invalid", async () => {
        const response = await agent.get(`/recommendations/genres/${0}/random`);

        expect(response.status).toBe(404);
    });

    it("Should return 200 if create recommendation", async () => {
        const response = await agent.get(`/recommendations/genres/${genreIdTest}/random`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(
            expect.objectContaining({
                id: response.body.id, 
                name: "musica", 
                score: 0, 
                url: "https://www.youtube.com/",
                genres: [{ 
                    id: genreIdTest, 
                    name: "Brega Funk"
                }]
            })
        );
    });
});

describe("POST /recommendations/:id/upvote", () => {
    it("Should return 404 id in params is invalid", async () => {
        const response = await agent.post(`/recommendations/${0}/upvote`);

        expect(response.status).toBe(404);
    });

    it("Should return 201 if add a vote", async () => {
        const response = await agent.post(`/recommendations/${recommendationIdTest}/upvote`);

        expect(response.status).toBe(201);
        expect(response.body).toEqual(
            expect.objectContaining({
                id: response.body.id, 
                name: "musica", 
                score: 1, 
                url: "https://www.youtube.com/",
                genres: [{ 
                    id: genreIdTest, 
                    name: "Brega Funk"
                }]
            })
        );
    });
});

describe("POST /recommendations/:id/downvote", () => {
    it("Should return 404 id in params is invalid", async () => {
        const response = await agent.post(`/recommendations/${0}/upvote`);

        expect(response.status).toBe(404);
    });

    it("Should return 201 if down a vote", async () => {
        const response = await agent.post(`/recommendations/${recommendationIdTest}/downvote`);

        expect(response.status).toBe(201);
        expect(response.body).toEqual(
            expect.objectContaining({
                id: response.body.id, 
                name: "musica", 
                score: 0, 
                url: "https://www.youtube.com/",
                genres: [{ 
                    id: genreIdTest, 
                    name: "Brega Funk"
                }]
            })
        );
    });

    it("Should return 200 if delete recommendation", async () => {
        const queryResult = await db.query(`
            UPDATE recommendations 
            SET score = -5
        `);
        const response = await agent.post(`/recommendations/${recommendationIdTest}/downvote`);

        expect(response.status).toBe(200);
    });
});

describe("GET /recommendations/top/:amount", () => {
    it("Should return 404 if empty recommends", async () => {
        const response = await agent.get(`/recommendations/top/${1}`);

        expect(response.status).toBe(404);
    });

    it("Should return 200 if recive in corect quantity and order", async () => {
        const recommendTest = await db.query(`
            INSERT INTO recommendations (name, url, score) 
            VALUES ('Music1', 'https://www.youtube.com/', 5 ), ('Music2', 'https://www.youtube.cm', 10) 
            RETURNING *;
        `);
        const genresTest = await db.query(`
            INSERT INTO genres (name) 
            VALUES ('Lofi') 
            RETURNING *;
        `);
        await db.query(`
            INSERT INTO genre_recommend ("genreId", "recommendationId") 
            VALUES (${genresTest.rows[0].id}, ${recommendTest.rows[0].id}), (${genresTest.rows[0].id}, ${recommendTest.rows[1].id});
        `);

        const response = await agent.get(`/recommendations/top/${2}`);
        expect(response.status).toBe(200);
        expect(response.body).toEqual(
            expect.arrayContaining([
                {
                    id: recommendTest.rows[1].id, 
                    name: "Music2", 
                    score: 10, 
                    url: "https://www.youtube.cm",
                    genres: [{ 
                        id: genresTest.rows[0].id, 
                        name: "Lofi"
                    }]
                },
                {
                    id: recommendTest.rows[0].id, 
                    name: "Music1", 
                    score: 5, 
                    url: "https://www.youtube.com/",
                    genres: [{ 
                        id: genresTest.rows[0].id, 
                        name: "Lofi"
                    }]
                }
            ])
        );
        genreIdTest = genresTest.rows[0].id;
    })   
});

describe("GET /genres/:id", () => {
    it("Should return 404 if wrong id", async () => {
        const response = await agent.get(`/genres/${0}`);

        expect(response.status).toBe(404);
    });

    it("Should return 200 if recive corectly", async () => {
        const response = await agent.get(`/genres/${genreIdTest}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(
            expect.objectContaining({
                score: 15,
                id: genreIdTest,
                name: "Lofi",
                recommendations:[
                    {
                        id: response.body.recommendations[0].id, 
                        name: "Music1", 
                        score: 5, 
                        url: "https://www.youtube.com/",
                        genres: [{ 
                            id: genreIdTest, 
                            name: "Lofi"
                        }]
                    },
                    {
                        id: response.body.recommendations[1].id, 
                        name: "Music2", 
                        score: 10, 
                        url: "https://www.youtube.cm",
                        genres: [{ 
                            id: genreIdTest, 
                            name: "Lofi"
                        }]
                    }
                ]
            })
        );
    });
});