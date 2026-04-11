const usersController = require("../controllers/users");
const mongodb = require("../data/database");

jest.mock("../data/database");

describe("usersController.getAllUsers", () => {
  it("responds with a list of users and status 200", async () => {
    const users  = [
      {
        _id: "1",
        github_id: "maria_dev",
        email: "maria.oliveira@example.com",
        address: "456 Rua das Flores, Rio de Janeiro, Brazil",
        phone: "+55-21-91234-5678",
        name: "Maria Oliveira",
        username: "mariaoliveira"
      },
      {
        _id: "2",
        github_id: "joao_dev",
        email: "joao.silva@example.com",
        address: "789 Avenida Paulista, São Paulo, Brazil",
        phone: "+55-11-98765-4321",
        name: "João Silva",
        username: "joaosilva"
      }

    ];

    const toArray = jest.fn().mockResolvedValue(users);
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

    await usersController.getAllUsers({}, res);

    expect(res.setHeader).toHaveBeenCalledWith(
      "Content-Type",
      "application/json",
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(users);
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

    await usersController.getAllUsers({}, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: error.message });
  });
});

describe("usersController.getUserById", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 400 when id is invalid", async () => {
    const req = { params: { id: "invalid-id" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await usersController.getUserById(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      "Must use a valid user id to find a user.",
    );
  });

  it("returns 404 when the user is not found", async () => {
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

    await usersController.getUserById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "User not found." });
  });

  it("returns 200 and the user when found", async () => {
    const user = {
      _id: "507f1f77bcf86cd799439011",
      github_id: "maria_dev",
      email: "maria.oliveira@example.com",
      address: "456 Rua das Flores, Rio de Janeiro, Brazil",
      phone: "+55-21-91234-5678",
      name: "Maria Oliveira",
      username: "mariaoliveira"
    };
    const req = { params: { id: "507f1f77bcf86cd799439011" } };
    mongodb.getDatabase.mockReturnValue({
      db: () => ({
        collection: () => ({
          findOne: jest.fn().mockResolvedValue(user),
        }),
      }),
    });

    const res = {
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await usersController.getUserById(req, res);

    expect(res.setHeader).toHaveBeenCalledWith(
      "Content-Type",
      "application/json",
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(user);
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

    await usersController.getUserById(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: error.message });
  });
});
