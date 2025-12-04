import "./globals.css";


export const metadata = {
  title: "Flappy Flap",
  description: "Developed By Jami Raza",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className="h-full w-full"
      >

        <img src="/cloud1.png" className="cloud" />
        <img src="/cloud2.png" className="cloud" />
        <img src="/cloud3.png" className="cloud" />
        <img src="/cloud4.png" className="cloud" />
        <img src="/cloud5.png" className="cloud" />
        {children}
      </body>
    </html>
  );
}
