import "../styles/global.css";
import Provider from "@components/Provider";
import Nav from "@components/Nav";
import { ToastContainer } from "react-toastify";

export const metadata = {
  title: "VibeDev | Share AI Prompts",
  description:
    "A community platform for developers to share and discover AI prompts for better vibe coding.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#0e0e10] text-[#e8e8e8] min-h-screen antialiased">
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          // transition={Bounce}
        />
        <Provider>
          <Nav />
          <main className="max-w-5xl mx-auto px-4 pt-20 pb-16">{children}</main>
        </Provider>
      </body>
    </html>
  );
}
