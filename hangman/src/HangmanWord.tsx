import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';

type HangmanWordProps = {
  guessedLetters: string[];
  wordToGuess: string;
  reveal?: boolean;
};

export function HangmanWord({ guessedLetters, wordToGuess, reveal = false }: HangmanWordProps) {
  const [showSuccessPopup, setShowSuccessPopup] = useState<boolean>(false);
  const [showFailurePopup, setShowFailurePopup] = useState<boolean>(false);
  const [incorrectGuesses, setIncorrectGuesses] = useState<number>(0);
  const [hint, setHint] = useState<string>('Fetching hint...');
  const [playConfetti, setPlayConfetti] = useState<boolean>(false);

  // Load winning sound
  const winningSound = new Audio('/winning-sound.mp3'); // Place this file in the "public" folder

  // Function to fetch hint dynamically
  const fetchHint = async (word: string) => {
    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      const data = await response.json();
      if (data && data.length > 0) {
        const meaning = data[0].meanings[0]?.definitions[0]?.definition;
        setHint(meaning || 'No hint available');
      } else {
        setHint('No hint found');
      }
    } catch (error) {
      setHint('Hint not available');
    }
  };

  useEffect(() => {
    fetchHint(wordToGuess);
  }, [wordToGuess]);

  const isWordGuessed = wordToGuess.split('').every((letter) => guessedLetters.includes(letter));

  useEffect(() => {
    if (isWordGuessed) {
      setShowSuccessPopup(true);
      setPlayConfetti(true); // Start confetti
      winningSound.play(); // Play sound
    }
  }, [guessedLetters, isWordGuessed]);

  useEffect(() => {
    if (!isWordGuessed && guessedLetters.length > 0) {
      const lastGuess = guessedLetters[guessedLetters.length - 1];
      if (!wordToGuess.includes(lastGuess)) {
        setShowFailurePopup(true);
        setIncorrectGuesses((prev) => prev + 1);
      }
    }
  }, [guessedLetters, wordToGuess, isWordGuessed]);

  return (
    <div style={{ textAlign: 'center', position: 'relative' }}>
      {/* Confetti Effect */}
      {playConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}

      {/* Dynamic Hint Display */}
      <div
        style={{
          fontSize: '1.5rem',
          fontStyle: 'italic',
          color: '#fff',
          backgroundColor: '#007bff',
          padding: '0.75rem 1.5rem',
          borderRadius: '10px',
          display: 'inline-block',
          marginBottom: '1rem',
        }}
      >
        🔍 Hint: <strong>{hint}</strong>
      </div>

      <div
        style={{
          display: 'flex',
          gap: '.25em',
          fontSize: '6rem',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          fontFamily: 'monospace',
        }}
      >
        {wordToGuess.split('').map((letter, index) => (
          <span style={{ borderBottom: '.1em solid black' }} key={index}>
            <span
              style={{
                visibility: guessedLetters.includes(letter) || reveal ? 'visible' : 'hidden',
                color: !guessedLetters.includes(letter) && reveal ? 'red' : 'black',
              }}
            >
              {letter}
            </span>
          </span>
        ))}
      </div>

      {/* Success Popup */}
      {showSuccessPopup && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#fff',
            padding: '2rem',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            borderRadius: '10px',
            zIndex: 1000,
            textAlign: 'center',
          }}
        >
          <h2 style={{ color: 'green' }}>Congratulations! 🎉</h2>
          <p>
            You guessed the word: <strong>{wordToGuess.toUpperCase()}</strong>
          </p>
          <button
            onClick={() => {
              setShowSuccessPopup(false);
              setPlayConfetti(false); // Stop confetti
            }}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              fontSize: '1rem',
              cursor: 'pointer',
            }}
          >
            Close
          </button>
        </div>
      )}

      {/* Failure Popup */}
      {showFailurePopup && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#fff',
            padding: '2rem',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            borderRadius: '10px',
            zIndex: 1000,
            textAlign: 'center',
          }}
        >
          <h2 style={{ color: 'red' }}>Oops! 😔</h2>
          <p>You made an incorrect guess. Try again!</p>
          <p>
            Incorrect guesses: <strong>{incorrectGuesses}</strong>
          </p>
          <button
            onClick={() => {
              setShowFailurePopup(false);
            }}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              fontSize: '1rem',
              cursor: 'pointer',
            }}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
