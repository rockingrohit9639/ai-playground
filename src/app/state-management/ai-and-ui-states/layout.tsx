import { AI } from "./action";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <AI>{children}</AI>
      </body>
    </html>
  );
}
