import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n'
import App from './App.jsx'
import { ToastBar, Toaster } from 'react-hot-toast'
import { EVENT_ENDED_TOAST_MESSAGES } from './utils/translateResponse'

const eventEndedToastMessages = new Set(Object.values(EVENT_ENDED_TOAST_MESSAGES));
const eventEndedImportantMessages = [
  'Sự kiện FPTU Halloween 2026 đã kết thúc.',
  'The FPTU Halloween 2026 event has ended.',
  'FPTUハロウィン2026のイベントは終了しました。',
];

const renderEventEndedMessage = (toast, message) => {
  const fullMessage = String(toast.message);
  const importantMessage = eventEndedImportantMessages.find((value) =>
    fullMessage.startsWith(value),
  );

  if (!importantMessage) return message;

  return (
    <span style={{ display: 'inline-flex', flexWrap: 'wrap', gap: '0.25rem' }}>
      <strong style={{ color: 'var(--color-toast-error)', fontWeight: 800 }}>
        {importantMessage}
      </strong>
      <span>{fullMessage.slice(importantMessage.length)}</span>
    </span>
  );
};

const toastOptions = {
  style: {
    color: 'var(--color-toast-text)',
    background: 'var(--color-toast-background)',
    border: '1px solid var(--color-toast-border)',
    boxShadow: 'var(--color-toast-shadow)',
  },
  success: {
    iconTheme: {
      primary: 'var(--color-toast-success)',
      secondary: 'var(--color-toast-background)',
    },
  },
  error: {
    duration: 7000,
    iconTheme: {
      primary: 'var(--color-toast-error)',
      secondary: 'var(--color-toast-background)',
    },
  },
  loading: {
    iconTheme: {
      primary: 'var(--color-toast-loading)',
      secondary: 'var(--color-toast-loading-track)',
    },
  },
}

createRoot(document.getElementById('root')).render(
  <>
    <App />
    <Toaster position="top-center" toastOptions={toastOptions}>
      {(toast) => (
        <ToastBar toast={toast}>
          {({ icon, message }) => (
            <>
              {!eventEndedToastMessages.has(String(toast.message)) && icon}
              {eventEndedToastMessages.has(String(toast.message))
                ? renderEventEndedMessage(toast, message)
                : message}
            </>
          )}
        </ToastBar>
      )}
    </Toaster>
  </>,
)
