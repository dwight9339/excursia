import { MongoClient } from "mongodb";
import bcrypt from 'bcrypt';
import handler from '../../pages/api/delete-itinerary';

// Mock the MongoDB client
jest.mock("mongodb", () => {
  // Mock the MongoDB client
  const mCollection = {
    findOne: jest.fn(),
    insertOne: jest.fn(),
    deleteOne: jest.fn()
  };
  const mDb = {
    collection: jest.fn(() => mCollection),
  };
  const mClient = {
    connect: jest.fn(),
    db: jest.fn(() => mDb),
    close: jest.fn(),
  };
  const mObjectId = jest.fn((v) => ({ value: v }));

  return { MongoClient: jest.fn(() => mClient), ObjectId: mObjectId };
});

// Mock bcrypt
jest.mock('bcrypt', () => ({
  genSalt: jest.fn(() => 'randomSalt'),
  hash: jest.fn(() => 'hashedPassword'),
}));

describe("/api/delete-itinerary", () => {
  let req, res;

  beforeEach(() => {
    req = {
      query: { itineraryId: "123" },
      method: "DELETE",
    };
    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
      setHeader: jest.fn(),
      end: jest.fn(),
    };
  });

  it("deletes an itinerary and returns 200 if the itinerary exists", async () => {
    const mClient = new MongoClient();
    mClient.db().collection().findOne.mockResolvedValueOnce({ _id: "123" });
    mClient.db().collection().deleteOne.mockResolvedValueOnce({ deletedCount: 1 });
  
    try {
      await handler(req, res);
    } catch (error) {
      console.error(error);
    }
  
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true });
  });

  it("returns 500 if there's an error during the itinerary deletion process", async () => {
    req.method = "DELETE";
    req.query = { itineraryId: "existingItineraryId" };
    const mClient = new MongoClient();
    mClient.db().collection().findOne.mockResolvedValueOnce({ _id: "existingItineraryId" });
    mClient.db().collection().deleteOne.mockRejectedValueOnce(new Error("Database error"));
  
    try {
      await handler(req, res);
    } catch (error) {
      console.error(error);
    }
  
    expect(res.status).toHaveBeenCalledWith(500);
  });
  
  it("returns 405 if the request method is not DELETE", async () => {
    req.method = "GET";
  
    await handler(req, res);
  
    expect(res.status).toHaveBeenCalledWith(405);
  });
  
});
