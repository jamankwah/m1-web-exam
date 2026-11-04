import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from "@nestjs/common";
import { BikesRepository } from "./bikes.repository";
import { BikesService } from "./bikes.service";
import type { BikeModel } from "./models/bike.model";
import {
  BikeInUseError,
  BikeNotFoundError,
} from "./models/persistence-error.model";

const bike: BikeModel = {
  id: "bike-id",
  brand: "Veloria",
  model: "City 100",
  description: "Vélo City 100",
  category: "city",
  frameMaterial: "aluminium",
  frameSizeCm: 54,
  wheelSizeInches: 28,
  gearCount: 9,
  weightKg: 12.4,
  electric: false,
  priceCents: 49900,
};

function setup() {
  const repository = {
    findAll: vi.fn<BikesRepository["findAll"]>(),
    findById: vi.fn<BikesRepository["findById"]>(),
    create: vi.fn<BikesRepository["create"]>(),
    update: vi.fn<BikesRepository["update"]>(),
    delete: vi.fn<BikesRepository["delete"]>(),
  };
  const service = new BikesService(repository as unknown as BikesRepository);
  return { repository, service };
}

describe("BikesService", () => {
  it("passes pagination to the repository", async () => {
    const { repository, service } = setup();
    const page = { totalCount: 1, bikes: [bike] };
    repository.findAll.mockResolvedValue(page);
    expect(await service.findAll(2, 5)).toEqual(page);
    expect(repository.findAll).toHaveBeenCalledWith(2, 5);
  });

  it("returns 404 for a missing bike", async () => {
    const { repository, service } = setup();
    repository.findById.mockResolvedValue(null);
    await expect(service.findById(bike.id)).rejects.toBeInstanceOf(
      NotFoundException,
    );
    repository.update.mockRejectedValue(new BikeNotFoundError());
    await expect(
      service.update(bike.id, { brand: "Cyclane" }),
    ).rejects.toBeInstanceOf(NotFoundException);
    repository.delete.mockRejectedValue(new BikeNotFoundError());
    await expect(service.delete(bike.id)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it("rejects empty patches", async () => {
    const { repository, service } = setup();
    await expect(service.update(bike.id, {})).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(repository.update).not.toHaveBeenCalled();
  });

  it("returns 409 when deleting a bike that was sold", async () => {
    const { repository, service } = setup();
    repository.delete.mockRejectedValue(new BikeInUseError());
    await expect(service.delete(bike.id)).rejects.toBeInstanceOf(
      ConflictException,
    );
  });
});
