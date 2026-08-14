"use client";

import * as React from "react";
import { motion, useMotionValueEvent, useScroll, type Variants } from "framer-motion";
import { Building2, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Início", href: "#inicio" },
  { name: "Unidades", href: "#unidades" },
  { name: "Tour 3D", href: "#inicio" },
  { name: "Localização", href: "#localizacao" },
];

const containerVariants: Variants = {
  expanded: {
    width: "auto",
    transition: { type: "spring", damping: 22, stiffness: 280, staggerChildren: 0.06, delayChildren: 0.12 },
  },
  collapsed: {
    width: "3rem",
    transition: { type: "spring", damping: 22, stiffness: 300, when: "afterChildren", staggerChildren: 0.04, staggerDirection: -1 },
  },
};

const itemVariants: Variants = {
  expanded: { opacity: 1, x: 0, scale: 1, transition: { type: "spring", damping: 17 } },
  collapsed: { opacity: 0, x: -14, scale: 0.96, transition: { duration: 0.16 } },
};

const logoVariants: Variants = {
  expanded: { opacity: 1, x: 0, rotate: 0, transition: { type: "spring", damping: 16 } },
  collapsed: { opacity: 0, x: -18, rotate: -90, transition: { duration: 0.2 } },
};

export function AnimatedNavFramer() {
  const [isExpanded, setExpanded] = React.useState(true);
  const { scrollY } = useScroll();
  const lastScrollY = React.useRef(0);
  const collapsedAt = React.useRef(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = lastScrollY.current;
    if (isExpanded && latest > previous && latest > 150) {
      setExpanded(false);
      collapsedAt.current = latest;
    } else if (!isExpanded && latest < previous && collapsedAt.current - latest > 70) {
      setExpanded(true);
    }
    lastScrollY.current = latest;
  });

  return (
    <div className="fixed left-1/2 top-5 z-50 -translate-x-1/2">
      <motion.nav
        aria-label="Navegação principal"
        initial={{ y: -70, opacity: 0 }}
        animate={isExpanded ? "expanded" : "collapsed"}
        variants={containerVariants}
        whileHover={!isExpanded ? { scale: 1.08 } : undefined}
        whileTap={!isExpanded ? { scale: 0.96 } : undefined}
        onClick={() => { if (!isExpanded) setExpanded(true); }}
        className={cn(
          "animated-nav relative flex h-12 items-center overflow-hidden rounded-full border border-neutral-300/80 bg-white/85 text-neutral-900 shadow-[0_12px_45px_rgba(0,0,0,.11)] backdrop-blur-xl",
          !isExpanded && "cursor-pointer justify-center",
        )}
      >
        <motion.div variants={logoVariants} className="flex shrink-0 items-center gap-2 pl-4 pr-3 font-semibold">
          <Building2 className="h-5 w-5" strokeWidth={1.7} />
          <span className="whitespace-nowrap text-xs tracking-[-.02em]">Kitnets Beta</span>
        </motion.div>

        <motion.div className={cn("flex items-center gap-0.5 pr-3 sm:gap-2", !isExpanded && "pointer-events-none")}>
          {navItems.map((item) => (
            <motion.a
              key={item.name}
              href={item.href}
              variants={itemVariants}
              onClick={(event) => event.stopPropagation()}
              className="whitespace-nowrap px-2 py-1 text-[11px] font-semibold text-neutral-500 transition-colors hover:text-neutral-950 sm:text-xs"
            >
              {item.name}
            </motion.a>
          ))}
        </motion.div>

        <div className="pointer-events-none absolute inset-0 grid place-items-center">
          <motion.div
            variants={{ expanded: { opacity: 0, scale: 0.75 }, collapsed: { opacity: 1, scale: 1, transition: { delay: 0.12, type: "spring", damping: 16 } } }}
          >
            <Menu className="h-5 w-5" />
          </motion.div>
        </div>
      </motion.nav>
    </div>
  );
}
