import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  BOOKING_DRAFT_STORAGE_KEY,
  DEFAULT_LANGUAGE,
  LANGUAGE_STORAGE_KEY,
} from "../utils/constants";
import {
  type BookingDraft,
  EMPTY_BOOKING_DRAFT,
  type LanguageCode,
  LanguagePreference,
} from "../utils/types";

interface AppState {
  /** Current UI language (defaults to Hindi). */
  language: LanguageCode;
  /** Draft booking form state, persisted across pages. */
  bookingDraft: BookingDraft;

  setLanguage: (language: LanguageCode) => void;
  toggleLanguage: () => void;
  setBookingDraft: (draft: Partial<BookingDraft>) => void;
  resetBookingDraft: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      language: DEFAULT_LANGUAGE,
      bookingDraft: { ...EMPTY_BOOKING_DRAFT },

      setLanguage: (language) => set({ language }),
      toggleLanguage: () =>
        set({ language: get().language === "hi" ? "en" : "hi" }),
      setBookingDraft: (draft) =>
        set({ bookingDraft: { ...get().bookingDraft, ...draft } }),
      resetBookingDraft: () =>
        set({ bookingDraft: { ...EMPTY_BOOKING_DRAFT } }),
    }),
    {
      name: "priest-site-store",
      // Persist only the language and booking draft under their own keys
      // for backward-compatible localStorage access.
      partialize: (state) => ({
        language: state.language,
        bookingDraft: state.bookingDraft,
      }),
      storage: {
        getItem: (name) => {
          // Read from the legacy single-key layout if present.
          const lang = localStorage.getItem(LANGUAGE_STORAGE_KEY);
          const draft = localStorage.getItem(BOOKING_DRAFT_STORAGE_KEY);
          const persisted = localStorage.getItem(name);
          if (persisted) return JSON.parse(persisted);
          if (lang || draft) {
            return {
              state: {
                language: (lang as LanguageCode) || DEFAULT_LANGUAGE,
                bookingDraft: draft
                  ? { ...EMPTY_BOOKING_DRAFT, ...JSON.parse(draft) }
                  : { ...EMPTY_BOOKING_DRAFT },
              },
              version: 0,
            };
          }
          return null;
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
          const parsed = JSON.parse(JSON.stringify(value)) as {
            state: AppState;
          };
          localStorage.setItem(LANGUAGE_STORAGE_KEY, parsed.state.language);
          localStorage.setItem(
            BOOKING_DRAFT_STORAGE_KEY,
            JSON.stringify(parsed.state.bookingDraft),
          );
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
          localStorage.removeItem(LANGUAGE_STORAGE_KEY);
          localStorage.removeItem(BOOKING_DRAFT_STORAGE_KEY);
        },
      },
    },
  ),
);

/** Helper to map a UI language code to a backend LanguagePreference. */
export function toLanguagePreference(
  language: LanguageCode,
): (typeof LanguagePreference)[keyof typeof LanguagePreference] {
  return language === "hi"
    ? LanguagePreference.Hindi
    : LanguagePreference.English;
}
