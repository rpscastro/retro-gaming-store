const summaryController = require("../controllers/summary");
const mongodb = require("../data/database");

jest.mock("../data/database");

describe("summaryController.getAllSummaries", () => {
  it("responds with a list of summaries and status 200", async () => {
    const summaries = [
      {
        _id: "1",
        salesYear: 2026,
        salesMonth: 1,
        totalUnitsSold: 1200,
        totalSalesCount: 850,
        totalSalesAmount: 45200.75,
        totalExpensesAmount: 18750.4,
      },
      {
        _id: "2",
        salesYear: 2026,
        salesMonth: 2,
        totalUnitsSold: 1500,
        totalSalesCount: 1000,
        totalSalesAmount: 55000.0,
        totalExpensesAmount: 22500.0,
      },
    ];

    const toArray = jest.fn().mockResolvedValue(summaries);
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

    await summaryController.getAllSummaries({}, res);

    expect(res.setHeader).toHaveBeenCalledWith(
      "Content-Type",
      "application/json",
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(summaries);
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

    await summaryController.getAllSummaries({}, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: error.message });
  });
});

describe("summaryController.getSummaryById", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 400 when id is invalid", async () => {
    const req = { params: { id: "invalid-id" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await summaryController.getSummaryById(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      "Must use a valid summary id to find a summary.",
    );
  });

  it("returns 404 when the summary is not found", async () => {
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

    await summaryController.getSummaryById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "Summary not found." });
  });

  it("returns 200 and the summary when found", async () => {
    const summary = {
      _id: "507f1f77bcf86cd799439011",
      salesYear: 2026,
      salesMonth: 1,
      totalUnitsSold: 1200,
      totalSalesCount: 850,
      totalSalesAmount: 45200.75,
      totalExpensesAmount: 18750.4,
    };
    const req = { params: { id: "507f1f77bcf86cd799439011" } };
    mongodb.getDatabase.mockReturnValue({
      db: () => ({
        collection: () => ({
          findOne: jest.fn().mockResolvedValue(summary),
        }),
      }),
    });

    const res = {
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await summaryController.getSummaryById(req, res);

    expect(res.setHeader).toHaveBeenCalledWith(
      "Content-Type",
      "application/json",
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(summary);
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

    await summaryController.getSummaryById(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: error.message });
  });
});
