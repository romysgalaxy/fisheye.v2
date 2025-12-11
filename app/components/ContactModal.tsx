"use client";

import { useEffect, useRef, useState } from "react";

type ContactModalProps = {
  isOpen: boolean;
  onClose: () => void;
  photographerName: string;
};

export default function ContactModal({
  isOpen,
  onClose,
  photographerName,
}: ContactModalProps) {
  const firstFieldRef = useRef<HTMLInputElement | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    firstFieldRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Contact form:", {
      firstName,
      lastName,
      email,
      message,
    });
    onClose();
  };

  const handleOverlayClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="modal-overlay"
      role="presentation"
      onClick={handleOverlayClick}
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-modal-title" 
      >
        <header className="modal__header">
          <h1 id="contact-modal-title">
            Contactez-moi
            <br />
            {photographerName}
          </h1>

          <button
            type="button"
            className="modal__close-btn"
            aria-label="Fermer le formulaire de contact"
            onClick={onClose}
          >
            ×
          </button>
        </header>

        <form className="modal__form" onSubmit={handleSubmit}>
          <label className="modal__label">
            Prénom
            <input
              ref={firstFieldRef}
              className="modal__input"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </label>

          <label className="modal__label">
            Nom
            <input
              className="modal__input"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </label>

          <label className="modal__label">
            Email
            <input
              className="modal__input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="modal__label">
            Votre message
            <textarea
              className="modal__textarea"
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </label>

          <button type="submit" className="modal__submit-btn">
            Envoyer
          </button>
        </form>
      </div>
    </div>
  );
}
