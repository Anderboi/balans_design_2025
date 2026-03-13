"use client";

import { ProjectBreadcrumbs } from "./project-breadcrumbs";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import Link from "next/link";

interface ProjectPageHeaderProps {
  projectId: string;
  projectName: string;
  title: string;
  middleLink?: {
    href: string;
    label: string;
  };
  actionProps?: {
    label: string;
    onClick?: () => void;
    href?: string;
    icon?: React.ReactNode;
  };
  showAiButton?: boolean;
  children?: React.ReactNode;
}

export function ProjectPageHeader({
  projectId,
  projectName,
  title,
  middleLink,
  actionProps,
  showAiButton = false,
  children,
}: ProjectPageHeaderProps) {
  return (
    <div className="space-y-6">
      <ProjectBreadcrumbs
        projectId={projectId}
        projectName={projectName}
        currentPage={title}
        middleLink={middleLink}
      />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl md:text-5xl font-semibold text-[#1D1D1F] tracking-tight animate-in fade-in slide-in-from-left-2 duration-700">
          {title}
        </h1>

        <div className="flex items-center gap-3 animate-in fade-in zoom-in-95 duration-700 delay-100">
          {actionProps &&
            (actionProps.href ? (
              <Button
                asChild
                className="rounded-full bg-[#1D1D1F] hover:bg-black text-white px-6 h-11 transition-all duration-300 shadow-sm"
              >
                <Link href={actionProps.href}>
                  {actionProps.icon && (
                    <span className="mr-2">{actionProps.icon}</span>
                  )}
                  {actionProps.label}
                </Link>
              </Button>
            ) : (
              <Button
                onClick={actionProps.onClick}
                className="rounded-full bg-[#1D1D1F] hover:bg-black text-white px-6 h-11 transition-all duration-300 shadow-sm"
              >
                {actionProps.icon && (
                  <span className="mr-2">{actionProps.icon}</span>
                )}
                {actionProps.label}
              </Button>
            ))}

          {children}

          {showAiButton && (
            <Button className="rounded-full h-11 px-6 bg-[#D81A24] hover:bg-[#B5151D] text-white shadow-lg shadow-red-200/50 transition-all duration-300 font-medium flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Спросить Balans AI
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
