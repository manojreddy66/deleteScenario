const lambda = require("../../../../../../src/sp/scenario/createScenario/v1/1/app");
const assert = require("assert");

describe("SP Create Scenario API Lambda Test Suite", () => {
  beforeEach(() => {
    jest.mock("utils/api_response_utils");
    jest.mock("utils/common_utils");
    jest.mock("constants/customConstants");
    jest.mock("prismaORM");
    jest.mock("prismaORM/services/scenariosService");
    jest.mock("prismaORM/services/userDetailsService");
  });

  it("Unit Test Case 1: The API should return success message with a 200 status code - Getsudo Scenario.", async () => {
    console.log(
      "*****************Unit Test Case 1: The API should return success message with a 200 status code.*****************"
    );
    const event = {
      body: JSON.stringify({
        type: "Getsudo",
        namc: "TMMI",
        line: "Line1",
        startMonth: "Feb",
        startYear: "2025",
        endMonth: "Mar",
        endYear: "2026",
        userName: "Priyadarshini Gangone",
        userEmail: "useremail@toyota.com",
      }),
    };
    const response = {
      message: "Successfully created a scenario.",
    };
    const result = await lambda.handler(event);
    assert.equal(result.statusCode, 200);
    assert.deepEqual(JSON.parse(result.body), response);
  });

  it("Unit Test Case 2: The API should return success message with a 200 status code - AP Scenario.", async () => {
    console.log(
      "*****************Unit Test Case 2: The API should return success message with a 200 status code - AP Scenario.*****************"
    );
    process.env.VALIDATION = "inactivescenarios";
    const event = {
      body: JSON.stringify({
        type: "AP",
        namc: "TMMI",
        line: "Line1",
        startMonth: "Jan",
        startYear: "2025",
        endMonth: "Mar",
        endYear: "2026",
        userName: "Priyadarshini Gangone",
        userEmail: "useremail@toyota.com",
      }),
    };
    const response = {
      message: "Successfully created a scenario.",
    };
    const result = await lambda.handler(event);
    assert.equal(result.statusCode, 200);
    assert.deepEqual(JSON.parse(result.body), response);
  });

  it("Unit Test Case 3: The API should return validation error with a 400 status code - Active scenario exists with same config.", async () => {
    console.log(
      "*****************Unit Test Case 3: The API should return validation error with a 400 status code - Active scenario exists with same config.*****************"
    );
    process.env.VALIDATION = "activescenarios";
    const event = {
      body: JSON.stringify({
        type: "AP",
        namc: "TMMI",
        line: "Line1",
        startMonth: "Jan",
        startYear: "2025",
        endMonth: "Mar",
        endYear: "2026",
        userName: "Priyadarshini Gangone",
        userEmail: "useremail@toyota.com",
      }),
    };
    const response = {
      errorMessage: [
        "ValidationError: Scenario already exists for the given namc, line, plan type & cycle.",
      ],
    };
    const result = await lambda.handler(event);
    assert.equal(result.statusCode, 400);
    assert.deepEqual(JSON.parse(result.body), response);
  });

  it("Unit Test Case 4: The API should return validation error with a 400 status code when accessed with an in-valid/empty payload.", async () => {
    console.log(
      "*****************Unit Test Case 4: The API should return validation error with a 400 status code when accessed with an in-valid/empty payload.*****************"
    );
    const event = {};
    const errorMessage = {
      errorMessage: ["ValidationError: Request body cannot be empty."],
    };
    const result = await lambda.handler(event);
    assert.equal(result.statusCode, 400);
    assert.deepEqual(JSON.parse(result.body), errorMessage);
  });

  it("Unit Test Case 5: The API should return validation error with a 400 status code when accessed with an in-valid payload - type is missing.", async () => {
    console.log(
      "*****************Unit Test Case 5: The API should return validation error with a 400 status code when accessed with an in-valid payload - type is missing.*****************"
    );
    const event = {
      body: JSON.stringify({
        namc: "TMMI",
        line: "Line1",
        startMonth: "Jan",
        startYear: "2025",
        endMonth: "Mar",
        endYear: "2026",
        userName: "Priyadarshini Gangone",
        userEmail: "useremail@toyota.com",
      }),
    };
    const errorMessage = {
      errorMessage: [
        "ValidationError: type must be a string, and can either be Getsudo or AP.",
      ],
    };
    const result = await lambda.handler(event);
    assert.equal(result.statusCode, 400);
    assert.deepEqual(JSON.parse(result.body), errorMessage);
  });

  it("Unit Test Case 6: The API should return validation error with a 400 status code when accessed with an in-valid payload - invalid type value.", async () => {
    console.log(
      "*****************Unit Test Case 6: The API should return validation error with a 400 status code when accessed with an in-valid payload - invalid type value.*****************"
    );
    const event = {
      body: JSON.stringify({
        type: 14,
        namc: "TMMI",
        line: "Line1",
        startMonth: "Jan",
        startYear: "2025",
        endMonth: "Mar",
        endYear: "2026",
        userName: "Priyadarshini Gangone",
        userEmail: "useremail@toyota.com",
      }),
    };
    const errorMessage = {
      errorMessage: [
        "ValidationError: type must be a string, and can either be Getsudo or AP.",
      ],
    };
    const result = await lambda.handler(event);
    assert.equal(result.statusCode, 400);
    assert.deepEqual(JSON.parse(result.body), errorMessage);
  });

  it("Unit Test Case 7: The API should return validation error with a 400 status code when accessed with an in-valid payload - namc is missing.", async () => {
    console.log(
      "*****************Unit Test Case 7: The API should return validation error with a 400 status code when accessed with an in-valid payload - namc is missing.*****************"
    );
    const event = {
      body: JSON.stringify({
        type: "AP",
        line: "Line1",
        startMonth: "Jan",
        startYear: "2025",
        endMonth: "Mar",
        endYear: "2026",
        userName: "Priyadarshini Gangone",
        userEmail: "useremail@toyota.com",
      }),
    };
    const errorMessage = {
      errorMessage: ["ValidationError: namc is required and must be a string."],
    };
    const result = await lambda.handler(event);
    assert.equal(result.statusCode, 400);
    assert.deepEqual(JSON.parse(result.body), errorMessage);
  });

  it("Unit Test Case 8: The API should return validation error with a 400 status code when accessed with an in-valid payload - invalid namc value.", async () => {
    console.log(
      "*****************Unit Test Case 8: The API should return validation error with a 400 status code when accessed with an in-valid payload - invalid namc value.*****************"
    );
    const event = {
      body: JSON.stringify({
        type: "AP",
        namc: 14,
        line: "Line1",
        startMonth: "Jan",
        startYear: "2025",
        endMonth: "Mar",
        endYear: "2026",
        userName: "Priyadarshini Gangone",
        userEmail: "useremail@toyota.com",
      }),
    };
    const errorMessage = {
      errorMessage: ["ValidationError: namc is required and must be a string."],
    };
    const result = await lambda.handler(event);
    assert.equal(result.statusCode, 400);
    assert.deepEqual(JSON.parse(result.body), errorMessage);
  });

  it("Unit Test Case 9: The API should return validation error with a 400 status code when accessed with an in-valid payload - line is missing.", async () => {
    console.log(
      "*****************Unit Test Case 9: The API should return validation error with a 400 status code when accessed with an in-valid payload - line is missing.*****************"
    );
    const event = {
      body: JSON.stringify({
        type: "AP",
        namc: "TMMI",
        startMonth: "Jan",
        startYear: "2025",
        endMonth: "Mar",
        endYear: "2026",
        userName: "Priyadarshini Gangone",
        userEmail: "useremail@toyota.com",
      }),
    };
    const errorMessage = {
      errorMessage: ["ValidationError: line is required and must be a string."],
    };
    const result = await lambda.handler(event);
    assert.equal(result.statusCode, 400);
    assert.deepEqual(JSON.parse(result.body), errorMessage);
  });

  it("Unit Test Case 10: The API should return validation error with a 400 status code when accessed with an in-valid payload - invalid line value.", async () => {
    console.log(
      "*****************Unit Test Case 10: The API should return validation error with a 400 status code when accessed with an in-valid payload - invalid line value.*****************"
    );
    const event = {
      body: JSON.stringify({
        type: "AP",
        namc: "TMMI",
        line: null,
        startMonth: "Jan",
        startYear: "2025",
        endMonth: "Mar",
        endYear: "2026",
        userName: "Priyadarshini Gangone",
        userEmail: "useremail@toyota.com",
      }),
    };
    const errorMessage = {
      errorMessage: ["ValidationError: line is required and must be a string."],
    };
    const result = await lambda.handler(event);
    assert.equal(result.statusCode, 400);
    assert.deepEqual(JSON.parse(result.body), errorMessage);
  });
  it("Unit Test Case 11: The API should return validation error with a 400 status code when accessed with an in-valid payload - startMonth is missing.", async () => {
    console.log(
      "*****************Unit Test Case 11: The API should return validation error with a 400 status code when accessed with an in-valid payload - startMonth is missing.*****************"
    );
    const event = {
      body: JSON.stringify({
        type: "AP",
        namc: "TMMI",
        line: "Line1",
        startYear: "2025",
        endMonth: "Mar",
        endYear: "2026",
        userName: "Priyadarshini Gangone",
        userEmail: "useremail@toyota.com",
      }),
    };
    const errorMessage = {
      errorMessage: [
        "ValidationError: startMonth is required and must be a 3-character string.",
      ],
    };
    const result = await lambda.handler(event);
    assert.equal(result.statusCode, 400);
    assert.deepEqual(JSON.parse(result.body), errorMessage);
  });

  it("Unit Test Case 12: The API should return validation error with a 400 status code when accessed with an in-valid payload - invalid startMonth value.", async () => {
    console.log(
      "*****************Unit Test Case 12: The API should return validation error with a 400 status code when accessed with an in-valid payload - invalid startMonth value.*****************"
    );
    const event = {
      body: JSON.stringify({
        type: "AP",
        namc: "TMMI",
        line: "Line1",
        startMonth: "January",
        startYear: "2025",
        endMonth: "Mar",
        endYear: "2026",
        userName: "Priyadarshini Gangone",
        userEmail: "useremail@toyota.com",
      }),
    };
    const errorMessage = {
      errorMessage: [
        "ValidationError: startMonth is required and must be a 3-character string.",
      ],
    };
    const result = await lambda.handler(event);
    assert.equal(result.statusCode, 400);
    assert.deepEqual(JSON.parse(result.body), errorMessage);
  });

  it("Unit Test Case 13: The API should return validation error with a 400 status code when accessed with an in-valid payload - startYear, endMonth, endYear, userName & userEmail fields are missing.", async () => {
    console.log(
      "*****************Unit Test Case 13: The API should return validation error with a 400 status code when accessed with an in-valid payload - startYear, endMonth, endYear, userName & userEmail fields are missing.*****************"
    );
    const event = {
      body: JSON.stringify({
        type: "AP",
        namc: "TMMI",
        line: "Line1",
        startMonth: "Jan",
      }),
    };
    const errorMessage = {
      errorMessage: [
        "ValidationError: startYear is required and must be a 4-character string.",
        "ValidationError: endMonth is required and must be a 3-character string.",
        "ValidationError: endYear is required and must be a 4-character string.",
        "ValidationError: userName is required and must be a string.",
        "ValidationError: userEmail is required and must be a string.",
      ],
    };
    const result = await lambda.handler(event);
    assert.equal(result.statusCode, 400);
    assert.deepEqual(JSON.parse(result.body), errorMessage);
  });

  it("Unit Test Case 14: The API should return validation error with a 400 status code when accessed with an in-valid payload - invalid startYear, endMonth, endYear, userName & userEmail field value.", async () => {
    console.log(
      "*****************Unit Test Case 14: The API should return validation error with a 400 status code when accessed with an in-valid payload - invalid startYear, endMonth, endYear, userName & userEmail field value.*****************"
    );
    const event = {
      body: JSON.stringify({
        type: "AP",
        namc: "TMMI",
        line: "Line1",
        startMonth: "Jan",
        startYear: "25",
        endMonth: 10,
        endYear: "",
        userName: null,
        userEmail: " ",
      }),
    };
    const errorMessage = {
      errorMessage: [
        "ValidationError: startYear is required and must be a 4-character string.",
        "ValidationError: endMonth is required and must be a 3-character string.",
        "ValidationError: endYear is required and must be a 4-character string.",
        "ValidationError: userName is required and must be a string.",
        "ValidationError: Invalid userEmail."
      ],
    };
    const result = await lambda.handler(event);
    assert.equal(result.statusCode, 400);
    assert.deepEqual(JSON.parse(result.body), errorMessage);
  });

  it("Unit Test Case 15: The API should return validation error with a 400 status code when accessed with an in-valid payload - incorrect userEmail TLD.", async () => {
    console.log(
      "*****************Unit Test Case 15: The API should return validation error with a 400 status code when accessed with an in-valid payload - incorrect userEmail TLD.*****************"
    );
    const event = {
      body: JSON.stringify({
        type: "AP",
        namc: "TMMI",
        line: "Line1",
        startMonth: "Jan",
        startYear: "2025",
        endMonth: "Mar",
        endYear: "2026",
        userName: "Priyadarshini Gangone",
        userEmail: "useremail@toyota.in",
      }),
    };
    const errorMessage = {
      errorMessage: ["ValidationError: Invalid userEmail."],
    };
    const result = await lambda.handler(event);
    assert.equal(result.statusCode, 400);
    assert.deepEqual(JSON.parse(result.body), errorMessage);
  });

  it("Unit Test Case 16: The API should return internal server error with a 500 status code - DB error", async () => {
    console.log(
      "*****************Unit Test Case 16: The API should return internal server error with a 500 status code - DB error*****************"
    );
    process.env.VALIDATION = "dberror";
    const event = {
      body: JSON.stringify({
        type: "Getsudo",
        namc: "TMMI",
        line: "Line1",
        startMonth: "Feb",
        startYear: "2025",
        endMonth: "Mar",
        endYear: "2026",
        userName: "Priyadarshini Gangone",
        userEmail: "useremail@toyota.com",
      }),
    };
    const result = await lambda.handler(event);
    assert.equal(result.statusCode, 500);
    assert.deepEqual(
      JSON.parse(result.body).errorMessage,
      "Internal Server Error"
    );
  });

  it("Unit Test Case 17: The API should return internal server error with a 500 status code - DB error in input validation", async () => {
    console.log(
      "*****************Unit Test Case 17: The API should return internal server error with a 500 status code - DB error in input validation*****************"
    );
    process.env.VALIDATION = "error";
    const event = {
      body: JSON.stringify({
        type: "Getsudo",
        namc: "TMMI",
        line: "Line1",
        startMonth: "Feb",
        startYear: "2025",
        endMonth: "Mar",
        endYear: "2026",
        userName: "Priyadarshini Gangone",
        userEmail: "useremail@toyota.com",
      }),
    };
    const result = await lambda.handler(event);
    assert.equal(result.statusCode, 500);
    assert.deepEqual(
      JSON.parse(result.body).errorMessage,
      "Internal Server Error"
    );
  });
});
