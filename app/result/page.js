'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Container, Typography, Button, Box, CircularProgress } from '@mui/material';
import { useSearchParams } from 'next/navigation'

const ResultPage = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const session_id = searchParams.get('session_id')

  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCheckoutSession = async () => {
      if (!session_id) return;

      try {
        const res = await fetch(`/api/checkout_session?session_id=${session_id}`);
        const sessionData = await res.json();
        if (res.ok) {
          setSession(sessionData);
        } else {
          setError(sessionData.error.message || 'Unknown error occurred'); 
        }
      } catch (error) {
        setError('An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCheckoutSession();
  }, [session_id]);

  if (loading){
    return(
      <Container 
        maxWidth="lg" 
        sx={{ 
          textAlign: 'center', 
          mt: 4, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          minHeight: '100vh'
        }}
      >
        <CircularProgress />
        <Typography variant='h6' sx={{ mt: 2 }}>Loading...</Typography>
      </Container>
    )
  }

  if (error) {
    return(
      <Container 
        maxWidth="lg" 
        sx={{ 
          textAlign: 'center', 
          mt: 4, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center',
          minHeight: '100vh'
        }}
      >
        <Typography variant='h6'>{error}</Typography>
        <Button 
          variant="contained" 
          sx={{ 
            mt: 4, 
            textTransform: 'none', 
            fontSize: '1.2rem', 
            fontWeight: 'bold',
            borderRadius: '30px',
            background: 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)',
            color: '#fff',
            px: 4, py: 1.5,
            transition: 'all 0.3s',
            '&:hover': { 
              transform: 'scale(1.05)', 
              background: '#5e35b1' 
            }
          }} 
          onClick={() => router.push('/')}
        >
          Go to Home
        </Button>
      </Container>
    )
  }

  return (
    <Container
      maxWidth="lg"
      sx={{
        textAlign: 'center',
        mt: 4,
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        minHeight: '100vh'
      }}
    >
      {session.payment_status === 'paid' ? (
        <>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#333' }}>Thank you for purchasing.</Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant="h6">Session ID: {session_id}</Typography>
            <Typography variant="body1" sx={{ color: '#666' }}>
              We have received your payment. You will receive
              an email with the order details shortly.
            </Typography>
          </Box>
          <Button 
            variant="contained" 
            sx={{ 
              mt: 4, 
              textTransform: 'none', 
              fontSize: '1.2rem', 
              fontWeight: 'bold',
              borderRadius: '30px',
              background: 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)',
              color: '#fff',
              px: 4, py: 1.5,
              transition: 'all 0.3s',
              '&:hover': { 
                transform: 'scale(1.05)', 
                background: '#5e35b1' 
              }
            }} 
            onClick={() => router.push('/')}
          >
            Go to Home
          </Button>
        </>
      ) : (
        <>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#333' }}>Payment Failed.</Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant="body1" sx={{ color: '#666' }}>
              Your payment was not successful. Please try again.
            </Typography>
          </Box>
          <Button 
            variant="contained" 
            sx={{ 
              mt: 4, 
              textTransform: 'none', 
              fontSize: '1.2rem', 
              fontWeight: 'bold',
              borderRadius: '30px',
              background: 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)',
              color: '#fff',
              px: 4, py: 1.5,
              transition: 'all 0.3s',
              '&:hover': { 
                transform: 'scale(1.05)', 
                background: '#5e35b1' 
              }
            }} 
            onClick={() => router.push('/')}
          >
            Go to Home
          </Button>
        </>
      )}
    </Container>
  )
}

export default ResultPage
