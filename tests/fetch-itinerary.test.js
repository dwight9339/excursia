import { MongoClient } from "mongodb";
import handler from "../pages/api/fetch-itinerary";

jest.mock("mongodb", () => {
  const mCollection = {
    findOne: jest.fn(),
  };
  const mDb = {
    collection: jest.fn(() => mCollection),
  };
  const mClient = {
    db: jest.fn(() => mDb),
    close: jest.fn(),
  };
  const mObjectId = jest.fn((v) => ({ value: v }));
  function MongoClient() {
    return mClient;
  }
  MongoClient.connect = jest.fn().mockResolvedValue(mClient);

  return { MongoClient, ObjectId: mObjectId };
});

describe("/api/fetch-itinerary", () => {
  let req, res;

  beforeEach(() => {
    req = {
      method: "",
      query: {},
    };
    res = {
      status: jest.fn(() => res),
      json: jest.fn(() => res),
      setHeader: jest.fn(),
      end: jest.fn(),
    };
  });

  it("returns 405 if the request method is not GET", async () => {
    req.method = "POST";

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.json).toHaveBeenCalledWith({ message: "Method not allowed" });
  });

  it("returns the itinerary if the database operation is successful", async () => {
    req.method = "GET";
    req.query = { id: "existingItineraryId" };
    const mClient = new MongoClient();
    const mockItinerary = { _id: "existingItineraryId", ownerId: "userId", name: "Itinerary 1" };
    mClient.db().collection().findOne.mockResolvedValueOnce(mockItinerary);
  
    await handler(req, res);
  
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      id: "existingItineraryId",
      ownerId: "userId",
      name: "Itinerary 1",
    });
  });

  it("returns 404 if the itinerary is not found", async () => {
    req.method = "GET";
    req.query = { id: "nonExistingItineraryId" };
    const mClient = new MongoClient();
    mClient.db().collection().findOne.mockResolvedValueOnce(null);
  
    await handler(req, res);
  
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Itinerary not found" });
  });  
  
  it("returns 500 if there's an error during the database operation", async () => {
    req.method = "GET";
    req.query = { id: "existingItineraryId" };
    const mClient = new MongoClient();
    mClient.db().collection().findOne.mockRejectedValueOnce(() => {
      throw new Error("Database error")
    });
  
    await handler(req, res);
  
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Unable to fetch itinerary" });
  });
});