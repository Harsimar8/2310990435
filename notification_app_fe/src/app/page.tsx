"use client";
import React, { useEffect, useState } from 'react';
import { 
  Container, Typography, Button, Stack, Card, 
  CardContent, Chip, Box, CircularProgress, Alert 
} from '@mui/material';
import axios from 'axios';

const WEIGHTS = { 'Placement': 3, 'Result': 2, 'Event': 1 };

// IMPORTANT: Ensure this TOKEN is fresh from your Stage 6 login
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJoYXJzaW1hcjA0MzUuYmUyM0BjaGl0a2FyYS5lZHUuaW4iLCJleHAiOjE3Nzc5NjQxMzksImlhdCI6MTc3Nzk2MzIzOSwiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6IjM3NWJmMzQxLTQwYjktNDllMS05MDUwLTkxODg0MTMyNzYwOCIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6ImhhcnNpbWFyIGthdXIiLCJzdWIiOiIwMmE0ODY2ZC04MjZiLTQzNTQtYTkxNi03OWUyYTY4ZjhiZDAifSwiZW1haWwiOiJoYXJzaW1hcjA0MzUuYmUyM0BjaGl0a2FyYS5lZHUuaW4iLCJuYW1lIjoiaGFyc2ltYXIga2F1ciIsInJvbGxObyI6IjIzMTA5OTA0MzUiLCJhY2Nlc3NDb2RlIjoiRVhmdkRwIiwiY2xpZW50SUQiOiIwMmE0ODY2ZC04MjZiLTQzNTQtYTkxNi03OWUyYTY4ZjhiZDAiLCJjbGllbnRTZWNyZXQiOiJwZENKWGJiWEhybXZ3RUFHIn0.G2Isb8s5iXbiAQP3pJcw3uXxbSWMPN7QHhIIggD2-GE';

export default function NotificationPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('');
  const [isPriorityView, setIsPriorityView] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  const fetchDocs = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('http://20.207.122.201/evaluation-service/notifications', {
        headers: { 'Authorization': `Bearer ${TOKEN}` },
        params: {
          ...(filter && { notification_type: filter }),
          limit: isPriorityView ? 10 : 20
        }
      });
      
      let data = res.data.notifications || [];
      if (isPriorityView) {
        data.sort((a, b) => (WEIGHTS[b.Type] || 0) - (WEIGHTS[a.Type] || 0));
        data = data.slice(0, 10);
      }
      setNotifications(data);
    } catch (err) {
      setError("Failed to load. Check CORS extension and Token.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setHasMounted(true);
    fetchDocs();
  }, [filter, isPriorityView]);

  if (!hasMounted) return null;

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
        Campus Notifications
      </Typography>

      <Stack direction="row" spacing={2} sx={{ mb: 4, justifyContent: 'center' }}>
        <Button variant={filter === '' ? "contained" : "outlined"} onClick={() => {setFilter(''); setIsPriorityView(false)}}>All</Button>
        <Button variant={filter === 'Placement' ? "contained" : "outlined"} color="success" onClick={() => {setFilter('Placement'); setIsPriorityView(false)}}>Placements</Button>
        <Button variant={isPriorityView ? "contained" : "outlined"} color="secondary" onClick={() => setIsPriorityView(!isPriorityView)}>
          {isPriorityView ? "Standard View" : "Show Priority"}
        </Button>
      </Stack>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>
      ) : (
        <Stack spacing={2}>
          {notifications.map((n) => (
            <Card key={n.ID} sx={{ borderLeft: n.Type === 'Placement' ? '6px solid #2e7d32' : '1px solid #ddd' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6" sx={{ fontSize: '1.1rem' }}>{n.Message}</Typography>
                  <Chip label={n.Type} color={n.Type === 'Placement' ? "success" : "primary"} size="small" />
                </Box>
                <Typography variant="caption" color="textSecondary">{n.Timestamp}</Typography>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Container>
  );
}