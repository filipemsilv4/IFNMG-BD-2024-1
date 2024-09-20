"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-white text-xl font-bold">
            AvatarSucks
          </Link>
          <div className="hidden md:flex space-x-4">
            <NavLink href="/insere_colonia">CriaColonia</NavLink>
            <NavLink href="/edita_colonia">EditaColonia</NavLink>
            <NavLink href="/explorador">Explorador</NavLink>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Menu className="h-6 w-6 text-white" />
          </Button>
        </div>
        {isOpen && (
          <div className="mt-4 space-y-2 md:hidden">
            <NavLink href="/colonia" mobile>Colonia</NavLink>
            <NavLink href="/explorador" mobile>Explorador</NavLink>
          </div>
        )}
      </div>
    </nav>
  );
}

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  mobile?: boolean;
}

function NavLink({ href, children, mobile = false }: NavLinkProps) {
  const baseClasses = "text-white hover:text-gray-300 transition-colors duration-200";
  const mobileClasses = mobile ? "block py-2" : "";

  return (
    <Link href={href} className={`${baseClasses} ${mobileClasses}`}>
      {children}
    </Link>
  );
}