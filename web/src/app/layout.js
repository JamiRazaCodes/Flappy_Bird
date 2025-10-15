import "./globals.css";


export const metadata = {
  title: "Flappy Bird",
  description: "Developed By Jami Raza",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className="h-full w-full"
      >
        {children}
      </body>
    </html>
  );
}
