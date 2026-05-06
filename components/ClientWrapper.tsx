"use client";

import { PropsWithChildren, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";

// Section observation for active tab updates
const sections = ["home", "about", "services", "contact", "FAQS"];

const ClientWrapper = ({ children }: PropsWithChildren) => {
  const [navHeight, setNavHeight] = useState(0);
  return (
    <>
      <Header onHeightChange={setNavHeight} sections={sections} />
      <main style={{ paddingTop: navHeight }}>{children}</main>
      <Footer sections={sections} />
    </>
  );
};

export default ClientWrapper;
