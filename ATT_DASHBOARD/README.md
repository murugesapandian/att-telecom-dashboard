# AT&T Telecom Intelligence Dashboard

## Advanced Business & Strategy Analytics Platform

A real-time telecom market intelligence dashboard for AT&T's Business & Strategy team, enabling data-driven decisions for market expansion, customer experience improvement, and competitive positioning across all 50 US states.

---

## Quick Start

### Frontend (React + Vite)
```bash
cd frontend
npm install
npm start          # Dev server → http://localhost:3000
npm run build      # Production build
```

### Backend (Spring Boot + Kafka)
```bash
cd backend
docker-compose up -d    # Starts all services + Kafka + Zookeeper
```

---

## Dashboard Modules

| Module | Route | Description |
|--------|-------|-------------|
| Overview | `/` | 8 real-time KPIs, revenue trends, live activity feed |
| USA State Map | `/usa-map` | Interactive choropleth map — all 50 states |
| Provider Analytics | `/provider-analytics` | State-by-state market share charts |
| Customer Feedback | `/customer-feedback` | Top 5 providers sentiment & NPS |
| Plan Comparison | `/plan-comparison` | Wireless & broadband plan comparison |
| Documentation | `/documentation` | Architecture docs + .docx download |

---

## Technology Stack

### Frontend
- React 18 + Vite
- Recharts (data visualization)
- react-simple-maps (USA map)
- React Router v6

### Backend Microservices
| Service | Port | Tech |
|---------|------|------|
| API Gateway | 8080 | Spring Cloud Gateway |
| State Analytics | 8081 | Spring Boot + JPA + SQLite |
| Provider Service | 8082 | Spring Boot + JPA + SQLite |
| Feedback Service | 8083 | Spring Boot + Sentiment Analysis |
| Plan Comparison | 8084 | Spring Boot + JPA + SQLite |
| Event Streaming | 8085 | Spring Boot + Kafka + WebSocket |

### Infrastructure
- Apache Kafka 3.6 (event streaming)
- SQLite (embedded DB per service)
- Docker + Docker Compose
- Zookeeper (Kafka coordination)

---

## Key Features

- **Real-time data**: Market share updates every 3 seconds
- **Interactive US Map**: 3 view modes (Leader, AT&T Heat Map, Opportunity)
- **50 States**: Complete state-by-state telecom market data
- **10 Providers**: AT&T, Verizon, T-Mobile, Comcast, Charter, Cox, Dish, UScellular, Frontier, Lumen
- **Customer Feedback**: Sentiment analysis, NPS scores, improvement roadmap
- **Plan Comparison**: Cards, table, and chart views
- **Documentation**: In-app architecture doc with .docx export

---

## Service URLs

- Dashboard: http://localhost:3000
- API Gateway: http://localhost:8080
- Kafka UI: http://localhost:9090
- Swagger (State Service): http://localhost:8081/swagger-ui.html
- Swagger (Feedback): http://localhost:8083/swagger-ui.html

---

*Built for AT&T Business & Strategy Team | Senior Product Manager Dashboard*
