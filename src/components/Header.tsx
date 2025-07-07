import { useState } from "react";
import { Link } from "react-router-dom";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-gray-900 text-white shadow-md">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xl font-bold tracking-tight">
          <img src="/logo.png" alt="Logo ETTU" className="h-8 w-8" />
          <Link to="/">ETTU</Link>
        </div>

        {/* Desktop menu */}
        <ul className="hidden md:flex gap-6 items-center text-sm font-medium">
          <li>
            <Link to="/notes" className="hover:underline">
              Notes
            </Link>
          </li>
          <li>
            <Link to="/snippets" className="hover:underline">
              Snippets
            </Link>
          </li>
          <li>
            <Link to="/tasks" className="hover:underline">
              Tâches
            </Link>
          </li>
          <li>
            <Link to="/projects" className="hover:underline">
              Projets
            </Link>
          </li>
        </ul>

        {/* Mobile hamburger */}
        <button
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Ouvrir le menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-800 px-4 pb-4">
          <ul className="flex flex-col gap-2 text-sm">
            <li>
              <Link to="/notes">Notes</Link>
            </li>
            <li>
              <Link to="/snippets">Snippets</Link>
            </li>
            <li>
              <Link to="/tasks">Tâches</Link>
            </li>
            <li>
              <Link to="/projects">Projets</Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
