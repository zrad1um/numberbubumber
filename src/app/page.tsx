"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";

interface GuessHistory {
  guess: number;
  result: string;
}

export default function NumberGuesser() {
  const [targetNumber, setTargetNumber] = useState<number>(0);
  const [guess, setGuess] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [attempts, setAttempts] = useState<number>(0);
  const [gameStatus, setGameStatus] = useState<"idle" | "playing" | "won" | "lost">("idle");
  const [history, setHistory] = useState<GuessHistory[]>([]);
  const [difficulty, setDifficulty] = useState<"baby mode" | "normie" | "MASOCHIST">("normie");
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const startNewGame = () => {
    let maxNumber = 1000;
    let maxAttempts = 15;

    if (difficulty === "baby mode") {
      maxNumber = 100;
      maxAttempts = 10;
    } else if (difficulty === "MASOCHIST") {
      maxNumber = 10000;
      maxAttempts = 20;
    }

    const newTargetNumber = Math.floor(Math.random() * maxNumber) + 1;
    setTargetNumber(newTargetNumber);
    setGuess("");
    setMessage(`Guess a number between 1 and ${maxNumber} (or don't, I don't care)`);
    setAttempts(maxAttempts);
    setGameStatus("playing");
    setHistory([]);
  };

  const checkGuess = () => {
    const guessedNumber = parseInt(guess);
    
    if (isNaN(guessedNumber)) {
      setMessage("Wow, numbers are hard, huh? Maybe try one of those?");
      return;
    }

    const remainingAttempts = attempts - 1;
    setAttempts(remainingAttempts);

    let resultMessage = "";
    const newHistory = [...history];

    if (guessedNumber === targetNumber) {
      resultMessage = `🎉 Wow, you did it! The number was ${numberToWords(targetNumber)} (${targetNumber}). Want a cookie?`;
      setGameStatus("won");
      newHistory.push({ guess: guessedNumber, result: "Miracle" });
    } else if (guessedNumber < targetNumber) {
      resultMessage = `🔺 Too low! ${numberToWords(guessedNumber)} (${guessedNumber}) is pathetic. ${remainingAttempts} attempts left before you embarrass yourself further.`;
      newHistory.push({ guess: guessedNumber, result: "Weak" });
    } else {
      resultMessage = `🔻 Too high! ${numberToWords(guessedNumber)} (${guessedNumber}) is delusional. ${remainingAttempts} attempts left before we call it quits.`;
      newHistory.push({ guess: guessedNumber, result: "Overachiever" });
    }

    setMessage(resultMessage);
    setHistory(newHistory);

    if (remainingAttempts <= 0 && guessedNumber !== targetNumber) {
      setMessage(`😢 Game over! The number was ${numberToWords(targetNumber)} (${targetNumber}). Maybe try finger painting instead?`);
      setGameStatus("lost");
    }

    setGuess("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (gameStatus !== "playing") {
        startNewGame();
      } else {
        checkGuess();
      }
    }
  };

  const numberToWords = (num: number): string => {
    const units = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
    const teens = ["ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
    const tens = ["", "ten", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

    if (num === 0) return "zero";
    if (num < 0) return "minus " + numberToWords(Math.abs(num));

    let words = "";

    if (Math.floor(num / 1000) > 0) {
      words += numberToWords(Math.floor(num / 1000)) + " thousand ";
      num %= 1000;
    }

    if (Math.floor(num / 100) > 0) {
      words += units[Math.floor(num / 100)] + " hundred ";
      num %= 100;
    }

    if (num > 0) {
      if (words !== "") words += "and ";

      if (num < 10) {
        words += units[num];
      } else if (num < 20) {
        words += teens[num - 10];
      } else {
        words += tens[Math.floor(num / 10)];
        if (num % 10 > 0) {
          words += " " + units[num % 10];
        }
      }
    }

    return words.trim();
  };

  const getDifficultyColor = () => {
    switch (difficulty) {
      case "baby mode": return "bg-pink-500";
      case "normie": return "bg-yellow-500";
      case "MASOCHIST": return "bg-red-700";
      default: return "bg-blue-500";
    }
  };

  if (!mounted) return null;

  return (
    <div className={`min-h-screen flex flex-col ${resolvedTheme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <div className="w-full max-w-md mx-auto p-4 flex-1 flex flex-col sm:max-w-lg md:max-w-xl lg:max-w-2xl">
        <header className="flex justify-between items-center mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold">
            YOPTABUBUMBER GUESSER YOPTA
          </h1>
          <button
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            className="p-2"
            aria-label="Toggle theme"
          >
            {resolvedTheme === 'dark' ? (
              <SunIcon className="h-5 w-5 sm:h-6 sm:w-6" />
            ) : (
              <MoonIcon className="h-5 w-5 sm:h-6 sm:w-6" />
            )}
          </button>
        </header>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`mb-4 sm:mb-6 p-4 rounded-lg ${
            resolvedTheme === 'dark' ? 'bg-gray-900' : 'bg-gray-100 shadow'
          }`}
        >
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg sm:text-xl font-semibold">
              Guess the magic yoptabubumber yopta
            </h2>
            <div className={`px-3 py-1 rounded-full text-xs font-bold text-white ${getDifficultyColor()}`}>
              {difficulty.toUpperCase()}
            </div>
          </div>

          <p className={`text-sm sm:text-base ${
            resolvedTheme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {gameStatus === "idle" ? "Select your difficulty level (or don't, I'm not your boss)" : message}
          </p>

          {gameStatus === "playing" && (
            <p className={`mt-2 text-sm sm:text-base ${
              resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Attempts remaining: {attempts} (not that you&rsquo;ll need them all)
            </p>
          )}
        </motion.div>

        <div className="grid grid-cols-1 gap-3 mb-4 sm:mb-6">
          {gameStatus !== "playing" ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={startNewGame}
              className={`p-3 sm:p-4 rounded-lg font-medium text-white ${
                resolvedTheme === 'dark' 
                  ? 'bg-blue-600 hover:bg-blue-500' 
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {gameStatus === "idle" ? "Start New Game (I believe in you!)" : "Try Again (Third time's the charm?)"}
            </motion.button>
          ) : (
            <div className={`p-3 sm:p-4 rounded-lg ${
              resolvedTheme === 'dark' ? 'bg-gray-900' : 'bg-gray-100 shadow'
            }`}>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  onKeyDown={handleKeyPress}
                  min="1"
                  max={difficulty === "baby mode" ? "100" : difficulty === "normie" ? "1000" : "10000"}
                  className={`flex-1 p-2 sm:p-3 rounded-lg ${
                    resolvedTheme === 'dark' 
                      ? 'bg-gray-800 text-white' 
                      : 'bg-white text-gray-900'
                  }`}
                  placeholder={`Enter guess (1-${difficulty === "baby mode" ? "100" : difficulty === "normie" ? "1000" : "10000"})`}
                />
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={checkGuess}
                  className={`p-2 sm:p-3 rounded-lg font-medium text-white ${
                    resolvedTheme === 'dark' 
                      ? 'bg-green-600 hover:bg-green-500' 
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  Guess (or don&#39;t)
                </motion.button>
              </div>
            </div>
          )}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`mb-4 sm:mb-6 p-4 rounded-lg ${
            resolvedTheme === 'dark' ? 'bg-gray-900' : 'bg-gray-100 shadow'
          }`}
        >
          <h3 className="text-sm sm:text-base font-medium mb-2">
            SELECT YOUR PAIN LEVEL
          </h3>
          <div className="grid grid-cols-3 gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setDifficulty("baby mode")}
              className={`p-2 sm:p-3 rounded-lg text-xs sm:text-sm font-medium ${
                difficulty === "baby mode" 
                  ? 'bg-pink-500 text-white' 
                  : resolvedTheme === 'dark' 
                    ? 'bg-gray-800 hover:bg-gray-700' 
                    : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              Baby Mode (1-100)
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setDifficulty("normie")}
              className={`p-2 sm:p-3 rounded-lg text-xs sm:text-sm font-medium ${
                difficulty === "normie" 
                  ? 'bg-yellow-500 text-white' 
                  : resolvedTheme === 'dark' 
                    ? 'bg-gray-800 hover:bg-gray-700' 
                    : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              Normie (1-1000)
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setDifficulty("MASOCHIST")}
              className={`p-2 sm:p-3 rounded-lg text-xs sm:text-sm font-medium ${
                difficulty === "MASOCHIST" 
                  ? 'bg-red-700 text-white' 
                  : resolvedTheme === 'dark' 
                    ? 'bg-gray-800 hover:bg-gray-700' 
                    : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              MASOCHIST (1-10000)
            </motion.button>
          </div>
        </motion.div>

        {history.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`flex-1 p-4 rounded-lg overflow-y-auto max-h-[200px] sm:max-h-[300px] ${
              resolvedTheme === 'dark' 
                ? 'bg-gray-900' 
                : 'bg-gray-100 shadow'
            }`}
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className={`text-xs sm:text-sm ${
                resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                YOUR PATH OF FAILURE
              </h3>
              <span className={`text-xs sm:text-sm ${
                resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {history.length} questionable decisions
              </span>
            </div>
            <ul className="space-y-2">
              {history.map((item, index) => (
                <motion.li 
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-2 rounded-lg flex justify-between items-center ${
                    resolvedTheme === 'dark' ? 'bg-gray-800' : 'bg-white'
                  }`}
                >
                  <span className="font-medium">
                    {numberToWords(item.guess)} ({item.guess})
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    item.result === "Miracle" 
                      ? 'bg-green-500 text-white' 
                      : resolvedTheme === 'dark' 
                        ? 'bg-gray-700 text-gray-300' 
                        : 'bg-gray-200 text-gray-700'
                  }`}>
                    {item.result}
                  </span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}

        <footer className={`mt-4 pt-4 text-center text-xs sm:text-sm ${
          resolvedTheme === 'dark' ? 'text-gray-500' : 'text-gray-400'
        }`}>
          <p>© 2025 Yoptagoyda LLC.</p>
        </footer>
      </div>
    </div>
  );
}