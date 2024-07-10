import instance from "../config/axios";
import { get, post, put, remove } from "../services/apiServices";

jest.mock("../config/axios");

describe("instance Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch data successfully", async () => {
    const data = { id: 1, name: "Test Data" };
    instance.get.mockResolvedValue({ data: data });

    const result = await get();
    expect(result).toEqual(data);
    expect(instance.get).toHaveBeenCalledWith("/endpoint");
  });

  it("should handle fetch data error", async () => {
    const error = new Error("Fetch error");
    instance.get.mockRejectedValue(error);

    await expect(get()).rejects.toThrow(error);
    expect(instance.get).toHaveBeenCalledWith("/endpoint");
  });

  it("should post data successfully", async () => {
    const data = { name: "Test Data" };
    const response = { id: 1, ...data };
    instance.post.mockResolvedValue({ data: response });

    const result = await post(data);
    expect(result).toEqual(response);
    expect(instance.post).toHaveBeenCalledWith("/endpoint", data);
  });

  it("should handle post data error", async () => {
    const data = { name: "Test Data" };
    const error = new Error("Post error");
    instance.post.mockRejectedValue(error);

    await expect(post(data)).rejects.toThrow(error);
    expect(instance.post).toHaveBeenCalledWith("/endpoint", data);
  });

  it("should update data successfully", async () => {
    const id = 1;
    const data = { name: "Updated Data" };
    const response = { id, ...data };
    instance.put.mockResolvedValue({ data: response });

    const result = await put(id, data);
    expect(result).toEqual(response);
    expect(instance.put).toHaveBeenCalledWith(`/endpoint/${id}`, data);
  });

  it("should handle update data error", async () => {
    const id = 1;
    const data = { name: "Updated Data" };
    const error = new Error("Update error");
    instance.put.mockRejectedValue(error);

    await expect(put(id, data)).rejects.toThrow(error);
    expect(instance.put).toHaveBeenCalledWith(`/endpoint/${id}`, data);
  });

  it("should delete data successfully", async () => {
    const id = 1;
    const response = { message: "Deleted successfully" };
    instance.delete.mockResolvedValue({ data: response });

    const result = await remove(id);
    expect(result).toEqual(response);
    expect(instance.delete).toHaveBeenCalledWith(`/endpoint/${id}`);
  });

  it("should handle delete data error", async () => {
    const id = 1;
    const error = new Error("Delete error");
    instance.delete.mockRejectedValue(error);

    await expect(remove(id)).rejects.toThrow(error);
    expect(instance.delete).toHaveBeenCalledWith(`/endpoint/${id}`);
  });
});
