import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { registerLicense } from "@syncfusion/ej2-base";
import {
  ClerkProvider,
  RedirectToSignIn,
  SignedIn,
  SignedOut,
} from "@clerk/clerk-react";
import Nav from "./components/Nav.jsx";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

registerLicense(
  "Ngo9BigBOggjHTQxAR8/V1NCaF1cWWhAYVF+WmFZfVpgcF9EaVZSTGYuP1ZhSXxXdk1hUH9acn1WT2ZVWEY="
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <header>
        <SignedOut>
          <RedirectToSignIn />
        </SignedOut>
        <SignedIn>
          <Nav />
          <App />
        </SignedIn>
      </header>
    </ClerkProvider>
  </StrictMode>
);
