import React, { useState, useRef, useEffect } from "react";
import "./App.css";

function App() {
  const [word, setWord] = useState("");
  const [definition, setDefinition] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSearch = async () => {
    if (!word.trim()) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        `https://your-api-id.execute-api.region.amazonaws.com/define?word=${word}`
      );
      const data = await response.json();

      if (response.ok) {
        setDefinition(data.definition);
        setError("");
        
        // Add to search history (avoid duplicates)
        setSearchHistory(prev => {
          const filtered = prev.filter(item => item.toLowerCase() !== word.toLowerCase());
          return [word, ...filtered].slice(0, 5);
        });
      } else {
        setDefinition(null);
        setError(data.error || "Word not found in our dictionary.");
      }
    } catch (err) {
      setError("Unable to connect to dictionary service. Please try again.");
      setDefinition(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleHistoryClick = (historyWord) => {
    setWord(historyWord);
    setTimeout(() => handleSearch(), 100);
  };

  const copyDefinition = async () => {
    if (definition) {
      await navigator.clipboard.writeText(`${word}: ${definition}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const speakWord = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="app-container">
      {/* Animated background elements */}
      <div className="background-decoration">
        <div className="floating-circle circle-1"></div>
        <div className="floating-circle circle-2"></div>
        <div className="floating-circle circle-3"></div>
      </div>

      <div className="main-content">
        {/* Header */}
        <div className="header">
          <div className="header-icon-container">
            <div className="icon-background">
              <svg className="book-icon" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/>
              </svg>
            </div>
            <div className="sparkle">✨</div>
          </div>
          <h1 className="main-title">Cloud Dictionary</h1>
          <p className="subtitle">Discover meanings, expand your vocabulary</p>
        </div>

        {/* Search Section */}
        <div className="search-container">
          <div className="search-card">
            <div className="input-container">
              <div className="search-input-wrapper">
                <div className="search-icon">
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
                  </svg>
                </div>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Enter any word..."
                  value={word}
                  onChange={(e) => setWord(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="search-input"
                  disabled={isLoading}
                />
                {word && (
                  <button
                    onClick={speakWord}
                    className="speak-button"
                    title="Pronounce word"
                  >
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.764L4.683 14H2a1 1 0 01-1-1V7a1 1 0 011-1h2.683l3.7-2.764a1 1 0 011 .84zm4.025 1.271a1 1 0 011.414 0 8 8 0 010 11.314 1 1 0 01-1.414-1.414 6 6 0 000-8.486 1 1 0 010-1.414zm-2.025 2.147a1 1 0 011.414 0 4 4 0 010 5.664 1 1 0 01-1.414-1.414 2 2 0 000-2.828 1 1 0 010-1.414z" clipRule="evenodd"/>
                    </svg>
                  </button>
                )}
              </div>
            </div>
            
            <button
              onClick={handleSearch}
              disabled={!word.trim() || isLoading}
              className={`search-button ${isLoading ? 'loading' : ''}`}
            >
              {isLoading ? (
                <div className="loading-container">
                  <div className="spinner"></div>
                  Searching...
                </div>
              ) : (
                "Search Definition"
              )}
            </button>
          </div>
        </div>

        {/* Results Section */}
        {(definition || error) && (
          <div className="results-container">
            <div className="results-card">
              {definition && (
                <div>
                  <div className="result-header">
                    <h2 className="word-title">{word}</h2>
                    <div className="action-buttons">
                      <button
                        onClick={copyDefinition}
                        className="action-button"
                        title="Copy definition"
                      >
                        {copied ? (
                          <svg fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                          </svg>
                        ) : (
                          <svg fill="currentColor" viewBox="0 0 20 20">
                            <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"/>
                            <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"/>
                          </svg>
                        )}
                      </button>
                      <button
                        onClick={speakWord}
                        className="action-button"
                        title="Pronounce word"
                      >
                        <svg fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.764L4.683 14H2a1 1 0 01-1-1V7a1 1 0 011-1h2.683l3.7-2.764a1 1 0 011 .84zm4.025 1.271a1 1 0 011.414 0 8 8 0 010 11.314 1 1 0 01-1.414-1.414 6 6 0 000-8.486 1 1 0 010-1.414z" clipRule="evenodd"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <div className="definition-box">
                    <p className="definition-text">
                      <span className="definition-label">Definition:</span> {definition}
                    </p>
                  </div>
                </div>
              )}
              
              {error && (
                <div className="error-box">
                  <p className="error-text">
                    <span className="error-label">Error:</span> {error}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Search History */}
        {searchHistory.length > 0 && (
          <div className="history-container">
            <div className="history-card">
              <h3 className="history-title">
                <span className="history-dot"></span>
                Recent Searches
              </h3>
              <div className="history-tags">
                {searchHistory.map((historyWord, index) => (
                  <button
                    key={index}
                    onClick={() => handleHistoryClick(historyWord)}
                    className="history-tag"
                  >
                    {historyWord}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;