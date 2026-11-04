import { Pagination, Skeleton, Space } from "antd";
import { useEffect, useState } from "react";
import { PAGE_SIZE, useBikesProvider } from "../providers/useBikesProvider";
import { AddBikeButton } from "./AddBikeButton";
import { BikeListItem } from "./BikeListItem";

export const BikesList = () => {
  const { bikes, totalCount, deleteBike, createBike, isLoading, load } =
    useBikesProvider();
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    load(page);
  }, [page]);

  return (
    <Space orientation="vertical" style={{ padding: ".25rem .5rem" }}>
      <AddBikeButton
        createBike={(input) => createBike(input).then(() => load(page))}
      />
      {isLoading ? (
        <Skeleton />
      ) : (
        bikes.map((bike) => (
          <BikeListItem
            key={bike.id}
            bike={bike}
            deleteBike={(id) => deleteBike(id).then(() => load(page))}
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
