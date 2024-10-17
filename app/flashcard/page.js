'use client'

import { useUser, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { collection, doc, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';
import { 
  Card, CardActionArea, CardContent, Container, Grid, Typography, Box,
  AppBar, Toolbar, Button, Snackbar, Alert
} from '@mui/material';
import { useSearchParams, useRouter } from 'next/navigation';
import Head from 'next/head';

export default function Flashcard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const searchParams = useSearchParams();
  const search = searchParams.get('id');
  const router = useRouter();

  useEffect(() => {
    async function getFlashcard() {
      if (!search || !user) return;
      const colRef = collection(doc(collection(db, 'users'), user.id), search)
      const docs = await getDocs(colRef)
      const flashcards = []

      docs.forEach((doc)=> {
        flashcards.push({id: doc.id, ...doc.data()})
      })
      setFlashcards(flashcards)
    }
    getFlashcard()
  }, [user, search])

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  if (!isLoaded) {
    return (
      <Container maxWidth="lg" sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h6">Loading...</Typography>
      </Container>
    )
  }

  if (!isSignedIn) {
    return (
      <Container maxWidth="lg" sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h6">Please sign in to view your flashcards.</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          sx={{ mt: 2 }} 
          onClick={() => router.push('/sign-in')}
        >
          Sign In
        </Button>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ backgroundColor: "#f5f5f5", minHeight: '100vh', paddingBottom: 5 }}>
      <Head>
        <title>{search} Flashcards</title>
        <meta name="description" content="View your flashcards" />
      </Head>

      {/* Header / Navigation Bar */}
      <AppBar position="static" sx={{ backgroundColor: '#1976d2', mb: 4 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold', letterSpacing: '0.05em' }}>
            Flashcard SaaS
          </Typography>
          <Button 
            color="inherit" 
            sx={{ textTransform: 'none', fontSize: '1rem', fontWeight: 'bold', marginRight: 2 }}
            onClick={() => router.push('/')}
          >
            Home
          </Button>
          <SignedOut>
            <Button 
              color="inherit" href="/sign-in" 
              sx={{ textTransform: 'none', fontSize: '1rem', fontWeight: 'bold', marginRight: 1 }}
            >
              Login
            </Button>
            <Button 
              color="inherit" href="/sign-up"
              sx={{ textTransform: 'none', fontSize: '1rem', fontWeight: 'bold' }}
            >
              Sign Up
            </Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>

      {/* Flashcards Content */}
      <Box sx={{ mt: 4 }}>
        <Typography variant='h4' sx={{ fontWeight: 'bold', color: '#333', mb: 2 }}>
          {search} Flashcards
        </Typography>

        {/* Back to Collections Button */}
        <Box sx={{ mb: 2 }}>
          <Button 
            variant="outlined" 
            color="primary" 
            onClick={() => router.push('/flashcards')}
            sx={{ textTransform: 'none', fontSize: '1rem', fontWeight: 'bold' }}
          >
            Back to Collections
          </Button>
        </Box>

        {flashcards.length > 0 ? (
          <Grid container spacing={3}>
            {flashcards.map((flashcard, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ height: '100%' }}>
                  <CardActionArea onClick={() => handleCardClick(index)} sx={{ height: '100%' }}>
                    <CardContent sx={{ height: '100%', position: 'relative' }}>
                      <Box sx={{ perspective: '1000px', height: '100%' }}>
                        <Box
                          sx={{
                            position: 'relative',
                            width: '100%',
                            height: '200px',
                            transformStyle: 'preserve-3d',
                            transition: 'transform 0.6s',
                            transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                          }}
                        >
                          {/* Front Face */}
                          <Box
                            sx={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                              backfaceVisibility: 'hidden',
                              overflow: 'auto',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'center',
                              alignItems: 'center',
                              padding: 2,
                              boxSizing: 'border-box',
                              backgroundColor: '#fff',
                              border: '1px solid #ccc',
                              borderRadius: 2,
                            }}
                          >
                            <Typography
                              variant='h6'
                              component="div"
                              sx={{ margin: 0, textAlign: 'center', fontWeight: 'bold' }}
                            >
                              {flashcard.front}
                            </Typography>
                          </Box>

                          {/* Back Face */}
                          <Box
                            sx={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                              backfaceVisibility: 'hidden',
                              overflow: 'auto',
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'center',
                              alignItems: 'center',
                              padding: 2,
                              boxSizing: 'border-box',
                              transform: 'rotateY(180deg)',
                              backgroundColor: '#f0f0f0',
                              border: '1px solid #ccc',
                              borderRadius: 2,
                            }}
                          >
                            <Typography
                              variant='h6'
                              component="div"
                              sx={{ margin: 0, textAlign: 'center', fontWeight: 'bold' }}
                            >
                              {flashcard.back}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="h6" sx={{ textAlign: 'center', mt: 4 }}>
            No flashcards found.
          </Typography>
        )}
      </Box>

      {/* Error Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="warning" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  )
}
