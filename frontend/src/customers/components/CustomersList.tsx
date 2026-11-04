import { Pagination, Skeleton, Space } from "antd";
import { useEffect, useState } from "react";
import {
  PAGE_SIZE,
  useCustomersProvider,
} from "../providers/useCustomersProvider";
import { AddCustomerButton } from "./AddCustomerButton";
import { CustomerListItem } from "./CustomerListItem";

export const CustomersList = () => {
  const {
    customers,
    totalCount,
    deleteCustomer,
    createCustomer,
    isLoading,
    load,
  } = useCustomersProvider();
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    load(page);
  }, [page]);

  return (
    <Space orientation="vertical" style={{ padding: ".25rem .5rem" }}>
      <AddCustomerButton
        createCustomer={(input) => createCustomer(input).then(() => load(page))}
      />
      {isLoading ? (
        <Skeleton />
      ) : (
        customers.map((customer) => (
          <CustomerListItem
            key={customer.id}
            customer={customer}
            deleteCustomer={(id) => {
              deleteCustomer(id).then(() => load(page));
            }}
          />
        ))
      )}
      <Pagination
        current={page}
        pageSize={PAGE_SIZE}
        total={totalCount}
        showSizeChanger={false}
        onChange={setPage}
      />
    </Space>
  );
};
