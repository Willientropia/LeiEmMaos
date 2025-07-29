import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Scale, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-neutral-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 political-primary rounded-lg flex items-center justify-center">
              <Scale className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-xl font-bold text-neutral-900">Lei Em Mãos</h1>
              <p className="text-xs text-neutral-500">Política Transparente</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-neutral-700 hover:text-primary transition-colors">
              Notícias
            </Link>
            <Link href="/politicians" className="text-neutral-700 hover:text-primary transition-colors">
              Políticos
            </Link>
            <Link href="/requests" className="text-neutral-700 hover:text-primary transition-colors">
              Solicitações
            </Link>
            <Link href="/about" className="text-neutral-700 hover:text-primary transition-colors">
              Sobre
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-3">
            <Link href="/politician/dashboard">
              <Button variant="outline" className="hidden md:block">
                Portal do Político
              </Button>
            </Link>
            <Link href="/admin/dashboard">
              <Button>Admin</Button>
            </Link>
            
            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu size={20} />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col space-y-4 mt-6">
                  <Link href="/" className="text-lg font-medium">Notícias</Link>
                  <Link href="/politicians" className="text-lg font-medium">Políticos</Link>
                  <Link href="/requests" className="text-lg font-medium">Solicitações</Link>
                  <Link href="/about" className="text-lg font-medium">Sobre</Link>
                  <div className="pt-4 border-t">
                    <Link href="/politician/dashboard">
                      <Button variant="outline" className="w-full mb-2">
                        Portal do Político
                      </Button>
                    </Link>
                    <Link href="/admin/dashboard">
                      <Button className="w-full">Admin</Button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
