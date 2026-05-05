const axios = require('axios');

const WEIGHTS = {
    'Placement': 3,
    'Result': 2,
    'Event': 1
};

async function getPriorityNotifications(n = 10) {
    const url = 'http://20.207.122.201/evaluation-service/notifications';
    
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJoYXJzaW1hcjA0MzUuYmUyM0BjaGl0a2FyYS5lZHUuaW4iLCJleHAiOjE3Nzc5NjE2MTQsImlhdCI6MTc3Nzk2MDcxNCwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6IjA1MWMyMGZiLWMzMDMtNGFmZi1iMmE1LTc4NGQzMTY4OTNjYyIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6ImhhcnNpbWFyIGthdXIiLCJzdWIiOiIwMmE0ODY2ZC04MjZiLTQzNTQtYTkxNi03OWUyYTY4ZjhiZDAifSwiZW1haWwiOiJoYXJzaW1hcjA0MzUuYmUyM0BjaGl0a2FyYS5lZHUuaW4iLCJuYW1lIjoiaGFyc2ltYXIga2F1ciIsInJvbGxObyI6IjIzMTA5OTA0MzUiLCJhY2Nlc3NDb2RlIjoiRVhmdkRwIiwiY2xpZW50SUQiOiIwMmE0ODY2ZC04MjZiLTQzNTQtYTkxNi03OWUyYTY4ZjhiZDAiLCJjbGllbnRTZWNyZXQiOiJwZENKWGJiWEhybXZ3RUFHIn0.4ZuDtZLZp5x9il_PBbxNBuuXabpl7EWqJoNPOIo82os';

    try {
        const response = await axios.get(url, {
            headers: { 
                'Authorization': `Bearer ${token.trim()}`, // Added trim() to remove accidental spaces
                'Accept': 'application/json' 
            }
        });

        let notifications = response.data.notifications;

        notifications.sort((a, b) => {
            const weightA = WEIGHTS[a.Type] || 0;
            const weightB = WEIGHTS[b.Type] || 0;

            if (weightB !== weightA) {
                return weightB - weightA;
            }
            return new Date(b.Timestamp) - new Date(a.Timestamp);
        });

        const topN = notifications.slice(0, n);
        
        console.log(`--- Top ${n} Priority Notifications ---`);
        console.table(topN); 
        
        return topN;
    } catch (error) {
        if (error.response) {
            console.error(`Error ${error.response.status}: ${JSON.stringify(error.response.data)}`);
        } else {
            console.error('Error fetching notifications:', error.message);
        }
    }
}

getPriorityNotifications(10);