"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { SupplierProductInput } from "@/lib/validations";

async function fetchSupplierProducts() {
  const res = await fetch("/api/supplier/products");
  if (!res.ok) throw new Error("Failed to fetch products");
  const json = await res.json();
  return json.data;
}

async function fetchSupplierProduct(id: string) {
  const res = await fetch(`/api/supplier/products/${id}`);
  if (!res.ok) throw new Error("Failed to fetch product");
  const json = await res.json();
  return json.data;
}

async function createSupplierProduct(data: SupplierProductInput) {
  const res = await fetch("/api/supplier/products", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? "Failed to create");
  }
  return res.json();
}

async function updateSupplierProduct(id: string, data: SupplierProductInput) {
  const res = await fetch(`/api/supplier/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? "Failed to update");
  }
  return res.json();
}

async function deleteSupplierProduct(id: string) {
  const res = await fetch(`/api/supplier/products/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error ?? "Failed to delete");
  }
}

export function useSupplierProducts() {
  return useQuery({
    queryKey: ["supplier-products"],
    queryFn: fetchSupplierProducts,
  });
}

export function useSupplierProduct(id: string | null) {
  return useQuery({
    queryKey: ["supplier-product", id],
    queryFn: () => fetchSupplierProduct(id!),
    enabled: !!id,
  });
}

export function useCreateSupplierProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SupplierProductInput) => createSupplierProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supplier-products"] });
    },
  });
}

export function useUpdateSupplierProduct(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: SupplierProductInput) => updateSupplierProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supplier-products"] });
      queryClient.invalidateQueries({ queryKey: ["supplier-product", id] });
    },
  });
}

export function useDeleteSupplierProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSupplierProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supplier-products"] });
    },
  });
}
