import {
  ArrowLeftOutlined,
  EditOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import type { DescriptionsProps } from "antd";
import { Button, Card, Descriptions, Skeleton, Space } from "antd";
import Title from "antd/es/typography/Title";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { ButtonLink } from "../../shared/components/ButtonLink";
import { useBikeDetailsProvider } from "../providers/useBikeDetailsProvider";
import { BikeFormModal } from "./BikeFormModal";
import { formatPrice } from "./formatPrice";

interface BikeDetailsProps {
  bikeId: string;
}

export const BikeDetails = ({ bikeId }: BikeDetailsProps) => {
  const { bike, isLoading, load, updateBike } = useBikeDetailsProvider(bikeId);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    load();
  }, [bikeId]);

  const value = (content: ReactNode) =>
    isLoading ? <Skeleton.Input active size="small" /> : (content ?? "—");

  const items: DescriptionsProps["items"] = [
    { key: "brand", label: "Brand", children: value(bike?.brand) },
    { key: "model", label: "Model", children: value(bike?.model) },
    { key: "category", label: "Category", children: value(bike?.category) },
    {
      key: "frameMaterial",
      label: "Frame material",
      children: value(bike?.frameMaterial),
    },
    {
      key: "frameSizeCm",
      label: "Frame size",
      children: value(bike && `${bike.frameSizeCm} cm`),
    },
    {
      key: "wheelSizeInches",
      label: "Wheel size",
      children: value(bike && `${bike.wheelSizeInches} inches`),
    },
    { key: "gearCount", label: "Gears", children: value(bike?.gearCount) },
    {
      key: "weightKg",
      label: "Weight",
      children: value(bike && `${bike.weightKg} kg`),
    },
    {
      key: "electric",
      label: "Electric",
      children: value(bike && (bike.electric ? "Yes" : "No")),
    },
    {
      key: "price",
      label: "Price",
      children: value(bike && formatPrice(bike.priceCents)),
    },
    {
      key: "description",
      label: "Description",
      span: "filled",
      children: value(bike?.description),
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: 16,
        padding: ".25rem .5rem",
      }}
    >
      <ButtonLink to="/bikes" icon={<ArrowLeftOutlined />}>
        Back to bikes
      </ButtonLink>

      <Space align="center">
        <ShopOutlined style={{ fontSize: "1.5rem" }} />
        {isLoading ? (
          <Skeleton.Input active size="large" />
        ) : (
          <Title level={2} style={{ margin: 0 }}>
            {bike ? `${bike.brand} ${bike.model}` : "Bike not found"}
          </Title>
        )}
      </Space>

      <Card
        title="Bike information"
        style={{ alignSelf: "stretch" }}
        extra={
          <Button
            icon={<EditOutlined />}
            aria-label="Edit bike"
            disabled={!bike}
            onClick={() => setIsEditing(true)}
          />
        }
      >
        <Descriptions column={{ xs: 1, md: 2 }} items={items} />
      </Card>

      {isEditing && bike && (
        <BikeFormModal
          title="Edit bike"
          okText="Save"
          bike={bike}
          onCancel={() => setIsEditing(false)}
          onSubmit={(input) =>
            updateBike(input).then(() => setIsEditing(false))
          }
        />
      )}
    </div>
  );
};
