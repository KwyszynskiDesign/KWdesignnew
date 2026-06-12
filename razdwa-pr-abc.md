# RAZDWA app — PR-A, PR-C, PR-B (B.2) gotowe do wklejenia

Pakiet P0 (utrata zamówień). Wszystkie diff-y bazują na cytatach z raportu
ryzyka — finalne linie mogą się przesunąć ±2–3, ale konteksty (`evaluateGasResult`,
`if (result.ok)` w `handleSendOrder`, no-cors fallback) są jednoznaczne.

**Reguły obowiązujące cały pakiet:**
- BLOCKED nietknięte: EXPRESS, `applySummaryPercentAdjustments`, `razdwa_prices_ts`, kolumna „Ekspres".
- Brak nowych ścieżek wyceny.
- Brak zmian w schemacie `razdwa-cart-v1` w localStorage.
- TypeScript + zachowanie istniejących nazw funkcji/pól.

**Kolejność wdrożenia:**
1. PR-A (service)
2. PR-C (UI)
3. PR-B w wariancie B.2 (service + UI)

PR-A i PR-C najlepiej zmergować razem (P0 minimal viable — żaden uncertain
success nie czyści koszyka). PR-B dopiero po nich, bo zależy od gate'u
z PR-C.

---

## PR-A · `evaluateGasResult` odróżnia `body=null` od „body bez pola ok"

### Root cause
`src/services/orderExportService.ts:350–351` przy `httpOk && body === null`
(GAS rzucił exception → odpowiedź `text/html` z kodem 200) zwraca
`ok: true, verified: false`. `main.ts:934` rozgałęzia tylko po `result.ok`,
więc wchodzi w success path — toast OK + (po PR-C) wyczyszczony koszyk.
Zamówienie nie istnieje po stronie Sheets, klient się o tym nie dowie.

### Pliki
- `src/services/orderExportService.ts` (1 funkcja, ~5 linii diff)

### Diff
```diff
*** src/services/orderExportService.ts
@@ evaluateGasResult(...) @@ // tuż przy linii 350
-  // HTTP 200 bez pola ok — uncertain success (np. GAS zwróciło HTML albo pusty JSON)
-  return { ok: true, status: httpStatus, message: fallbackMessage, data: body, verified: false };
+  // HTTP 200 + brak parsowalnego body → najpewniej HTML błędu z catch po stronie GAS.
+  // Nie udajemy sukcesu — koszyk nie powinien się wyczyścić.
+  if (body === null) {
+    return {
+      ok: false,
+      status: httpStatus,
+      verified: false,
+      message: "GAS odpowiedział nie-JSONem (prawdopodobnie HTML błędu z catch po stronie Apps Script)",
+      data: null,
+    };
+  }
+  // HTTP 200 + parsowalne body bez pola ok — uncertain success (zachowane jak było)
+  return { ok: true, status: httpStatus, message: fallbackMessage, data: body, verified: false };
```

### DoD
- [ ] Mock fetch zwracający `Content-Type: text/html`, body = `<html>...</html>`, status 200 → `evaluateGasResult` zwraca `ok: false, verified: false`.
- [ ] Mock fetch zwracający `application/json`, body = `{ foo: "bar" }`, status 200 → `evaluateGasResult` zwraca `ok: true, verified: false` (niezmienione zachowanie).
- [ ] Mock fetch zwracający `{ ok: true }` → niezmieniony sukces.
- [ ] W `main.ts:934` ścieżka `if (result.ok)` nie wejdzie dla nowego case'u → koszyk **nie** schodzi, toast pokazuje błąd.
- [ ] Brak nowych branchy w `main.ts` (PR-A nie dotyka UI).

### Edge cases do potwierdzenia
- Czy `readAppsScriptBody` zwraca `null` także dla pustego stringa (`""`)? Jeśli tak — pole jest pokryte. Jeśli zwraca `""` jako string, dodatkowa gałąź:
  ```ts
  if (body === null || body === "" || (typeof body === "string" && body.trim() === "")) { ... }
  ```

---

## PR-C · `cart.clear()` synchronicznie i tylko przy `verified === true`

### Root cause
`src/ui/main.ts:949` woła `cart.clear()` wewnątrz `setTimeout(..., 3500)`.
Zamknięcie karty w tym oknie → `razdwa-cart-v1` w `localStorage` zachowuje
pozycje, użytkownik widzi koszyk po powrocie i może wysłać po raz drugi.
Drugi problem: brak gate'u na `verified` — po PR-B koszyk zniknąłby też
przy `no-cors` (gdzie nie wiemy czy zamówienie istnieje).

### Pliki
- `src/ui/main.ts` (handler success path w `handleSendOrder`)

### Diff
```diff
*** src/ui/main.ts
@@ if (result.ok) { @@ // ~ linie 934–956
   if (result.ok) {
     // toast i ostrzeżenia jak były
     showOrderLoadingPopup(successMsg, "success");
     if (result.verified === false) {
       showToast(/* ostrzeżenie braku potwierdzenia */, "warning");
     }
-    setTimeout(() => {
-      cart.clear();
-      resetOrderState();
-      clearField("custName");
-      clearField("custPhone");
-      clearField("custEmail");
-      clearField("custNotes");
-      resetSending();
-    }, 3500);
-    return;
+    // Twardy gate: koszyk i stan zamówienia czyścimy NATYCHMIAST,
+    // ale tylko gdy GAS potwierdził zapis (verified: true).
+    // Dla verified=false (uncertain) zostawiamy koszyk — patrz PR-A i PR-B.
+    if (result.verified === true) {
+      cart.clear();
+      resetOrderState();
+    }
+    // UI reset (pola, przyciski) zostaje opóźniony, żeby toast zdążył się pokazać.
+    setTimeout(() => {
+      if (result.verified === true) {
+        clearField("custName");
+        clearField("custPhone");
+        clearField("custEmail");
+        clearField("custNotes");
+      }
+      resetSending();
+    }, 3500);
+    return;
   }
```

### DoD
- [ ] Mock `result = { ok: true, verified: true }` → `cart.clear()` wywołany **przed** `setTimeout` (synchronicznie). Sprawdzić `localStorage.getItem("razdwa-cart-v1")` zaraz po `await sendOrderToAppsScript`.
- [ ] Mock `result = { ok: true, verified: false }` → `cart.clear()` **nie** wywołany. Koszyk pozostaje w `localStorage`. Pola formularza **nie** czyszczone (klient może chcieć ponowić).
- [ ] `resetSending()` zawsze wykonany po 3500 ms (przyciski wracają do stanu enabled).
- [ ] Zamknięcie karty w pierwszej sekundzie po `verified: true` → po powrocie `cart.getItems().length === 0`.
- [ ] Brak regresji w `clearBtn` (main.ts:836) — `cart.clear()` ręczne nadal natychmiastowe.

### Edge cases do potwierdzenia
- Czy `resetOrderState()` zeruje cokolwiek z **wyceny** (rabat/narzut/express)? **BLOCKED** zgodnie z B4 — jeśli tak, lepiej zostawić wywołanie wewnątrz setTimeout, żeby uniknąć kolizji z UI mid-display. Z raportu wynika że tak zeruje. Decyzja: zostawiam `resetOrderState()` po `cart.clear()` synchronicznie, **ale** to mała mutacja stanu (nie rachunek). Jeśli w trakcie review okaże się ryzykowne, przenieść do `setTimeout`.

---

## PR-B (wariant B.2) · `no-cors` fallback zwraca `unverified: true` zamiast udawać sukces

### Root cause
`src/services/orderExportService.ts:409–414` po nieudanym CORS robi
`fetch(..., { mode: "no-cors" })` i zwraca `{ ok: true, status: 0, verified: false }`.
`opaque response` to brak dowodu na cokolwiek — request mógł nie dotrzeć.
`main.ts:934` wchodzi w success path, użytkownik widzi sukces (z warning),
a po PR-C koszyk schodzi tylko gdy `verified === true` — czyli **już teraz**
PR-C zabezpiecza koszyk. Brakuje jednak **jednoznacznej sygnalizacji**
„pending" w wyniku i osobnego brancha UI, żeby pokazać status
„wysłano, czekamy na potwierdzenie".

### Pliki
- `src/services/orderExportService.ts` (typ wyniku + return w fallbacku)
- `src/ui/main.ts` (osobny branch UI dla `unverified`)

### Diff — service
```diff
*** src/services/orderExportService.ts
@@ // tam gdzie zadeklarowany typ wyniku (przy interfejsach na górze pliku) @@
 export interface SendOrderResult {
   ok: boolean;
   status: number;
   verified: boolean;
+  /**
+   * true wyłącznie w fallbacku no-cors: request wysłany, ale odpowiedź jest
+   * opaque i NIE wiemy czy GAS faktycznie zapisał zamówienie.
+   * UI ma traktować to jako "pending" — nie czyścić koszyka, pokazać osobny
+   * komunikat z prośbą o weryfikację w arkuszu.
+   */
+  unverified?: boolean;
   message?: string;
   data?: unknown;
 }

@@ no-cors fallback ~ linie 397–418 @@
   await fetch(endpoint, {
     method: "POST",
     mode: "no-cors",
     headers: { "Content-Type": "text/plain" },
     body: JSON.stringify(payload),
     signal: controller.signal,
   });
   return {
-    ok: true,
+    ok: true,
     status: 0,
     verified: false,
+    unverified: true,
-    message: "Wysłano bez potwierdzenia odpowiedzi (ograniczenia CORS)...",
+    message: "Wysłano bez potwierdzenia odpowiedzi (fallback no-cors). Sprawdź arkusz Sheets — jeśli zamówienia nie ma, wyślij ponownie.",
   };
```

> **Uzasadnienie utrzymania `ok: true`:** zgodnie z B.2 — request wyszedł,
> więc to nie jest błąd „nie udało się wysłać". Sygnalizujemy poprzez
> `unverified: true`, że status zapisu jest nieznany. Logika koszyka jest
> już zabezpieczona przez PR-C (gate na `verified === true`).

### Diff — UI
```diff
*** src/ui/main.ts
@@ if (result.ok) { @@ // ten sam blok co w PR-C, dokładamy gałąź unverified
   if (result.ok) {
-    showOrderLoadingPopup(successMsg, "success");
-    if (result.verified === false) {
-      showToast(/* warning braku potwierdzenia */, "warning");
+    if (result.unverified === true) {
+      // Pending — request wyszedł, ale GAS nie potwierdził zapisu.
+      // Nie czyścimy koszyka (gate w PR-C już to zapewnia, tutaj tylko UI).
+      showOrderLoadingPopup(
+        "Zamówienie wysłane, ale odpowiedź serwera nie została potwierdzona. " +
+        "Sprawdź arkusz — jeśli zamówienia brak, wyślij ponownie.",
+        "warning"
+      );
+    } else {
+      showOrderLoadingPopup(successMsg, "success");
+      if (result.verified === false) {
+        showToast(/* warning braku potwierdzenia — istniejący tekst */, "warning");
+      }
     }
     // … gate cart.clear()/resetOrderState() z PR-C zostaje BEZ ZMIAN
     if (result.verified === true) {
       cart.clear();
       resetOrderState();
     }
     setTimeout(() => {
       if (result.verified === true) {
         clearField("custName");
         clearField("custPhone");
         clearField("custEmail");
         clearField("custNotes");
       }
       resetSending();
     }, 3500);
     return;
   }
```

### DoD
- [ ] Typ `SendOrderResult` ma opcjonalne pole `unverified?: boolean`. TypeScript kompiluje bez błędów w plikach konsumentach (`main.ts`, ewentualne testy).
- [ ] no-cors fallback zwraca `{ ok: true, verified: false, unverified: true }`.
- [ ] Mock CORS rzucający `TypeError: Failed to fetch` → fallback no-cors aktywuje się → `main.ts` pokazuje **pomarańczowy** „pending" popup, **nie** zielony success.
- [ ] Mock CORS zwracający `{ ok: true }` → ścieżka success, `unverified` nieustawione, koszyk czyszczony (PR-C).
- [ ] Mock CORS zwracający `{ ok: false }` → ścieżka błędu (`if (result.ok)` false), koszyk nietknięty.
- [ ] Brak zmian w `fetchWithRetry`, `evaluateGasResult` (poza PR-A), `cart.ts`, `cart-v1` schemacie localStorage.
- [ ] Po B.2: dla użytkownika **żaden** scenariusz nie kończy się utratą koszyka bez potwierdzenia od GAS.

### Edge cases do potwierdzenia
- Czy `showOrderLoadingPopup` przyjmuje wariant `"warning"`? Jeśli ma tylko `"success"|"error"`, użyj `showToast(..., "warning")` plus zwykłego `showOrderLoadingPopup(..., "success")` z innym tekstem — z raportu wynika że oba istnieją.
- Czy AbortError przy timeoucie wywoła fallback no-cors, czy od razu wyląduje w `catch`? Z raportu (linie 397–418) wygląda że fallback ma swój własny `try` po pierwszym `catch`. Sprawdź to — jeśli AbortError leci wyżej, no-cors się nie aktywuje i temat nie istnieje (tylko throw).

---

## Kolejność i niezależność

```
PR-A (service)  ─────────►  można merge'ować osobno, bez UI
                            (zmienia tylko ścieżkę wyniku — main.ts już ją obsługuje)

PR-C (UI)       ─────────►  niezależny od PR-A,
                            ale ma sens wdrażać razem (gate na verified
                            zabezpiecza wszystkie warianty)

PR-B (B.2)      ─────────►  zależy od PR-C
                            (bez gate'u koszyk schodziłby na unverified)
```

Sugeruję dwie tury merge'y:
1. **PR-A + PR-C razem** (P0 minimal viable — żaden uncertain success nie czyści koszyka).
2. **PR-B** osobno (dodaje pending UX + wyraźny sygnał no-cors).

---

## Czego **nie** ma w tym pakiecie

Per ustalenia z poprzedniej wiadomości:
- **Brak PR-D** (persystencja formularza) — następny krok.
- **Brak PR-E** (beforeunload) — następny krok.
- **Brak PR-F serwis historii** — po P0. Wymaga osobnej sesji projektowej.
- **Brak PR-G** (idempotency key) — czeka na L1 (kontrakt GAS).
- **Brak PR-H, PR-I** — P2.
- **Brak dryRun badge** — odroczone.
- **BLOCKED nietknięte**: EXPRESS, `applySummaryPercentAdjustments`, `razdwa_prices_ts`, kolumna „Ekspres" w payloadzie.

---

## Prompt do sesji z repo RAZDWA

> Implementuj PR-A, PR-C i PR-B w wariancie B.2 zgodnie z planem w
> `razdwa-pr-abc.md` (z repo `kwdesignnew`). Kolejność: PR-A → PR-C → PR-B.
> Każdy PR osobno, po każdym: root cause, lista plików, DoD.
> Nic z BLOCKED. Bez ruszania cennika i EXPRESS.
