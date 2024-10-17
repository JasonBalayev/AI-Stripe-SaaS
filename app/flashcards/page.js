'use client'

import { SignedIn, SignedOut, useUser, UserButton } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { 
  collection, doc, getDoc, setDoc, getDocs, writeBatch 
} from 'firebase/firestore';
import { db } from '@/firebase'; 
import { useRouter } from 'next/navigation';
import { 
  AppBar, Toolbar, Button, Container, Grid, Typography, Card, CardActionArea, CardContent, Snackbar, Alert, Box, IconButton 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Head from 'next/head';

export default function Flashcards() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [flashcards, setFlashcards] = useState([]);
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function getFlashcards() {
      if (!user) return;
      const docRef = doc(collection(db, 'users'), user.id)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const collections = docSnap.data().flashcards || []
        setFlashcards(collections)
      } else {
        await setDoc(docRef, { flashcards: [] })
        setFlashcards([])
      }    
    }
    getFlashcards()
  }, [user])

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

  const handleCardClick = (id) => {
    router.push(`/flashcard?id=${id}`);
  };

  const handleDelete = async (collectionName) => {
    if (!user) return;
    try {
      const userDocRef = doc(db, 'users', user.id);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        const collections = userDocSnap.data().flashcards || [];d
        const updatedCollections = collections.filter(col => col.name !== collectionName);
        await setDoc(userDocRef, { flashcards: updatedCollections }, { merge: true });
        const collectionRef = collection(userDocRef, collectionName);
        const flashcardsSnapshot = await getDocs(collectionRef);
        const batch = writeBatch(db);
        flashcardsSnapshot.forEach(doc => {
          batch.delete(doc.ref);
        });
        await batch.commit();
        setFlashcards(updatedCollections);
        setError('Flashcard collection deleted successfully.');
        setOpenSnackbar(true);
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while deleting the collection.');
      setOpenSnackbar(true);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ backgroundColor: "#f5f5f5", minHeight: '100vh', paddingBottom: 5 }}>
      <Head>
        <title>Your Flashcard Collections</title>
        <meta name="description" content="View your flashcard collections" />
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

      {/* Flashcard Collections Content */}
      <Box sx={{ mt: 4 }}>
        <Typography variant='h4' sx={{ fontWeight: 'bold', color: '#333', mb: 2 }}>
          Your Flashcard Collections
        </Typography>

        {/* Generate Flashcards Button */}
        <Box sx={{ mb: 2 }}>
          <Button 
            variant="outlined" 
            color="primary" 
            onClick={() => router.push('/generate')}
            sx={{ textTransform: 'none', fontSize: '1rem', fontWeight: 'bold' }}
          >
            Generate Flashcards
          </Button>
        </Box>

        {flashcards.length > 0 ? (
          <Grid container spacing={3}>
            {flashcards.map((flashcard, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Card sx={{ height: '100%', position: 'relative' }}>
                  <CardActionArea 
                    onClick={() => handleCardClick(flashcard.name)}
                    sx={{ height: '100%' }}
                  >       
                    <CardContent sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Typography variant='h6' sx={{ textAlign: 'center', fontWeight: 'bold' }}>
                        {flashcard.name}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                  <IconButton
                    aria-label="delete"
                    onClick={(e) => { e.stopPropagation(); handleDelete(flashcard.name); }}
                    sx={{ position: 'absolute', top: 8, right: 8 }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="h6" sx={{ textAlign: 'center', mt: 4 }}>
            No flashcard collections found.
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
        <Alert onClose={() => setOpenSnackbar(false)} severity="info" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  )
}
