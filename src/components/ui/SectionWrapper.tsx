"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface SectionWrapperProps {
  id?: string;
  className?: string;
  children: ReactNode;
}

export default function SectionWrapper({
  id,
  className = "",
  children,
}: SectionWrapperProps) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className={`px-6 py-24 md:py-32 ${className}`}
    >
      {children}
    </motion.section>
  );
}
