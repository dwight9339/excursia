import { MongoClient, ObjectId } from "mongodb";
import handler from "../../pages/api/save-itinerary";

jest.mock("mongodb", () => {
  const mCollection = {
    findOne: jest.fn(),
    insertOne: jest.fn(),
    updateOne: jest.fn(),
  };
  const mDb = {
    collection: jest.fn(() => mCollection),
  };
  const mClient = {
    connect: jest.fn(),
    db: jest.fn(() => mDb),
    close: jest.fn(),
  };
  function MongoClient() {
    return mClient;
  }
  MongoClient.connect = jest.fn().mockResolvedValue(mClient);
  const mObjectId = jest.fn((v) => ({ value: v }));

  return { MongoClient, ObjectId: mObjectId };
});

jest.mock("../../lib/suggestions", () => ({
  fetchSuggestions: jest.fn(),
}));

describe("/api/save-itinerary", () => {
  const testItinerary = {
    id: "existingItineraryId",
    name: "Test Itinerary",
    startingLocation: { lat: 38.764972, lng: -95.889472 },
    startingAddress: "New York City Hall, New York, NY, USA",
    interests: ["museums", "parks"],
    searchRadius: 16093.4,
    activities: [
      {
        name: 'Test Activity 1',
        allottedTime: 60,
        place: {
          place_id: '123',
          geometry: {
            location: {
              lat: 0,
              lng: 0,
            },
          },
          icon: "https://maps.gstatic.com/mapfiles/place_api/icons/v1/png_71/museum-71.png",
        },
      },
      {
        name: 'Test Activity 2',
        allottedTime: 120,
        description: 'Test Description',
        location: {
          lat: 0,
          lng: 0,
        },
      }
    ],
    suggestions: [
      { name: 'Suggestion 1', place_id: '1', icon: 'http://testdomain.com/icon1' },
      { name: 'Suggestion 2', place_id: '2', icon: 'http://testdomain.com/icon2' }
    ],
    createdDate: new Date().toISOString(),
    ownerId: "1234567890"
  };
  let req, res;

  beforeEach(() => {
    req = {
      method: "",
      body: {},
    };
    res = {
      status: jest.fn(() => res),
      json: jest.fn(() => res),
      setHeader: jest.fn(),
      end: jest.fn(),
    };
  });

  it("returns 405 if the request method is not POST", async () => {
    req.method = "GET";

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.end).toHaveBeenCalledWith(`Method ${req.method} Not Allowed`);
  });

  it("inserts a new itinerary if it does not exist", async () => {
    req.method = "POST";
    req.body = testItinerary;
    const mClient = new MongoClient();
    mClient.db().collection().findOne.mockResolvedValueOnce(null);
    mClient.db().collection().insertOne.mockResolvedValueOnce({ insertedId: "newItineraryId" });

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ itinerary_id: "newItineraryId" });
  });

  it("updates an existing itinerary if it exists", async () => {
    req.method = "POST";
    req.body = testItinerary;
    const mClient = new MongoClient();
    mClient.db().collection().findOne.mockResolvedValueOnce(testItinerary);
    mClient.db().collection().updateOne.mockResolvedValueOnce({});

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ itinerary_id: "existingItineraryId" });
  });

  it("returns 500 if there's an error during the save operation", async () => {
    req.method = "POST";
    req.body = { id: "newItineraryId" };
    const mClient = new MongoClient();
    mClient.db().collection().findOne.mockResolvedValueOnce(null);
    mClient.db().collection().insertOne.mockRejectedValueOnce(new Error("Database error"));
  
    await handler(req, res);
  
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Error saving itinerary" });
  });
});
