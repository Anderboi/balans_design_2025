"use client";

import { useSearchParams, useParams } from "next/navigation";

export default function NewSpecificationPage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const type = searchParams.get("type");

  return (
    <div>
      <h1>Создание новой спецификации</h1>
      <p>Project ID: {params.id}</p>
      <p>Specification Type: {type}</p>
    </div>
  );
}
