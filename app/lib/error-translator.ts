import { isAxiosError } from "axios";
import type { ApiResult } from "~/types/api";

export const ERROR_CODE_MESSAGES = {
  // Network
  NETWORK_ERROR: "Nie można połączyć się z serwerem. Spróbuj ponownie.",

  // Auth
  AUTH_001: "Nieprawidłowy adres e-mail lub hasło.",
  AUTH_002: "Adres e-mail nie został jeszcze potwierdzony.",
  AUTH_003: "Sesja wygasła. Zaloguj się ponownie.",
  AUTH_004:
    "Konto zostało tymczasowo zablokowane z powodu zbyt wielu nieudanych prób logowania.",
  AUTH_005: "Twoje konto zostało zablokowane.",

  // Validation
  VAL_001: "Przesłane dane są nieprawidłowe.",
  VAL_002: "Nieprawidłowy numer strony.",
  VAL_003: "Nieprawidłowy rozmiar strony.",

  // Common
  COMMON_001: "Ta operacja jest niedozwolona.",
  COMMON_002: "Nie znaleziono żądanego zasobu.",
  COMMON_003: "Nieprawidłowe żądanie.",
  COMMON_004: "Wystąpił wewnętrzny błąd serwera. Spróbuj ponownie później.",
  COMMON_005: "Zbyt wiele żądań. Odczekaj chwilę przed kolejną próbą.",
  COMMON_006: "Podany identyfikator ma nieprawidłowy format.",
  ACCESS_DENIED: "Brak uprawnień do wykonania tej operacji.",

  // User
  USR_001: "Podane imię jest nieprawidłowe.",
  USR_002: "Podane nazwisko jest nieprawidłowe.",
  USR_003: "Opis profilu jest nieprawidłowy.",
  USR_004: "Podany adres e-mail jest nieprawidłowy.",
  USR_005: "Podany adres e-mail jest już zajęty.",
  USR_006: "Nowy adres e-mail jest taki sam jak obecny.",
  USR_007: "Konto z tym adresem e-mail już istnieje.",
  USR_008: "Nie znaleziono użytkownika.",

  // Trip
  TRIP_001: "Podany rok jest nieprawidłowy.",

  // Verification
  VER_001: "Podany kod weryfikacyjny jest nieprawidłowy.",
  VER_002: "Kod weryfikacyjny wygasł. Wygeneruj nowy kod.",
  VER_003: "Przekroczono maksymalną liczbę prób weryfikacji.",

  // Ban / Report
  BAN_001: "Powód zgłoszenia nie może być pusty.",
  BAN_002: "Powód zgłoszenia jest za długi.",
  BAN_003: "Powód zgłoszenia jest za krótki.",
  BAN_004: "Nie znaleziono zgłoszenia.",
  BAN_005: "To zgłoszenie zostało już rozpatrzone.",
  BAN_006: "Ten użytkownik jest już zbanowany.",
  BAN_007: "Podany czas trwania blokady jest nieprawidłowy.",
  BAN_008: "Wybrany czas trwania blokady jest niedozwolony.",
  BAN_009: "Ten użytkownik nie posiada aktywnej blokady.",
} as const satisfies Record<string, string>;

export type ErrorCode = keyof typeof ERROR_CODE_MESSAGES;

export function translateErrorCode(
  code: string | null | undefined,
): string | null {
  if (!code) return null;
  return ERROR_CODE_MESSAGES[code as ErrorCode] ?? null;
}

export function getApiErrorMessage(
  error: unknown,
  fallbackMessage = "Wystąpił nieoczekiwany błąd.",
): string {
  if (isAxiosError<ApiResult>(error)) {
    const apiData = error.response?.data;
    const translated = translateErrorCode(apiData?.errorCode);

    if (translated) {
      return translated;
    }

    if (apiData?.message) {
      return apiData.message;
    }

    if (error.message) {
      return error.message;
    }
  } else if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallbackMessage;
}

export function getApiValidationErrors(error: unknown): string[] {
  if (!isAxiosError<ApiResult>(error)) return [];
  return error.response?.data?.errors ?? [];
}
