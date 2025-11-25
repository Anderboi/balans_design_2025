"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronRight, X } from "lucide-react";
import { useEffect, useState } from "react";
import { ResidentsForm } from "@/components/brief/forms/residents-form";
import { DemolitionForm } from "@/components/brief/forms/demolition-form";
import { ConstructionForm } from "@/components/brief/forms/construction-form";
import { PremisesForm } from "@/components/brief/forms/premises-form";
import { EngineeringForm } from "@/components/brief/forms/engineering-form";

const briefBlocks = [
  { title: "Информация о проживающих", progress: 50 },
  { title: "Состав помещений", progress: 50 },
  { title: "Информация по демонтажу", progress: 50 },
  { title: "Информация по монтажу", progress: 50 },
  { title: "Инженерные системы", progress: 50 },
];

const BriefCarousel = () => {
  const [selectedBriefBlock, setSelectedBriefBlock] = useState<number | null>(
    null
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleOpenDrawer = (index: number) => {
    setSelectedBriefBlock(index);
    setIsDrawerOpen(true);
  };

  const handleSave = async (data: unknown) => {
    console.log("Saving brief data:", data);
    // TODO: Implement actual save logic
    setIsDrawerOpen(false);
  };

  const renderBriefForm = () => {
    if (selectedBriefBlock === null) return null;

    // TODO: В будущем получать ID из URL или пропсов страницы
    // Сейчас берем из URL params, так как компонент клиентский и находится в page.tsx
    // Но лучше передавать как проп.
    // Временное решение: берем ID из pathname (плохая практика, но работает для демо)
    const pathParts = window.location.pathname.split("/");
    const projectId = pathParts[pathParts.indexOf("projects") + 1];

    const commonProps = {
      projectId: projectId,
      onSave: handleSave,
    };

    switch (selectedBriefBlock) {
      case 0:
        return <ResidentsForm {...commonProps} />;
      case 1:
        return <PremisesForm {...commonProps} />;
      case 2:
        return <DemolitionForm {...commonProps} />;
      case 3:
        return <ConstructionForm roomList={[]} {...commonProps} />; //TODO: add rooms from Supabase
      case 4:
        return <EngineeringForm {...commonProps} />;
      default:
        return null;
    }
  };

  return (
    <>
      <Carousel
        orientation="horizontal"
        opts={{
          align: "start",
        }}
        className="gap-2 bg-secondary py-2  rounded-lg w-full "
      >
        <CarouselContent className="-ml-2 px-2">
          {briefBlocks.map((block, index) => (
            <CarouselItem
              onClick={() => handleOpenDrawer(index)}
              key={index}
              className="flex items-center md:basis-1/3 lg:basis-1/4 gap-2 ml-2 p-2 rounded-md bg-white w-60 min-w-60 cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col gap-2 justify-between h-full grow">
                <p className="text-sm">{block.title}</p>
                <p className="text-xs text-secondary-foreground/30">
                  Прогресс бар
                </p>
              </div>
              <ChevronRight className="size-4 text-secondary-foreground/30" />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <Drawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        direction={isMobile ? "bottom" : "right"}
      >
        <DrawerContent className="max-h-[85vh] md:max-h-full">
          <DrawerHeader className="relative">
            <DrawerTitle>
              {selectedBriefBlock !== null
                ? briefBlocks[selectedBriefBlock].title
                : ""}
            </DrawerTitle>
            <DrawerDescription>
              Заполните информацию для технического задания
            </DrawerDescription>
            <DrawerClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-4"
              >
                <X className="h-4 w-4" />
              </Button>
            </DrawerClose>
          </DrawerHeader>

          <ScrollArea className="flex-1 px-4">
            <div className="space-y-6 pb-6">{renderBriefForm()}</div>
          </ScrollArea>

          <DrawerFooter>
            <div className="flex gap-2 w-full pb-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDrawerOpen(false)}
                className="flex-1"
              >
                Отмена
              </Button>
              <Button
                className="flex-1"
                onClick={() => {
                  const form = document.querySelector("form");
                  if (form) {
                    form.requestSubmit();
                  }
                }}
              >
                Сохранить
              </Button>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default BriefCarousel;
