import type { CustomerPageModel } from "../models/customer.model";
import { CustomerResponseDto } from "./customer-response.dto";

export class CustomerPageResponseDto {
  totalCount: number;
  customers: CustomerResponseDto[];

  static fromModel(model: CustomerPageModel): CustomerPageResponseDto {
    return Object.assign(new CustomerPageResponseDto(), {
      totalCount: model.totalCount,
      customers: model.customers.map((customer) =>
        CustomerResponseDto.fromModel(customer),
      ),
    });
  }
}
