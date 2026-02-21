// frontend/src/components/Footer.jsx
import { useMemo } from "react";

const ADMIN_WHATSAPP_NUMBER = "9955XXXXXXXX"; // ✅ Put number in international format, NO "+"
const SUPPORT_EMAIL = "support@yourdomain.ge";
const SUPPORT_PHONE = "+995 5XX XX XX XX"; // optional (display only)
const COMPANY_NAME = "Your Shop";
const ADDRESS = "Tbilisi, Georgia"; // optional

function buildWhatsAppLink(phone, text) {
  const msg = encodeURIComponent(text || "");
  // wa.me works on mobile (opens app if installed) and web otherwise
  return `https://wa.me/${phone}${msg ? `?text=${msg}` : ""}`;
}

export default function Footer() {
  const year = new Date().getFullYear();

  const whatsappHref = useMemo(() => {
    return buildWhatsAppLink(
      ADMIN_WHATSAPP_NUMBER,
      "Hello! I need help with my order."
    );
  }, []);

  return (
    <footer className="mt-12 border-t border-gray-200 bg-lime-50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Brand */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-lime-500" />
              <div className="text-lg font-bold text-zinc-900">{COMPANY_NAME}</div>
            </div>
            <p className="text-sm text-gray-600">
              Fast support, clear answers, minimal drama.
            </p>

            {ADDRESS && (
              <div className="text-sm text-gray-500">
                <span className="font-medium text-gray-700">Address:</span>{" "}
                {ADDRESS}
              </div>
            )}
          </div>

          {/* Support */}
          <div className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Support
            </div>

            {/* WhatsApp */}
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center justify-between rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 transition hover:border-lime-300 hover:bg-lime-300/20"
            >
              <div className="flex items-center gap-3">
                <WhatsAppIcon />
                <div>
                  <div className="text-sm font-semibold text-zinc-900">
                    WhatsApp
                  </div>
                  <div className="text-xs text-gray-600">
                    Chat with admin
                  </div>
                </div>
              </div>
              <span className="text-xs font-semibold text-gray-500 group-hover:text-zinc-900">
                Open →
              </span>
            </a>

            {/* Email */}
            <a
              href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
                "Support request"
              )}`}
              className="group flex items-center justify-between rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 transition hover:border-lime-300 hover:bg-lime-300/20"
            >
              <div className="flex items-center gap-3">
                <MailIcon />
                <div>
                  <div className="text-sm font-semibold text-zinc-900">Email</div>
                  <div className="text-xs text-gray-600">{SUPPORT_EMAIL}</div>
                </div>
              </div>
              <span className="text-xs font-semibold text-gray-500 group-hover:text-zinc-900">
                Write →
              </span>
            </a>

            {/* Phone (optional) */}
            {SUPPORT_PHONE && (
              <a
                href={`tel:${SUPPORT_PHONE.replace(/\s+/g, "")}`}
                className="group flex items-center justify-between rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 transition hover:border-lime-300 hover:bg-lime-300/20"
              >
                <div className="flex items-center gap-3">
                  <PhoneIcon />
                  <div>
                    <div className="text-sm font-semibold text-zinc-900">Phone</div>
                    <div className="text-xs text-gray-600">{SUPPORT_PHONE}</div>
                  </div>
                </div>
                <span className="text-xs font-semibold text-gray-500 group-hover:text-zinc-900">
                  Call →
                </span>
              </a>
            )}
          </div>

          {/* Quick links / info */}
          <div className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
              Info
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-4">
              <div className="text-sm font-semibold text-zinc-900">
                Working hours
              </div>
              <div className="mt-1 text-sm text-gray-600">
                Mon–Sat: 10:00–20:00 <br />
                Sun: 12:00–18:00
              </div>

              <div className="mt-4 text-xs text-gray-500">
                For fastest help, use WhatsApp.
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs text-gray-500">
            © {year} {COMPANY_NAME}. All rights reserved.
          </div>

          <div className="flex flex-wrap gap-2">
            <a
              href="/privacy"
              className="text-xs font-medium text-gray-600 hover:text-zinc-900"
            >
              Privacy
            </a>
            <span className="text-gray-300">•</span>
            <a
              href="/terms"
              className="text-xs font-medium text-gray-600 hover:text-zinc-900"
            >
              Terms
            </a>
            <span className="text-gray-300">•</span>
            <a
              href="/shipping"
              className="text-xs font-medium text-gray-600 hover:text-zinc-900"
            >
              Shipping
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ---------- Icons (no extra libs) ---------- */
function WhatsAppIcon() {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-lime-300/40">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 2a10 10 0 0 0-8.66 15l-1.2 4.4 4.52-1.18A10 10 0 1 0 12 2Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="M9.4 9.4c.2-.5.4-.5.6-.5h.6c.2 0 .4 0 .5.4l.7 1.7c.1.3.1.5-.1.7l-.4.5c-.1.1-.2.3 0 .6.2.3.7 1.1 1.6 1.8.9.7 1.6 1 2 1.2.3.1.5 0 .6-.1l.7-.8c.2-.2.4-.2.7-.1l1.7.8c.3.1.5.3.5.5 0 .3-.1.9-.6 1.3-.5.4-1.1.6-1.5.6-.4 0-1 0-2.3-.6-1.3-.6-2.9-1.8-4-3.5-1-1.7-1.1-2.5-1.1-3 0-.5.1-1.1.3-1.5Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}

function MailIcon() {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-lime-300/40">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path
          d="M4 6h16v12H4V6Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <path
          d="m4 7 8 6 8-6"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function PhoneIcon() {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-lime-300/40">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path
          d="M8 3h3l1 5-2 1c1 3 3 5 6 6l1-2 5 1v3c0 1-1 2-2 2-9 0-16-7-16-16 0-1 1-2 2-2Z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}