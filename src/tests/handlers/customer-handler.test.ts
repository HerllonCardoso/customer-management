import { APIGatewayProxyEvent } from "aws-lambda";
import {
  createCustomer,
  getCustomer,
  deleteCustomer,
  updateCustomer,
  listCustomers,
} from "../../handlers/customer-handler";
import { ICustomer } from "../../interfaces/customer-interface";
import { DynamoDBClient } from "../../providers/dynamo-doc-client-provider";

describe("Customer Controller", () => {
  const mockDocClient: any = {
    put: jest.fn().mockReturnThis(),
    scan: jest.fn().mockReturnThis(),
    promise: jest.fn(),
    get: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
  };

  const originalDocClient = DynamoDBClient.getInstance;
  beforeEach(() => {
    DynamoDBClient.getInstance = jest.fn(() => mockDocClient);
  });

  afterEach(() => {
    jest.clearAllMocks();
    DynamoDBClient.getInstance = originalDocClient;
  });

  it("should create a customer", async () => {
    const mockedCustomer: ICustomer = {
      fullName: "John Doe",
      birthDate: "1990-01-01",
      addresses: [
        {
          cep: "12345-678",
          street: "Main Street",
          number: 123,
          district: "Downtown",
          state: "CA",
          city: "Cityville",
        },
      ],
      contacts: [
        {
          name: "Emergency Contact 1",
          phone: "123-456-7890",
          email: "emergency1@example.com",
        },
        {
          name: "Emergency Contact 2",
          phone: "987-654-3210",
          email: "emergency2@example.com",
        },
      ],
    };

    let mockEvent: Partial<APIGatewayProxyEvent> = {
      pathParameters: {
        id: "someId",
      },
      body: JSON.stringify(mockedCustomer),
    };

    const result = await createCustomer(mockEvent);

    expect(result.statusCode).toBe(201);
  });

  it("should list customers", async () => {
    const result = await listCustomers();
    expect(result.statusCode).toBe(200);
  });

  it("should get a customer", async () => {
    let mockEvent: Partial<APIGatewayProxyEvent> = {
      pathParameters: {
        id: "x1x2x3",
      },
      body: "{}",
    };

    const result = await getCustomer(mockEvent);
    expect(result.statusCode).toBe(200);
  });

  it("should update a customer", async () => {
    const mockedCustomer: Partial<ICustomer> = {
      fullName: "John Doe2",
    };

    let mockEvent: Partial<APIGatewayProxyEvent> = {
      pathParameters: {
        id: "550e8400-e29b-41d4-a716-446655440000",
      },
      body: JSON.stringify(mockedCustomer),
    };

    mockDocClient.get.mockReturnValueOnce({
      promise: jest.fn().mockResolvedValueOnce({ Item: { id: "550e8400-e29b-41d4-a716-446655440000" } }),
    });

    const result = await updateCustomer(mockEvent);
    expect(result.statusCode).toBe(200);
  });

  it("should delete a customer", async () => {
    let mockEvent: Partial<APIGatewayProxyEvent> = {
      pathParameters: {
        id: "550e8400-e29b-41d4-a716-446655440000",
      },
      body: "{}",
    };

    mockDocClient.get.mockReturnValueOnce({
      promise: jest.fn().mockResolvedValueOnce({ Item: { id: "550e8400-e29b-41d4-a716-446655440000" } }),
    });

    const result = await deleteCustomer(mockEvent);
    expect(result.statusCode).toBe(204);
  });
});
