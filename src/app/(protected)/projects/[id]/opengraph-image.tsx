// app/(protected)/projects/[id]/opengraph-image.tsx
import { projectsService } from '@/lib/services/projects';
import { createClient } from '@/lib/supabase/server';
import { ImageResponse } from "next/og";

// Обязательные настройки размера
export const alt = "Превью проекта";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Это запускается на сервере при запросе картинки соцсетью
export default async function Image({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const project = await projectsService.getProjectById(params.id, supabase);

  return new ImageResponse(
    <div
      style={{
        background: "linear-gradient(to bottom right, #1D1D1F, #434345)",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "80px",
        color: "white",
      }}
    >
      <p style={{ fontSize: 32, color: "#A1A1A6", marginBottom: 10 }}>
        Дизайн-проект
      </p>
      <h1
        style={{ fontSize: 72, fontWeight: "bold", margin: 0, lineHeight: 1.1 }}
      >
        {project?.name || "Проект"}
      </h1>
      {/* {project?. && (
        <p style={{ fontSize: 40, marginTop: 40 }}>
          Заказчик: {project.client_name}
        </p>
      )} */}

      <div
        style={{
          position: "absolute",
          bottom: 40,
          right: 80,
          fontSize: 32,
          fontWeight: "bold",
        }}
      >
        Balans App
      </div>
    </div>,
    { ...size },
  );
}
