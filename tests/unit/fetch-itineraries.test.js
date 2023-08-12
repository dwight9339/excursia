import { MongoClient } from "mongodb";
import handler from "../../pages/api/fetch-itineraries";

jest.mock("mongodb", () => {
  const mCollection = {
    find: jest.fn(),
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

describe("/api/fetch-itineraries", () => {
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
    expect(res.end).toHaveBeenCalledWith("Method POST Not Allowed");
  });

  it("returns itineraries if the database operation is successful", async () => {
    req.method = "GET";
    req.query = { user_id: "existingUserId" };
    const mClient = new MongoClient();
    const mockItineraries = [
      { _id: "1", ownerId: "existingUserId", name: "Itinerary 1" },
      { _id: "2", ownerId: "existingUserId", name: "Itinerary 2" },
    ];
    mClient.db().collection().find.mockReturnValueOnce({
      toArray: jest.fn().mockResolvedValueOnce(mockItineraries),
    });
  
    await handler(req, res);
  
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      itineraries: [
        { id: "1", ownerId: "existingUserId", name: "Itinerary 1" },
        { id: "2", ownerId: "existingUserId", name: "Itinerary 2" },
      ],
    });
  });
  
  it("returns 400 if the user_id query parameter is missing", async () => {
    req.method = "GET";
  
    await handler(req, res);
  
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it("returns 500 if there's an error during the database operation", async () => {
    req.method = "GET";
    req.query = { user_id: "existingUserId" };
    const mClient = new MongoClient();
    mClient.db().collection().find.mockReturnValueOnce({
      toArray: jest.fn().mockRejectedValueOnce(new Error("Database error")),
    });
  
    await handler(req, res);
  
    expect(res.status).toHaveBeenCalledWith(500);
  });
  
});