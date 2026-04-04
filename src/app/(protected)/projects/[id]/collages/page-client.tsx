"use client";

import { Room } from "@/types";
import { CollageVariant } from "@/types/collages";
import { RoomSection } from "./components/room-section";
import PageContainer from "@/components/ui/page-container";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { SlashIcon } from "lucide-react";
import PageHeader from "@/components/ui/page-header";

interface CollagesPageClientProps {
  rooms: Room[];
  variants: CollageVariant[];
  projectId: string;
  projectName: string;
}

export default function CollagesPageClient({
  rooms,
  variants,
  projectId,
  projectName,
}: CollagesPageClientProps) {
  // Group variants by room_id
  const variantsByRoom = rooms.reduce(
    (acc, room) => {
      acc[room.id] = variants.filter((v) => v.room_id === room.id);
      return acc;
    },
    {} as Record<string, CollageVariant[]>,
  );

  return (
    <PageContainer>
      {/* Header & Breadcrumbs */}
      <div className="space-y-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={`/projects/${projectId}`}>{projectName}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <SlashIcon className="w-3 h-3" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage className="font-bold text-black">
                Коллажи / Мудборды
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <PageHeader title="Коллажи / Мудборды" />
      </div>

      {/* Room Sections */}
      <div className="mt-8 space-y-6">
        {rooms.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg font-medium mb-2">Нет помещений</p>
            <p className="text-sm">
              Добавьте помещения в техническое задание проекта, чтобы загружать
              коллажи.
            </p>
          </div>
        ) : (
          rooms.map((room) => (
            <RoomSection
              key={room.id}
              room={room}
              variants={variantsByRoom[room.id] || []}
              projectId={projectId}
            />
          ))
        )}
      </div>
    </PageContainer>
  );
}
