"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import type { ProjectListItem } from "@/components/studio/types";

export function ProjectThumbnail({
  project,
  className,
}: {
  project: ProjectListItem;
  className?: string;
}) {
  const fallbackUrl = useMemo(
    () =>
      `/api/thumbnail?app=${encodeURIComponent(project.appId)}&file=${encodeURIComponent("public/thumbnail.svg")}`,
    [project.appId],
  );
  const [src, setSrc] = useState(project.thumbnailUrl);

  useEffect(() => {
    setSrc(project.thumbnailUrl);
  }, [project.thumbnailUrl]);

  return (
    <Image
      src={src}
      alt={`${project.title} thumbnail`}
      fill
      unoptimized
      sizes="(min-width: 1024px) 50vw, 100vw"
      className={className}
      onError={() =>
        setSrc((current) => (current === fallbackUrl ? current : fallbackUrl))
      }
    />
  );
}
