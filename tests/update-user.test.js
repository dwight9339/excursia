import { MongoClient, ObjectId } from "mongodb";
import handler from "../pages/api/update-user";

jest.mock("mongodb", () => {
  const mCollection = {
    findOne: jest.fn(),
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
  const ObjectId = jest.fn((id) => id);

  return { MongoClient, ObjectId };
});

describe("/api/update-user", () => {
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

  it("updates an existing user", async () => {
    req.method = "POST";
    req.body = { userId: "existingUserId", userInfo: { name: "John Doe" } };
    const mClient = new MongoClient();
    const mockUser = { _id: "existingUserId", name: "Jane Doe" };
    mClient.db().collection().findOne.mockResolvedValueOnce(mockUser);
    mClient.db().collection().updateOne.mockResolvedValueOnce({});

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "User updated" });
  });

  it("returns 404 if the user does not exist", async () => {
    req.method = "POST";
    req.body = { userId: "nonExistingUserId", userInfo: { name: "John Doe" } };
    const mClient = new MongoClient();
    mClient.db().collection().findOne.mockResolvedValueOnce(null);

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
  });
});
