import "./globals.css";

export const metadata = {
  title: "Periyar University | Salem",
  description: "Official Website Clone of Periyar University, Salem",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col m-0 p-0 font-sans text-gray-900 bg-gray-50">
        {children}
      </body>
    </html>
  );
}
