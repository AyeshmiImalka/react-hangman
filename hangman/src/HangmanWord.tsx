import React, { useState, useEffect } from 'react';

type HangmanWordProps = {
  guessedLetters: string[];
  wordToGuess: string;
  reveal?: boolean;
};

export function HangmanWord({
  guessedLetters,
  wordToGuess,
  reveal = false,
}: HangmanWordProps) {
  const [showSuccessPopup, setShowSuccessPopup] = useState<boolean>(false);
  const [showFailurePopup, setShowFailurePopup] = useState<boolean>(false);
  const [incorrectGuesses, setIncorrectGuesses] = useState<number>(0);

  // Check if the word is completely guessed
  const isWordGuessed = wordToGuess.split("").every((letter) =>
    guessedLetters.includes(letter)
  );

  useEffect(() => {
    if (isWordGuessed) {
      // Show success popup when the word is guessed correctly
      setShowSuccessPopup(true);
    }
  }, [guessedLetters, isWordGuessed]);

  useEffect(() => {
    if (!isWordGuessed && guessedLetters.length > 0) {
      const lastGuess = guessedLetters[guessedLetters.length - 1];
      if (!wordToGuess.includes(lastGuess)) {
        // Show failure popup when the user makes an incorrect guess
        setShowFailurePopup(true);
        setIncorrectGuesses(incorrectGuesses + 1);
      }
    }
  }, [guessedLetters, wordToGuess, isWordGuessed]);

  return (
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          display: "flex",
          gap: ".25em",
          fontSize: "6rem",
          fontWeight: "bold",
          textTransform: "uppercase",
          fontFamily: "monospace",
        }}
      >
        {wordToGuess.split("").map((letter, index) => (
          <span style={{ borderBottom: ".1em solid black" }} key={index}>
            <span
              style={{
                visibility:
                  guessedLetters.includes(letter) || reveal
                    ? "visible"
                    : "hidden",
                color:
                  !guessedLetters.includes(letter) && reveal ? "red" : "black",
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
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#fff",
            padding: "2rem",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            borderRadius: "10px",
            zIndex: 1000,
            textAlign: "center",
          }}
        >
          <h2 style={{ color: "green" }}>Congratulations! 🎉</h2>
          <p>You guessed the word: <strong>{wordToGuess.toUpperCase()}</strong></p>
          <button
            onClick={() => {
              setShowSuccessPopup(false); // Close the popup
            }}
            style={{
              marginTop: "1rem",
              padding: "0.5rem 1rem",
              fontSize: "1rem",
              cursor: "pointer",
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
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#fff",
            padding: "2rem",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            borderRadius: "10px",
            zIndex: 1000,
            textAlign: "center",
          }}
        >
          <h2 style={{ color: "red" }}>Oops! 😔</h2>
          <p>You made an incorrect guess. Try again!</p>
          <p>Incorrect guesses: <strong>{incorrectGuesses}</strong></p>
          <button
            onClick={() => {
              setShowFailurePopup(false); // Close the popup
            }}
            style={{
              marginTop: "1rem",
              padding: "0.5rem 1rem",
              fontSize: "1rem",
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}