"use client";

import ProjectsFilterPage from "@/components/app/projects-filter-page";

export default function Page() {
  return (
    <ProjectsFilterPage
      title="Created by me"
      subtitle="Projects you created."
      filter={(p) => p.createdByMe !== false}
    />
  );
}