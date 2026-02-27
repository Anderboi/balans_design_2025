"use client";

import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SlashIcon } from "lucide-react";

interface ProjectBreadcrumbsProps {
  projectId: string;
  projectName: string;
  currentPage: string;
  middleLink?: {
    href: string;
    label: string;
  };
}

export function ProjectBreadcrumbs({
  projectId,
  projectName,
  currentPage,
  middleLink,
}: ProjectBreadcrumbsProps) {
  return (
    <Breadcrumb className="animate-in fade-in slide-in-from-top-1 duration-500">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link
              href={`/projects/${projectId}`}
              className="hover:text-[#1D1D1F] transition-colors duration-200"
            >
              {projectName}
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbSeparator>
          <SlashIcon className="size-3 text-zinc-300" />
        </BreadcrumbSeparator>

        {middleLink && (
          <>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  href={middleLink.href}
                  className="hover:text-[#1D1D1F] transition-colors duration-200"
                >
                  {middleLink.label}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <SlashIcon className="size-3 text-zinc-300" />
            </BreadcrumbSeparator>
          </>
        )}

        <BreadcrumbItem>
          <BreadcrumbPage className="font-semibold text-[#1D1D1F]">
            {currentPage}
          </BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
