## Troubleshooting Guide: MyDataTable Data Retrieval

### ✅ Backend Status
- **Server**: Running on port 5000
- **API Endpoint**: http://172.20.8.77:5000/bivalvi-form-entries
- **Status Code**: 200 OK
- **Database Entries**: 2 records found

### Response Structure
The API returns data in this structure:
```json
{
  "message": "Entries retrieved successfully",
  "count": 2,
  "data": [
    {
      "_id": "...",
      "survey_no": "...",
      "select_date": "...",
      ...
    }
  ],
  "pagination": {...}
}
```

### Common Issues and Solutions

#### 1. **No Data Showing in Mobile App**
**Cause**: Frontend not properly accessing the nested `data` property
**Solution**: The MyDataTable component has been updated to handle:
```tsx
// Now checks for response.data.data structure
if (response.data && response.data.data && Array.isArray(response.data.data)) {
  setData(response.data.data);
}
```

#### 2. **Network Connectivity Issues**
**Check**:
- Ensure mobile device can ping 172.20.8.77:5000
- Verify API_URL in `src/config.tsx` matches your server IP
- Check that server is accessible from mobile network

**To Verify**:
```bash
# From mobile device, test:
ping 172.20.8.77
curl http://172.20.8.77:5000/health
```

#### 3. **API Not Responding**
**Check Server Status**:
```bash
# Check if port 5000 is in use
netstat -ano | findstr :5000

# Restart server
cd D:\SurveyApp\SurveyAppBackend
node server.js
```

#### 4. **Empty Database**
If no entries show up:
1. Submit a form entry through the MangroveNew screen
2. Check database: `db.bivalviDetails.find()`
3. Verify data is saved before checking table

### Testing the Connection

#### Via PowerShell:
```powershell
Invoke-WebRequest -Uri "http://172.20.8.77:5000/bivalvi-form-entries" -UseBasicParsing
```

#### Via curl (if available):
```bash
curl http://172.20.8.77:5000/bivalvi-form-entries
```

### Debugging Steps

1. **Check Console Logs** (React Native):
   ```
   Look for these logs:
   - "Fetching data from: http://172.20.8.77:5000/bivalvi-form-entries"
   - "API Response: {...}"
   - "Found data in response.data.data, count: X"
   ```

2. **Monitor Network Traffic**:
   - Use React Native Debugger or Flipper
   - Check network requests to API endpoint

3. **Backend Logs**:
   - Check MongoDB connection status
   - Verify no errors in BivalviController

4. **Manual API Test**:
   - Use Postman or browser to test endpoint
   - Ensure response contains data

### Configuration Check

**Verify API_URL** (`src/config.tsx`):
```tsx
export const API_URL = 'http://172.20.8.77:5000';
// Should match your actual server IP and port
```

**For Android Emulator** (if using localhost):
```tsx
export const API_URL = 'http://10.0.2.2:5000';
// 10.0.2.2 is the special alias for host machine on Android emulator
```

### Data Flow Verification

```
Mobile App
    ↓
axios.get(API_URL + '/bivalvi-form-entries')
    ↓
Server receives request
    ↓
BivalviController.getAllBivalviInfo()
    ↓
MongoDB: bivalviDetails collection
    ↓
Response with data array
    ↓
Frontend: setData(response.data.data)
    ↓
FlatList renders table with data
```

### Quick Fixes

1. **Clear App Cache**:
   - Reinstall React Native app
   - Clear app data

2. **Reload Data**:
   - Use "Reload Data" button in empty state
   - Pull to refresh functionality

3. **Check Network**:
   - Ensure mobile device is on same network as server
   - Verify firewall isn't blocking port 5000

4. **Restart Services**:
   - Stop and restart backend server
   - Reload mobile app

### If Still Not Working

Check these logs in sequence:

1. **Server Log**: 
   ```
   MongoDB Connected: localhost
   Server running on port 5000
   ```

2. **API Test Result**:
   - HTTP 200 status
   - Contains "data" array with entries

3. **Mobile App Console**:
   - Network request shows in XHR/Network tab
   - No 404 or connection errors

4. **Database Check**:
   ```javascript
   // In MongoDB shell
   db.bivalviDetails.count()  // Should return > 0
   db.bivalviDetails.findOne() // Check data structure
   ```

### Support Information

- **Backend Port**: 5000
- **Database**: MongoDB (local)
- **API Format**: RESTful JSON
- **Authentication**: None (CORS enabled)
- **Data Persistence**: MongoDB bivalviDetails collection
