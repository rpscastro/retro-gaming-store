const productsController = require("../controllers/products");
const mongodb = require("../data/database");

jest.mock("../data/database");

describe("productsController.getAllProducts", () => {
  it("responds with a list of products and status 200", async () => {
    const products = [
      { _id: "1", name: "Product 1", price: 19.99 },
      { _id: "2", name: "Product 2", price: 29.99 },
    ];

    const toArray = jest.fn().mockResolvedValue(products);
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

    await productsController.getAllProducts({}, res);

    expect(res.setHeader).toHaveBeenCalledWith(
      "Content-Type",
      "application/json",
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(products);
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

    await productsController.getAllProducts({}, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: error.message });
  });
});

describe("productsController.getProductById", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 400 when id is invalid", async () => {
    const req = { params: { id: "invalid-id" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await productsController.getProductById(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      "Must use a valid product id to find a product.",
    );
  });

  it("returns 404 when the product is not found", async () => {
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

    await productsController.getProductById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Product not found." });
  });

  it("returns 200 and the product when found", async () => {
    const product = {
      _id: "507f1f77bcf86cd799439011",
      name: "Product 1",
      price: 19.99,
    };
    const req = { params: { id: "507f1f77bcf86cd799439011" } };
    mongodb.getDatabase.mockReturnValue({
      db: () => ({
        collection: () => ({
          findOne: jest.fn().mockResolvedValue(product),
        }),
      }),
    });

    const res = {
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await productsController.getProductById(req, res);

    expect(res.setHeader).toHaveBeenCalledWith(
      "Content-Type",
      "application/json",
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(product);
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

    await productsController.getProductById(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: error.message });
  });
});
