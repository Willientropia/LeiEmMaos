import { Scale } from "lucide-react";
import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-white">
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 political-primary rounded-lg flex items-center justify-center">
                <Scale className="text-white" size={20} />
              </div>
              <div>
                <h4 className="text-xl font-bold">Lei Em Mãos</h4>
                <p className="text-neutral-400 text-sm">Política Transparente</p>
              </div>
            </div>
            <p className="text-neutral-300 leading-relaxed max-w-md">
              Conectando cidadãos e políticos para uma democracia mais transparente e participativa. 
              Acompanhe, questione e participe da política brasileira.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h5 className="font-semibold mb-4">Links Rápidos</h5>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-neutral-300 hover:text-white transition-colors">
                  Notícias
                </Link>
              </li>
              <li>
                <Link href="/politicians" className="text-neutral-300 hover:text-white transition-colors">
                  Políticos
                </Link>
              </li>
              <li>
                <Link href="/requests" className="text-neutral-300 hover:text-white transition-colors">
                  Solicitações
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-neutral-300 hover:text-white transition-colors">
                  Como Funciona
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h5 className="font-semibold mb-4">Legal</h5>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-neutral-300 hover:text-white transition-colors">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-neutral-300 hover:text-white transition-colors">
                  Privacidade
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-neutral-300 hover:text-white transition-colors">
                  Cookies
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-neutral-300 hover:text-white transition-colors">
                  Contato
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-700 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-neutral-400 text-sm">
            © 2024 Lei Em Mãos. Todos os direitos reservados.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <span className="text-neutral-400 text-sm">Siga-nos:</span>
            <a href="#" className="text-neutral-400 hover:text-white transition-colors">
              <i className="fab fa-twitter"></i>
            </a>
            <a href="#" className="text-neutral-400 hover:text-white transition-colors">
              <i className="fab fa-facebook"></i>
            </a>
            <a href="#" className="text-neutral-400 hover:text-white transition-colors">
              <i className="fab fa-instagram"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
