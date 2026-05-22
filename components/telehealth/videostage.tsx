"use client";

import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function VideoStage({ children }: Props) {
  return (
    <section
      className="
        relative
        h-[60vh]
        md:h-[65vh]
        overflow-hidden
        pt-16
      "
    >
      {children}
    </section>
  );
}