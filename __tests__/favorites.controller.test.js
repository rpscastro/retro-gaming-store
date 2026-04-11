const favoritesController = require("../controllers/favorites");
const mongodb = require("../data/database");

jest.mock("../data/database");

describe("favoritesController.getAllFavorites", () => {
  it("responds with a list of favorites and status 200", async () => {
    const favorites = [
      { _id: "1", userId: "u1", productId: "p1" },
      { _id: "2", userId: "u2", productId: "p2" },
    ];

    const toArray = jest.fn().mockResolvedValue(favorites);
    mongodb.getDatabase.mockReturnValue({
      db: () => ({
        collection: () => ({
          find: () => ({ toArray }),
        }),
      }),
    });

    const res = {
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await favoritesController.getAllFavorites({}, res);

    expect(res.setHeader).toHaveBeenCalledWith(
      "Content-Type",
      "application/json",
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(favorites);
  });

  it("returns 500 when the database throws", async () => {
    const error = new Error("DB failure");
    mongodb.getDatabase.mockImplementation(() => {
      throw error;
    });

    const res = {
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await favoritesController.getAllFavorites({}, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: error.message });
  });
});

describe("favoritesController.getFavoriteById", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 400 when id is invalid", async () => {
    const req = { params: { id: "invalid-id" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await favoritesController.getFavoriteById(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      "Must use a valid favorite id to find a favorite.",
    );
  });

  it("returns 404 when the favorite is not found", async () => {
    const req = { params: { id: "507f1f77bcf86cd799439011" } };
    mongodb.getDatabase.mockReturnValue({
      db: () => ({
        collection: () => ({
          findOne: jest.fn().mockResolvedValue(null),
        }),
      }),
    });

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await favoritesController.getFavoriteById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Favorite not found." });
  });

  it("returns 200 and the favorite when found", async () => {
    const favorite = {
      _id: "507f1f77bcf86cd799439011",
      userId: "u1",
      productId: "p1",
    };
    const req = { params: { id: "507f1f77bcf86cd799439011" } };
    mongodb.getDatabase.mockReturnValue({
      db: () => ({
        collection: () => ({
          findOne: jest.fn().mockResolvedValue(favorite),
        }),
      }),
    });

    const res = {
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await favoritesController.getFavoriteById(req, res);

    expect(res.setHeader).toHaveBeenCalledWith(
      "Content-Type",
      "application/json",
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(favorite);
  });

  it("returns 500 when the database throws", async () => {
    const req = { params: { id: "507f1f77bcf86cd799439011" } };
    const error = new Error("DB failure");
    mongodb.getDatabase.mockImplementation(() => {
      throw error;
    });

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await favoritesController.getFavoriteById(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: error.message });
  });
});
