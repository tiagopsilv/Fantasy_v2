import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { NavigationMenu, type NavigationRoute } from "@/components/NavigationMenu";
import { Separator } from "@/components/ui/separator";

export default function Layout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Deriva a rota atual do pathname e converte para o tipo esperado pelo NavigationMenu
  const currentRoute = useMemo<NavigationRoute>(() => {
    // Se o seu NavigationRoute for 'criar' | 'escalar', este mapping cobre.
    // Se for 'criar-liga' | 'escalar-time', também cobre com o cast.
    if (pathname.startsWith("/escalar-time")) {
      return ("escalar-time" as unknown) as NavigationRoute;
    }
    return ("criar-liga" as unknown) as NavigationRoute;
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* 🔝 Cabeçalho compartilhado */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <NavigationMenu
            currentRoute={currentRoute}
            onNavigate={(route: NavigationRoute) => {
              // Navega para a rota correspondente independente do literal usado no tipo
              if ((route as unknown) === "criar" || (route as unknown) === "criar-liga") {
                navigate("/criar-liga");
              } else {
                navigate("/escalar-time");
              }
            }}
          />
        </div>
        <Separator />
      </header>

      {/* 📄 Conteúdo dinâmico (rota ativa) */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6">
        <Outlet />
      </main>

      {/* ⚙️ Rodapé simples */}
      <footer className="border-t mt-8">
        <div className="max-w-7xl mx-auto px-4 py-4 text-xs text-muted-foreground text-center">
          © {new Date().getFullYear()} Fantasy Manager · Todos os direitos reservados
        </div>
      </footer>
    </div>
  );
}
