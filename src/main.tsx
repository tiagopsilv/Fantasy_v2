// D:\Fantasy_2\src\main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { ThemeProvider } from "@/components/ui/theme-provider";
import "./styles/globals.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    {/* Provider de tema global da aplicação */}
    <ThemeProvider defaultTheme="system" storageKey="fantasy-theme">
      {/* Roteador raiz que entrega as páginas:
          - /criar-liga      -> CriarLigaPage
          - /escalar-time    -> EscalarTimePage
      */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);
