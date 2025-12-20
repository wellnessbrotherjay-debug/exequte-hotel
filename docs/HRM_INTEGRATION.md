# HRM Integration Guide

## Overview
This guide explains how to integrate your HRM (Heart Rate Monitor) software with the GLVT class booking system to provide real-time workout tracking and post-workout analytics.

## System Architecture

```
User Books Class → HRM Device Assigned → Class Starts → Real-time HR Monitoring → Class Ends → Results Page
```

## Components

### 1. HRM Service (`/lib/services/hrmService.ts`)
Central service handling all HRM-related operations:
- Device pairing
- Session management
- Real-time data sync via WebSocket
- Post-workout data aggregation

### 2. Results Page (`/app/glvt/hrm/results/page.tsx`)
Post-workout display showing:
- Class cover image
- Heart rate statistics (avg, max, min)
- Calories burned
- Heart rate chart over time
- HR zone breakdown
- Class leaderboard with rankings
- Personal bests tracking
- Share functionality

### 3. Booking Integration (`/app/glvt/book/confirm/page.tsx`)
Enhanced booking confirmation with:
- HRM device ID assignment
- Pickup instructions
- Auto-sync notification

## Integration Steps

### Step 1: Configure Environment Variables

Add to your `.env.local`:

```bash
# HRM Software API Configuration
NEXT_PUBLIC_HRM_API_URL=https://api.yourhrmsoftware.com
NEXT_PUBLIC_HRM_WS_URL=wss://ws.yourhrmsoftware.com
HRM_API_KEY=your_api_key_here
HRM_API_SECRET=your_api_secret_here
```

### Step 2: Implement API Endpoints

Replace mock functions in `hrmService.ts` with actual API calls:

#### Device Pairing
```typescript
async pairDeviceForBooking(userId: string, bookingId: string): Promise<HRMDevice> {
    const response = await fetch(`${this.apiBaseUrl}/devices/pair`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.getAuthToken()}`,
            'X-API-Key': process.env.HRM_API_KEY
        },
        body: JSON.stringify({
            userId,
            bookingId,
            timestamp: new Date().toISOString()
        })
    });
    
    return await response.json();
}
```

#### Start Workout Session
```typescript
async startWorkoutSession(userId: string, classId: string, deviceId: string): Promise<string> {
    const response = await fetch(`${this.apiBaseUrl}/sessions/start`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify({
            userId,
            classId,
            deviceId,
            startTime: new Date().toISOString()
        })
    });
    
    const { sessionId } = await response.json();
    this.connectWebSocket(sessionId);
    return sessionId;
}
```

### Step 3: WebSocket Real-time Data

The service connects to your HRM software's WebSocket for real-time updates:

```typescript
// WebSocket connection established automatically
// Listens for heart rate updates during workout
// Emits custom events for UI components

// Listen in your components:
useEffect(() => {
    const handleHRUpdate = (event: CustomEvent) => {
        const { heartRate, zone } = event.detail;
        // Update UI with real-time data
    };
    
    window.addEventListener('hrm-data-update', handleHRUpdate);
    return () => window.removeEventListener('hrm-data-update', handleHRUpdate);
}, []);
```

### Step 4: Post-Workout Data Flow

1. **Class Ends** → `hrmService.endWorkoutSession(sessionId)`
2. **Get Results** → `hrmService.getWorkoutResults(sessionId)`
3. **Display** → Navigate to `/glvt/hrm/results?class={classId}`

## Data Models

### HRM Device
```typescript
interface HRMDevice {
    deviceId: string;        // Unique device identifier
    deviceName: string;      // e.g., "Polar H10"
    batteryLevel: number;    // 0-100
    isConnected: boolean;
    lastSync: Date;
}
```

### Workout Data
```typescript
interface HRMWorkoutData {
    sessionId: string;
    userId: string;
    classId: string;
    deviceId: string;
    startTime: Date;
    endTime?: Date;
    heartRateData: HeartRatePoint[];
    summary?: WorkoutSummary;
}
```

### Heart Rate Point
```typescript
interface HeartRatePoint {
    timestamp: Date;
    heartRate: number;
    zone: 1 | 2 | 3 | 4 | 5;  // HR zones
}
```

### Workout Summary
```typescript
interface WorkoutSummary {
    avgHeartRate: number;
    maxHeartRate: number;
    minHeartRate: number;
    caloriesBurned: number;
    duration: number;  // minutes
    zones: {
        zone1: number;  // minutes in each zone
        zone2: number;
        zone3: number;
        zone4: number;
        zone5: number;
    };
}
```

## Heart Rate Zones

| Zone | % Max HR | Name | Color | Purpose |
|------|----------|------|-------|---------|
| 1 | 50-60% | Recovery | Blue | Warm-up, cool-down |
| 2 | 60-70% | Fat Burn | Green | Endurance, fat burning |
| 3 | 70-80% | Cardio | Yellow | Aerobic fitness |
| 4 | 80-90% | Peak | Orange | Anaerobic capacity |
| 5 | 90-100% | Max | Red | Maximum effort |

## API Endpoints Required

Your HRM software should provide these endpoints:

### Device Management
- `POST /devices/pair` - Pair device to user/booking
- `GET /devices/{deviceId}` - Get device status
- `POST /devices/{deviceId}/sync` - Manual sync

### Session Management
- `POST /sessions/start` - Start workout session
- `POST /sessions/{sessionId}/end` - End session
- `GET /sessions/{sessionId}/results` - Get workout results

### Data Retrieval
- `GET /sessions/{sessionId}/heartrate` - Get HR data points
- `GET /leaderboard?classId={id}&date={date}` - Get class rankings

### WebSocket
- `wss://ws.yourhrmsoftware.com/sessions/{sessionId}` - Real-time HR updates

## Testing

### Mock Data
The system includes mock data for development:
- Device pairing returns simulated device
- Workout data generates realistic HR curves
- Leaderboard shows sample rankings

### Test Flow
1. Book a class → See HRM device assignment
2. Navigate to `/glvt/hrm/results?class=core-foundation`
3. View complete post-workout experience

## Features

### ✅ Implemented
- [x] Device pairing on booking
- [x] Post-workout results page
- [x] Heart rate chart visualization
- [x] HR zone breakdown
- [x] Class leaderboard with photos
- [x] Personal bests tracking
- [x] Share functionality
- [x] Class cover image integration
- [x] Real-time data structure (WebSocket ready)

### 🔄 Ready for Integration
- [ ] Connect to actual HRM API
- [ ] Implement WebSocket real-time updates
- [ ] Add authentication tokens
- [ ] Configure production endpoints

## Security Considerations

1. **API Keys**: Store in environment variables, never commit
2. **User Data**: Encrypt heart rate data in transit and at rest
3. **Device Pairing**: Verify user owns the booking before pairing
4. **WebSocket**: Use secure WSS protocol with authentication

## Troubleshooting

### Device Not Pairing
- Check API endpoint configuration
- Verify API key is valid
- Ensure user has active booking

### No Real-time Data
- Confirm WebSocket URL is correct
- Check browser console for connection errors
- Verify session ID is valid

### Results Not Loading
- Check session ID in URL parameter
- Verify API returns data in expected format
- Review browser console for errors

## Support

For integration assistance:
1. Review mock implementations in `hrmService.ts`
2. Check API response formats match interfaces
3. Test with mock data first
4. Gradually replace with real API calls

## Next Steps

1. Configure environment variables
2. Test device pairing flow
3. Implement real API endpoints
4. Test WebSocket connection
5. Validate data formats
6. Deploy to production
