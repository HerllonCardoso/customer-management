import crypto from "crypto";
import { CustomerRepository } from "../repository/customer-repository";

export class CustomerService {
  private customerRepository = new CustomerRepository();

  async list() {
    const customers = await this.customerRepository.find();

    return customers?.Items;
  }

  async getById(id: string) {
    return await this.customerRepository.findOne(id);
  }

  async create(reqBody: any) {
    const customer = {
      id: crypto.randomUUID(),
      ...reqBody,
      isActive: true,
    };

    await this.customerRepository.createOrUpdate(customer);

    return customer;
  }

  async update(reqBody: any, id: string, customer: any) {
    const updatedCustomer = {
      ...customer,
      ...reqBody,
      id,
    };

    await this.customerRepository.createOrUpdate(updatedCustomer);
    return updatedCustomer;
  }

  async delete(id: string) {
    await this.getById(id);

    return this.customerRepository.remove(id);
  }
}
