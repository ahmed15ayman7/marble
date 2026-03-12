"use client";

import { useQuery } from "@tanstack/react-query";

async function fetchSupplierProfile() {
  const res = await fetch("/api/supplier/profile");
  if (!res.ok) throw new Error("Failed to fetch profile");
  const json = await res.json();
  return json.data;
}

export function useSupplierProfile() {
  return useQuery({
    queryKey: ["supplier-profile"],
    queryFn: fetchSupplierProfile,
  });
}
