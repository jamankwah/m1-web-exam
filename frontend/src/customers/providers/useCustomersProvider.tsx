import axios from "axios";
import { useState } from "react";
import type {
  CreateCustomerModel,
  CustomerModel,
} from "../models/CustomerModel";

export const PAGE_SIZE = 10;

export const useCustomersProvider = () => {
  const [customers, setCustomers] = useState<CustomerModel[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const load = (page: number) => {
    setIsLoading(true);
    axios
      .get("http://localhost:3000/customers", {
        params: { page, limit: PAGE_SIZE },
      })
      .then((result) => {
        setCustomers(result.data.customers);
        setTotalCount(result.data.totalCount);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // The caller reloads the current page afterwards to keep the page in sync
  const deleteCustomer = (id: string) =>
    axios.delete(`http://localhost:3000/customers/${id}`);

  // Returns the request so the caller can react to errors (e.g. email already in use)
  const createCustomer = (input: CreateCustomerModel) =>
    axios.post<CustomerModel>("http://localhost:3000/customers", input);

  return {
    customers,
    totalCount,
    load,
    isLoading,
    deleteCustomer,
    createCustomer,
  };
};
