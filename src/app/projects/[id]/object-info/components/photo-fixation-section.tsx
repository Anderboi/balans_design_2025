"use client";

import MainBlockCard from "@/components/ui/main-block-card";
import { Camera, Plus } from "lucide-react";
import Image from "next/image";

interface PhotoFixationSectionProps {
  data?: any;
}


export function PhotoFixationSection({ data }: PhotoFixationSectionProps) {
  const photos = data ;

  return (
    <MainBlockCard className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
          <Camera className="size-5 text-gray-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Фотофиксация объекта</h3>
          <p className="text-sm text-gray-500">
            Фотографии текущего состояния на объекте работ
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Add Photo Button */}
        <button className="aspect-4/3 rounded-xl border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-gray-600">
          <Plus className="size-8" />
          <span className="text-sm font-medium">Добавить фото</span>
        </button>

        {/* Photo Grid */}
        {photos.slice(0, 5).map((photo: string, index: number) => (
          <div
            key={index}
            className="aspect-4/3 rounded-xl overflow-hidden bg-gray-100 relative group cursor-pointer"
          >
            <Image
              src={photo}
              alt={`Object photo ${index + 1}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          </div>
        ))}
      </div>
    </MainBlockCard>
  );
}
