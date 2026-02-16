# Specification

## Summary
**Goal:** Build an authenticated OTC screenshot analysis dashboard that extracts features from a chart image, lets the user review/correct them, generates a 1‑minute CALL/PUT/NO TRADE signal with confidence, and tracks outcomes and performance over time.

**Planned changes:**
- Add Internet Identity sign-in/out and load/save per-user analysis history and stats.
- Implement single-image screenshot upload with validation, preview, and a capped history queue (last 20) with reopenable prior results.
- Run vision-based extraction on uploaded screenshots to derive structured candle/indicator features; provide a Review & Confirm step with editable fields and manual entry when extraction is incomplete.
- Implement a 1-minute strategy signal engine (Color Follows Color momentum, Trap Wick Reversal, candle-classification filters) producing CALL/PUT/NO TRADE plus confidence and contributing-rationale tags.
- Restrict asset selection to EUR/USD OTC and USD/JPY OTC and persist the chosen asset with each analysis.
- Add a multi-timeframe confluence dashboard for S30, M1, and M5 with an overall confluence state, stored per session.
- Add a risk calculator enforcing 2% risk per trade and a configurable daily stop-loss; block marking additional signals as taken once the daily limit is hit.
- Add win/loss tracking per history item (Win/Loss/Not Taken/Unknown) and live performance stats (win-rate on taken trades, totals, streaks) persisted per user.
- Add a “00-second” 1-minute candle timer with visual countdown and optional sound alert toggle.
- Apply a consistent English trading-dashboard theme (avoid blue/purple as primary colors) and use locally-served generated static assets (logo + signal icons + background texture).

**User-visible outcome:** A signed-in user can upload an OTC chart screenshot, review/correct extracted candle/indicator fields, confirm to generate a 1-minute CALL/PUT/NO TRADE signal with confidence and confluence view, track outcomes and performance in a persistent history, use a risk/stops calculator, and follow a candle-open countdown with optional sound.
