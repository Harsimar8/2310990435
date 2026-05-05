const axios = require('axios');


const Log = async (stack, level, pkg, message) => {
    const url = "http://20.207.122.201/evaluation-service/logs";
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJoYXJzaW1hcjA0MzUuYmUyM0BjaGl0a2FyYS5lZHUuaW4iLCJleHAiOjE3Nzc5NTg0NDAsImlhdCI6MTc3Nzk1NzU0MCwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6IjNiZmU0ZTg0LTkxOTAtNDUxMS1hZGUxLTZhNWRmYTI2YmI4MSIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6ImhhcnNpbWFyIGthdXIiLCJzdWIiOiIwMmE0ODY2ZC04MjZiLTQzNTQtYTkxNi03OWUyYTY4ZjhiZDAifSwiZW1haWwiOiJoYXJzaW1hcjA0MzUuYmUyM0BjaGl0a2FyYS5lZHUuaW4iLCJuYW1lIjoiaGFyc2ltYXIga2F1ciIsInJvbGxObyI6IjIzMTA5OTA0MzUiLCJhY2Nlc3NDb2RlIjoiRVhmdkRwIiwiY2xpZW50SUQiOiIwMmE0ODY2ZC04MjZiLTQzNTQtYTkxNi03OWUyYTY4ZjhiZDAiLCJjbGllbnRTZWNyZXQiOiJwZENKWGJiWEhybXZ3RUFHIn0.2UzkA5Rrw7NwwALf2MhBvmKXhHaOAbRRvf_yXrJ9Kg8"; 

    const body = {
        stack: stack.toLowerCase(),
        level: level.toLowerCase(),
        package: pkg.toLowerCase(),
        message: message
    };

    try {
        await axios.post(url, body, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        
        process.stdout.write("Logging service unreachable\n");
    }
};

module.exports = Log;