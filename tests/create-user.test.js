import { MongoClient } from "mongodb";
import bcrypt from 'bcrypt';
import handler from '../pages/api/create-user';

// Mock the MongoDB client
jest.mock("mongodb", () => {
  // Mock the MongoDB client
  const mCollection = {
    findOne: jest.fn(),
    insertOne: jest.fn(),
  };
  const mDb = {
    collection: jest.fn(() => mCollection),
  };
  const mClient = {
    connect: jest.fn(),
    db: jest.fn(() => mDb),
    close: jest.fn(),
  };

  return { MongoClient: jest.fn(() => mClient) };
});

// Mock bcrypt
jest.mock('bcrypt', () => ({
  genSalt: jest.fn(() => 'randomSalt'),
  hash: jest.fn(() => 'hashedPassword'),
}));

describe("/api/create-user", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      method: 'POST',
    };
    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
      setHeader: jest.fn(),
      end: jest.fn(),
    };
  });

  it("returns 201 and user id if the user is created", async () => {
    req.body = { firstName: "John", lastName: "Doe", email: "john@example.com", password: "password" };
    const mClient = new MongoClient();
    mClient.db().collection().findOne.mockResolvedValueOnce(null);
    mClient.db().collection().insertOne.mockResolvedValueOnce({ insertedId: 'newUserId' });

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ user_id: "newUserId" });
  });

  it("returns 409 if the user already exists", async () => {
    req.body = { firstName: 'John', lastName: 'Doe', email: 'john@example.com', password: 'password' };
    const mClient = new MongoClient();
    mClient.db().collection().findOne.mockResolvedValueOnce(true);
  
    await handler(req, res);
  
    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({ message: 'Email already exists' });
  });

  it("returns 500 if there's an error during the user creation process", async () => {
    req.body = { firstName: "John", lastName: "Doe", email: "john@example.com", password: "password" };
    const mClient = new MongoClient();
    mClient.db().collection().findOne.mockRejectedValueOnce(new Error("Database error"));
  
    await handler(req, res);
  
    expect(res.status).toHaveBeenCalledWith(500);
  });
  
  it("returns 405 if the request method is not POST", async () => {
    req.method = "GET";
  
    await handler(req, res);
  
    expect(res.status).toHaveBeenCalledWith(405);
  });
  
});
