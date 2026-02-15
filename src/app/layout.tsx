import type { Metadata } from "next";
import "./globals.css"; // Se você tiver um CSS global

export const metadata: Metadata = {
    title: "EventSubs - Hackathon",
    description: "Gerenciamento de eventos simplificado",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="pt-br">
            <body className="antialiased">
                {/* Aqui você pode colocar um Navbar fixo se quiser */}
                {children}
            </body>
        </html>
    );
}