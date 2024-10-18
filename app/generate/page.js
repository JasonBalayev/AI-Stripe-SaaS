'use client'

import { useUser, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { db } from '@/firebase';
import { 
  Box, Container, TextField, Typography, Paper, Button, Grid, CardActionArea, CardContent, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Card, AppBar, Toolbar, Snackbar, Alert 
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { doc, collection, getDoc, writeBatch } from 'firebase/firestore';
import Head from 'next/head';

export default function Generate() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [text, setText] = useState('');
  const [flashcards, setFlashcards] = useState([]); // Initialize flashcards state
  const [flipped, setFlipped] = useState({}); // Initialize flipped state
  const [name, setName] = useState('');
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    if (!isSignedIn) {
      setError('You must be logged in to generate flashcards.');
      setOpenSnackbar(true);
      return;
    }
    if (!text.trim()) {
      setError('Please enter some text to generate flashcards.');
      setOpenSnackbar(true);
      return;
    }

    fetch('/api/generate', {
      method: 'POST',
      body: JSON.stringify({ text }), // Make sure to send data in JSON format
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setFlashcards(data); // Expecting an array of flashcards
        } else {
          setError('Invalid response from the server.');
          setOpenSnackbar(true);
        }
      })
      .catch((err) => {
        setError('An error occurred while generating flashcards.');
        setOpenSnackbar(true);
      });
  }

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id], // Toggle the flipped state for the clicked card
    }))
  }

  const handleOpen = () => {
    setOpen(true);
  }
  const handleClose = () => {
    setOpen(false);
  }

  const saveFlashcards = async () => {
    if (!name.trim()) {
      setError('Please enter a name for your flashcards collection.');
      setOpenSnackbar(true);
      return;
    }

    const batch = writeBatch(db);
    const userDocRef = doc(collection(db, 'users'), user.id);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      const collections = docSnap.data().flashcards || [];
      if (collections.find((f) => f.name === name)) {
        setError("A collection with this name already exists.");
        setOpenSnackbar(true);
        return;
      } else {
        collections.push({ name });
        batch.set(userDocRef, { flashcards: collections }, { merge: true });
      }
    } else {
      batch.set(userDocRef, { flashcards: [{ name }] });
    }

    const colRef = collection(userDocRef, name);
    flashcards.forEach((flashcard) => {
      const cardDocRef = doc(colRef);
      batch.set(cardDocRef, flashcard);
    });
    await batch.commit();
    handleClose();
    router.push('/flashcards');
  }

  return (
    <Container maxWidth="lg" sx={{ backgroundColor: "#f5f5f5", minHeight: '100vh', paddingBottom: 5 }}>
      <Head>
        <title>Generate Flashcards Using AI</title>
        <meta name="description" content="Generate flashcards from your text" />
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

      {/* Main Content */}
      <Box 
        sx={{
          mt: 4, 
          mb: 6, 
          display: 'flex', 
          flexDirection:'column', 
          alignItems: 'center',
        }}
      >
        <Typography variant='h4' sx={{ fontWeight: 'bold', color: '#333', mb: 2 }}>Generate Flashcards Using AI</Typography>

        {/* View Saved Flashcards Button */}
        <Box sx={{ mb: 2 }}>
          <Button 
            variant="outlined" 
            color="primary" 
            onClick={() => router.push('/flashcards')}
            sx={{ textTransform: 'none', fontSize: '1rem', fontWeight: 'bold' }}
          >
            View Saved Flashcards
          </Button>
        </Box>

        <Paper sx={{ p: 4, width: '100%', maxWidth: 800 }}>
          <TextField 
            value={text} 
            onChange={(e) => setText(e.target.value)}
            label="Enter your text here"
            fullWidth
            multiline
            rows={6}
            variant='outlined'
            sx={{
              mb: 2,
            }}
          />
          <Button
            variant='contained' 
            color='primary' 
            onClick={handleSubmit} 
            fullWidth
            sx={{ py: 1.5, fontSize: '1rem', fontWeight: 'bold' }}
          >
            Generate Flashcards
          </Button>
        </Paper>
      </Box>

      {flashcards.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant='h5' sx={{ fontWeight: 'bold', color: '#333', mb: 2 }}>Flashcards Preview</Typography>
          <Grid container spacing={3}>
            {flashcards.map((flashcard, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ perspective: '1000px' }}>
                  <CardActionArea onClick={() => handleCardClick(index)}>
                    <CardContent
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
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: '#fff',
                          borderRadius: '8px',
                          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                        }}
                      >
                        <Typography variant='h6' component="div" sx={{ textAlign: 'center', padding: 2 }}>
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
                          transform: 'rotateY(180deg)',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: '#f0f0f0',
                          borderRadius: '8px',
                          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                        }}
                      >
                        <Typography variant='h6' component="div" sx={{ textAlign: 'center', padding: 2 }}>
                          {flashcard.back}
                        </Typography>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Button 
              variant='contained' 
              color='secondary' 
              onClick={handleOpen}
              sx={{ px: 4, py: 1.5, fontSize: '1rem', fontWeight: 'bold', borderRadius: '30px' }}
            >
              Save Flashcards
            </Button>
          </Box>
        </Box>
      )}

      {/* Save Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Save Flashcards</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter a name for your flashcards collection.
          </DialogContentText>
          <TextField
            autoFocus
            margin='dense'
            label='Collection Name'
            type='text'
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            variant='outlined'
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={saveFlashcards}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Error Snackbar */}
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
}
