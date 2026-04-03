const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "Retro Gaming Store API",
    description: "API for managing retro gaming products",
  },
  host: "localhost:3000",
  schemes: ["http", "https"],
};

const outputFile = "./swagger.json";
const endpointsFiles = ["./routes/index.js"];

//This wull generate the swagger.json
swaggerAutogen(outputFile, endpointsFiles, doc);
