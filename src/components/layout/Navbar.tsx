"use client";

import { useState } from "react";
import { siteConfig } from "@/config/site";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="site-header">
      <nav className="navbar container" aria-label="Primary navigation">
        <a className="wordmark" href="#hero" onClick={() => setIsOpen(false)}>
          <span className="wordmark-name">Mouriya</span>
        </a>
        <button
          className="menu-toggle"
          type="button"
          aria-expanded={isOpen}
          aria-controls="primary-navigation"
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setIsOpen((open) => !open)}
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
        <div id="primary-navigation" className={`nav-links${isOpen ? " is-open" : ""}`}>
          {siteConfig.navigation.map((item) => (
            <a key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
              {item.label}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}
