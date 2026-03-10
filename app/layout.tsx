import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ClientLayout from '@/components/ClientLayout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Fortunna Inmobiliaria - Encuentra el terreno de tus sueños',
  description: 'Tu aliado confiable en bienes raíces..',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <ClientLayout>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </ClientLayout>
      </body>
    </html>
  );
}
