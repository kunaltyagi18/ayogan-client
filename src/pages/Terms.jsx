import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

export default function Terms() {
  const { isDark } = useTheme();
  return (
    <section className={`min-h-screen px-6 py-16 ${isDark ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <article className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-sm dark:bg-gray-800">
        <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">Ayojan</p>
        <h1 className="mt-2 text-4xl font-bold">Terms of Service</h1>
        <p className="mt-4 leading-7 opacity-80">Use Ayojan responsibly for discovering, hosting, and registering for college events. Event details are supplied by organizers, who are responsible for keeping their listings accurate.</p>
        <h2 className="mt-8 text-2xl font-semibold">Accounts and registrations</h2>
        <p className="mt-3 leading-7 opacity-80">Keep your account details secure and provide accurate registration information. Do not misuse event capacity, upload harmful content, or access another user’s account.</p>
        <h2 className="mt-8 text-2xl font-semibold">Content and changes</h2>
        <p className="mt-3 leading-7 opacity-80">Organizers may update or cancel events. Ayojan may moderate content that violates campus policy or these terms.</p>
      </article>
    </section>
  );
}
