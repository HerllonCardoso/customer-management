import { ICustomer, IAddress, IContact } from "../interfaces/customer-interface";
import {
  CREATE_CUSTOMER_FIELDS_IS_REQUIRED_ERROR_MESSAGE,
  CREATE_CUSTOMER_FIELDS_IS_INVALID_ERROR_MESSAGE,
} from "../messages/api-messages";

export class InputValidation {
  createCustomer(input: ICustomer): { isValid: boolean; errorMessage?: string } {
    const requiredFields = ["fullName", "birthDate", "addresses", "contacts"];

    const areAllRequiredFieldsPresent = requiredFields.every((field) => input.hasOwnProperty(field));

    if (!areAllRequiredFieldsPresent) {
      return {
        isValid: false,
        errorMessage: CREATE_CUSTOMER_FIELDS_IS_REQUIRED_ERROR_MESSAGE,
      };
    }

    return !!input &&
      typeof input === "object" &&
      typeof input.fullName === "string" &&
      typeof input.birthDate === "string" &&
      Array.isArray(input.addresses) &&
      input.addresses.every(this.validateAddress) &&
      Array.isArray(input.contacts) &&
      input.contacts.every(this.validateContact)
      ? { isValid: true }
      : { isValid: false, errorMessage: CREATE_CUSTOMER_FIELDS_IS_INVALID_ERROR_MESSAGE };
  }

  private validateAddress(address: IAddress): boolean {
    const requiredFields = ["cep", "street", "number", "state", "city"];

    const areAllRequiredFieldsPresent = requiredFields.every((field) => address.hasOwnProperty(field));

    return (
      areAllRequiredFieldsPresent &&
      typeof address === "object" &&
      typeof address.cep === "string" &&
      typeof address.street === "string" &&
      typeof address.number === "number" &&
      (typeof address.district === "string" || address.district === undefined) &&
      typeof address.state === "string" &&
      typeof address.city === "string" &&
      (typeof address.lat === "string" || address.lat === undefined) &&
      (typeof address.lon === "string" || address.lon === undefined)
    );
  }

  private validateContact(contact: IContact): boolean {
    const requiredFields = ["name", "phone", "email"];

    const areAllRequiredFieldsPresent = requiredFields.every((field) => contact.hasOwnProperty(field));

    return (
      areAllRequiredFieldsPresent &&
      typeof contact === "object" &&
      typeof contact.name === "string" &&
      typeof contact.phone === "string" &&
      typeof contact.email === "string"
    );
  }
}
