# SENSOTECH V2 — Master Product Specification

## Product
SENSOTECH is a farmer-first personal farm intelligence, decision, and income platform.

**Principle:** deep intelligence inside, extremely simple outside.

The farmer-facing product should expose a small number of primary destinations while hundreds of backend capabilities remain available through workflows.

## Initial scale target
- Production target: 1,000 farmers
- Architecture must be horizontally scalable later without a rewrite
- No mock production workflows
- Farmer core experience is free

## Farmer-facing navigation
1. Home / Today
2. My Farm
3. Scan
4. Ask SENSOTECH
5. Market
6. News
7. More

## Home / Today
Top section answers: **What matters for my farm right now?**
- Important action cards
- Weather → action
- Crop status
- Farm health
- Ask SENSOTECH
- Scan shortcut
- Market shortcut
- Revenue opportunity

When the farmer scrolls, show the **Live Soil & Sensor Data** section on the same Home screen when hardware is connected:
- N
- P
- K
- pH
- EC
- Soil moisture
- Soil temperature
- Sensor connection/health
- Last update
- Link to full sensor details/history

Without a connected sensor, show Soil Intelligence using available satellite, weather, farm history and permitted agricultural data instead of fake readings.

## My Farm
- Multiple farms
- Boundary/map
- Acreage
- Crop and sowing date
- Crop age/stage
- Farm health
- Farm history
- Farm DNA
- Farm Memory
- Season scorecard
- Farm efficiency

## Scan / Crop Doctor
Camera-first workflow:
Capture → photo quality check → crop/problem analysis → evidence → confidence → next action → save to Farm Memory.

Evidence can include camera, satellite, weather, sensor and crop-stage context when available. Conflicting evidence must be surfaced instead of silently choosing one source.

## Ask SENSOTECH
- Text + voice
- Hindi, Marathi, English initially
- Farmer-context aware
- Explain why and show evidence/source
- Confidence and uncertainty
- Data conflict warnings
- Don't Spend Yet
- What-if scenarios
- Farm Memory search
- Expert escalation when needed

## Intelligence layers
### Ground data
N, P, K, pH, EC, moisture, soil temperature, sensor health/calibration.

### Remote sensing
Sentinel-1, Sentinel-2, vegetation indices, temporal change, field anomalies, crop stress and water stress.

### Vision
Crop identification, disease/pest symptoms, nutrient symptoms, plant stress, severity and photo quality.

### Environment
Rainfall, temperature, humidity, wind, forecast and weather risk.

### Economics
Input cost, labour, machinery, yield, market price, transport, storage, revenue and net realization.

### Decision layer
Farmer question → relevant data/tools → evidence fusion → confidence → recommendation → action → outcome → Farm Memory.

## Weather → Action
Weather is operational intelligence, not just a forecast screen:
- Irrigation window
- Spray window
- Sowing window
- Harvest window
- Fertilizer application window
- Work-day recommendation
- Heat/heavy rain/waterlogging risk

## Water
- Irrigation recommendation
- Water requirement
- Water budget
- Water-use history
- Rainfall vs irrigation
- Water reserve estimate
- Water stress
- Irrigation delay
- Season projection
- Sensor-based irrigation intelligence

## Crop + Planner
- Crop recommendation / Top 5
- Suitability, duration, water, risk, yield range
- Rotation and diversification
- Crop comparison/simulator
- Crop calendar
- Sowing, irrigation, nutrient, pest, harvest and selling schedules
- Daily checklist
- 7-day planner
- Missed-task impact

## Inputs + Money
- Fertilizer/seed recommendation and requirements
- Input cost
- Purchase checker
- Price comparison
- Stock-at-home
- Purchase reminders
- Waste detection
- Traceability
- Bill scanner/analyzer
- Expenses/income
- Cost/acre, cost/quintal
- Revenue/acre
- ROI
- Break-even price/yield
- Profit and loss scenarios
- Season financial report

## Market + Harvest
- Nearby mandi
- Current min/modal/max price
- Arrivals
- 7/30-day and seasonal trends
- MSP/e-NAM information
- Transport cost
- Net realization
- Sell / Store / Wait
- Market comparison
- Buyers/FPO/warehouse
- Harvest readiness
- Yield estimate
- Quality/grade estimate
- Post-harvest loss
- Storage/cold storage
- Packaging and transport

## Revenue Booster
Signature system answering: **How can this farm generate more income?**

Evaluate opportunities using crop, season, space, water, labour, investment, duration, risk and local demand. Examples include compatible intercropping, unused land opportunities, mushroom farming and service opportunities.

Always present assumptions and estimated ranges; never guarantee income.

## Government + News
- Personalized schemes
- Eligibility
- Documents
- Deadlines/reminders
- Status
- Official-source badge
- Government GR simplification
- Crop insurance/loss guidance
- Government/crop/market/district/weather/pest news
- Personalized “For You” and “What Changed?” feed
- Official-source verification

## Services + local intelligence
- Machinery
- Labour
- Repairs
- Fuel/maintenance
- KVK
- Agriculture office
- Soil lab
- FPO
- Warehouse
- Buyers
- Markets
- Local crop calendar
- Local pest/weather/risk intelligence

## Records + risk
- Digital/voice farm diary
- Sowing/fertilizer/spray/irrigation/harvest/selling/expense records
- Crop decision journal
- Search farm history
- Repeat problem detector
- Farm experiment mode
- Farm benchmark
- Farm improvement plan
- Farm risk radar
- Recommendation change alert
- Evidence timeline
- Data conflict alert
- Farm digital proof
- Flood/storm/drought damage records
- GPS + timestamp evidence
- Insurance documentation support

## Experience requirements
- Offline mode
- Low-data mode
- Auto-sync
- Voice-first interactions
- Large farmer-friendly controls
- Marathi/Hindi/English initially
- Day/night mode
- PWA/mobile-ready architecture
- Push notifications
- Family access
- Reports/export
- Consent/data controls

## Trust rules
- Never fabricate sensor, market, weather, satellite or government data.
- Show source provenance where useful.
- Express uncertainty when evidence is weak.
- Do not promise blanket accuracy percentages.
- Do not guarantee yield, profit, diagnosis or market outcomes.
- “Don't Spend Yet” is a valid recommendation.
- Use official sources for government information where available.
- Farmer data is not sold as raw personal data.
- Sponsored/commercial recommendations must be clearly identified.

## UI philosophy
**327+ planned capabilities are not 327 buttons.** Progressive disclosure keeps the farmer experience simple. Advanced capabilities appear when context makes them relevant.
