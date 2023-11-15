import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import AWS from "aws-sdk";
import { handleError } from "../utils/handle-error-utils";
import { HttpStatus } from "../enums/http-status.enum";
import { ICustomer } from "../interfaces/customer-interface";
import {
  CREATE_CUSTOMER_FIELDS_IS_REQUIRED_ERROR_MESSAGE,
  CREATE_CUSTOMER_FIELDS_IS_INVALID_ERROR_MESSAGE,
  GENERAL_GET_CUSTOMER_ERROR_MESSAGE,
  GENERAL_UPDATE_CUSTOMER_ERROR_MESSAGE,
  GENERAL_DELETE_CUSTOMER_ERROR_MESSAGE,
} from "../messages/api-messages";
import { CustomerService } from "../services/customer-service";
import { CUSTOMER_NOT_FOUND, NO_CUSTOMER_WAS_FOUND } from "../messages/api-messages";
import { InputValidation } from "../utils/input-validation";


AWS.config.update({ region: "us-east-1" });

const headers = {
  "content-type": "application/json",
};

const customerService = new CustomerService();
const inputValidation = new InputValidation();

const createCustomer = async (event: Partial<APIGatewayProxyEvent>): Promise<APIGatewayProxyResult> => {
  try {
    const reqBody: ICustomer = JSON.parse(event.body as string);

    // Custom validation function
    const validationResult = inputValidation.createCustomer(reqBody);

    if (!validationResult.isValid) {
      return {
        statusCode: HttpStatus.BAD_REQUEST,
        headers,
        body: JSON.stringify({ message: validationResult.errorMessage }),
      };
    }

    const customer = await customerService.create(reqBody);

    return {
      statusCode: HttpStatus.CREATED,
      headers,
      body: JSON.stringify({ data: { customer }, message: "User created" }),
    };
  } catch (e: any) {
    if (e.status === 400 && e.message) {
      handleError(e, headers, e.message, 400);
    }
    return handleError(
      e,
      headers,
      !!e.errors?.find((error: any) => error.includes("is a required field"))
        ? CREATE_CUSTOMER_FIELDS_IS_REQUIRED_ERROR_MESSAGE
        : CREATE_CUSTOMER_FIELDS_IS_INVALID_ERROR_MESSAGE,
    );
  }
};

const listCustomers = async (): Promise<APIGatewayProxyResult> => {
  const customers = await customerService.list();

  if (customers && !customers.length) {
    return {
      statusCode: HttpStatus.NOT_FOUND,
      headers,
      body: JSON.stringify({ message: NO_CUSTOMER_WAS_FOUND }),
    };
  }

  return {
    statusCode: HttpStatus.OK,
    headers,
    body: JSON.stringify({ customers }),
  };
};

const getCustomer = async (event: Partial<APIGatewayProxyEvent>): Promise<APIGatewayProxyResult> => {
  try {
    const customer = await customerService.getById(event.pathParameters?.id as string);
    console.log("🚀 ~ file: customer-handler.ts:61 ~ getCustomer ~ customer:", customer);

    if (!customer) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        headers,
        body: JSON.stringify({
          message: CUSTOMER_NOT_FOUND,
        }),
      };
    }

    return {
      statusCode: HttpStatus.OK,
      headers,
      body: JSON.stringify(customer),
    };
  } catch (e) {
    return handleError(e, headers, GENERAL_GET_CUSTOMER_ERROR_MESSAGE);
  }
};

const updateCustomer = async (event: Partial<APIGatewayProxyEvent>): Promise<APIGatewayProxyResult> => {
  try {
    const id = event.pathParameters?.id as string;

    const reqBody: ICustomer = JSON.parse(event.body as string);

    const customer = await customerService.getById(id);

    if (!customer) {
      return {
        statusCode: HttpStatus.NOT_FOUND,
        headers,
        body: JSON.stringify({
          message: CUSTOMER_NOT_FOUND,
        }),
      };
    }

    const updatedCustomer = await customerService.update(reqBody, id, customer);

    return {
      statusCode: HttpStatus.OK,
      headers,
      body: JSON.stringify({ customer: updatedCustomer, message: "Customer updated" }),
    };
  } catch (e) {
    return handleError(e, headers, GENERAL_UPDATE_CUSTOMER_ERROR_MESSAGE);
  }
};

const deleteCustomer = async (event: Partial<APIGatewayProxyEvent>): Promise<APIGatewayProxyResult> => {
  try {
    const id = event.pathParameters?.id as string;

    await customerService.delete(id);

    return {
      statusCode: HttpStatus.NO_CONTENT,
      body: JSON.stringify({ message: "User deleted" }),
    };
  } catch (e) {
    return handleError(e, headers, GENERAL_DELETE_CUSTOMER_ERROR_MESSAGE);
  }
};

export { createCustomer, listCustomers, getCustomer, updateCustomer, deleteCustomer };
