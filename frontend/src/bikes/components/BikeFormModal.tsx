import { Col, Input, InputNumber, Modal, Row, Switch, Typography } from "antd";
import { useState } from "react";
import type { BikeModel, CreateBikeModel } from "../models/BikeModel";

interface BikeFormModalProps {
  title: string;
  okText: string;
  // Without a bike, the form starts empty (creation)
  bike?: BikeModel;
  onCancel: () => void;
  onSubmit: (input: CreateBikeModel) => Promise<void>;
}

type TextField =
  "brand" | "model" | "description" | "category" | "frameMaterial";

type NumberField =
  "frameSizeCm" | "wheelSizeInches" | "gearCount" | "weightKg" | "price";

type BikeFormValues = Record<TextField, string> &
  Record<NumberField, number | null> & { electric: boolean };

type BikeFormErrors = Partial<Record<TextField | NumberField, string>>;

const toValues = (bike?: BikeModel): BikeFormValues => ({
  brand: bike?.brand ?? "",
  model: bike?.model ?? "",
  description: bike?.description ?? "",
  category: bike?.category ?? "",
  frameMaterial: bike?.frameMaterial ?? "",
  frameSizeCm: bike?.frameSizeCm ?? null,
  wheelSizeInches: bike?.wheelSizeInches ?? null,
  gearCount: bike?.gearCount ?? null,
  weightKg: bike?.weightKg ?? null,
  // The form shows euros, the API stores cents
  price: bike ? bike.priceCents / 100 : null,
  electric: bike?.electric ?? false,
});

const validate = (values: BikeFormValues): BikeFormErrors => {
  const errors: BikeFormErrors = {};
  const textFields: TextField[] = [
    "brand",
    "model",
    "description",
    "category",
    "frameMaterial",
  ];
  for (const name of textFields) {
    if (!values[name].trim()) errors[name] = "This field is required";
  }
  const positiveFields: NumberField[] = [
    "frameSizeCm",
    "wheelSizeInches",
    "gearCount",
    "weightKg",
  ];
  for (const name of positiveFields) {
    const value = values[name];
    if (value === null || value <= 0) errors[name] = "Must be greater than 0";
  }
  if (values.price === null || values.price < 0)
    errors.price = "Must be 0 or more";
  return errors;
};

const toCreateBikeModel = (values: BikeFormValues): CreateBikeModel => ({
  brand: values.brand.trim(),
  model: values.model.trim(),
  description: values.description.trim(),
  category: values.category.trim(),
  frameMaterial: values.frameMaterial.trim(),
  frameSizeCm: values.frameSizeCm ?? 0,
  wheelSizeInches: values.wheelSizeInches ?? 0,
  gearCount: values.gearCount ?? 0,
  weightKg: values.weightKg ?? 0,
  priceCents: Math.round((values.price ?? 0) * 100),
  electric: values.electric,
});

export const BikeFormModal = ({
  title,
  okText,
  bike,
  onCancel,
  onSubmit,
}: BikeFormModalProps) => {
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [values, setValues] = useState<BikeFormValues>(toValues(bike));
  const [errors, setErrors] = useState<BikeFormErrors>({});

  const onConfirm = () => {
    const validationErrors = validate(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsSaving(true);
    onSubmit(toCreateBikeModel(values))
      // On failure, keep the modal open so the changes are not lost
      .catch(() => {})
      .finally(() => setIsSaving(false));
  };

  const error = (name: TextField | NumberField) =>
    errors[name] && (
      <Typography.Text type="danger">{errors[name]}</Typography.Text>
    );

  const textField = (name: TextField, label: string) => (
    <>
      <label htmlFor={`bike-${name}`}>{label}</label>
      <Input
        id={`bike-${name}`}
        value={values[name]}
        status={errors[name] && "error"}
        onChange={(event) => {
          setValues({ ...values, [name]: event.target.value });
          setErrors({ ...errors, [name]: undefined });
        }}
      />
      {error(name)}
    </>
  );

  const numberField = (name: NumberField, label: string, precision = 2) => (
    <>
      <label htmlFor={`bike-${name}`}>{label}</label>
      <InputNumber
        id={`bike-${name}`}
        style={{ width: "100%" }}
        min={0}
        precision={precision}
        value={values[name]}
        status={errors[name] && "error"}
        onChange={(value) => {
          setValues({ ...values, [name]: value });
          setErrors({ ...errors, [name]: undefined });
        }}
      />
      {error(name)}
    </>
  );

  return (
    <Modal
      open
      title={title}
      okText={okText}
      onCancel={onCancel}
      onOk={onConfirm}
      confirmLoading={isSaving}
    >
      <Row gutter={[16, 16]}>
        <Col span={12}>{textField("brand", "Brand *")}</Col>
        <Col span={12}>{textField("model", "Model *")}</Col>
        <Col span={24}>{textField("description", "Description *")}</Col>
        <Col span={12}>{textField("category", "Category *")}</Col>
        <Col span={12}>{textField("frameMaterial", "Frame material *")}</Col>
        <Col span={8}>{numberField("frameSizeCm", "Frame size (cm) *")}</Col>
        <Col span={8}>
          {numberField("wheelSizeInches", "Wheel size (inches) *")}
        </Col>
        <Col span={8}>{numberField("gearCount", "Gears *", 0)}</Col>
        <Col span={8}>{numberField("weightKg", "Weight (kg) *")}</Col>
        <Col span={8}>{numberField("price", "Price (€) *")}</Col>
        <Col span={8}>
          <label htmlFor="bike-electric">Electric</label>
          <div>
            <Switch
              id="bike-electric"
              checked={values.electric}
              onChange={(checked) =>
                setValues({ ...values, electric: checked })
              }
            />
          </div>
        </Col>
      </Row>
    </Modal>
  );
};
