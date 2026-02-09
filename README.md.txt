# 🎯 Ball n Bounce Performance Testing Suite

## 📊 Overview
Comprehensive performance testing for [booking.ballnbounce.com](https://booking.ballnbounce.com) using Apache JMeter. This suite includes load, stress, and user journey testing to determine system capacity and scalability.

## 🎯 Objectives
- Determine maximum concurrent user capacity
- Identify performance degradation points
- Test authentication flows (Supabase integration)
- Validate system scalability and recovery
- Establish performance baselines

## 📈 Test Results Summary

| Test Scenario | Concurrent Users | Duration | Error Rate | Avg Response Time | Status |
|---------------|------------------|----------|------------|-------------------|--------|
| Baseline | 50 | 10 min | 0.00% | 123ms | ✅ |
| Load Test | 100 | 15 min | 0.00% | 238ms | ✅ |
| Capacity Test | 150 | 5 min | 0.00% | 190ms | ✅ |
| Stress Test | 200 | 5 min | 0.00% | 219ms | ✅ |
| Peak Test | 250 | 5 min | 0.00% | 200ms | ✅ |
| Degradation Test | 300 | 5 min | 1.25% | 211ms | ⚠️ |
| Failure Test | 500 | 20 min | 76.72% | 1310ms | 🔴 |

## 🔍 Key Findings

### ✅ Strengths
1. **High Capacity**: System handles 250 concurrent users with 0% errors
2. **Excellent Performance**: <600ms response times up to 250 users
3. **Linear Scaling**: Perfect scaling up to 200 users (R² ≈ 0.99)
4. **Graceful Degradation**: Performance declines gradually, not sudden collapse
5. **Full Recovery**: System recovers completely after overload

### ⚠️ Limitations
1. **Capacity Ceiling**: Degradation begins at 250-300 users
2. **Throughput Drop**: 41% throughput decrease at 300 users
3. **Connection Limits**: System rejects connections beyond capacity

## 📁 Repository Structure



## 🚀 Quick Start

### Prerequisites
- Apache JMeter 5.6.3+
- Java 8+
- Windows/Linux/Mac OS

### Running Tests
1. Update `JMETER_PATH` in `Scripts/run_test.bat`
2. Run tests:
   ```bash
   cd Scripts
   run_test.bat

cd Scripts
generate_report.bat

🔧 Test Details
User Journey Tests
Anonymous User: Browse → Tickets → Selection → Checkout

Authenticated User: Login → Dashboard → Book → Logout

Authentication: Supabase OAuth integration testing

Performance Characteristics
Response Times: <1 second for complete user journeys

Throughput: 98.3 requests/second at peak (250 users)

Error Behavior: Gradual increase, not binary failure

Recovery Time: <2 minutes after overload

📊 Business Impact
Current Capacity Analysis
Typical Usage: 50-80 concurrent users (20-32% of capacity)

Peak Events: 100-150 users (40-60% of capacity)

Safety Margin: 100+ user buffer above peak estimates

Growth Capacity: Room for 2-3x current traffic

Risk Assessment
Scenario	Likelihood	Impact	Risk Level
Normal operations	High	Low	Low
Major event	Medium	Medium	Medium
Viral traffic	Low	High	High
🤝 Contributing
Fork the repository

Create a feature branch

Add tests for new scenarios

Submit a pull request

⚠️ Security Note
Important: Test plans contain sensitive URLs and paths. Remove or anonymize before public sharing.

📞 Contact & Credits
Tester: [Your Name]
Application: Ball n Bounce Booking System
Test Period: February 2024
Tools: Apache JMeter 5.6.3

📄 License
This test suite is for internal use and demonstration purposes.