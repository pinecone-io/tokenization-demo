'use client'

import { Suspense, useState } from 'react';

const getColorForToken = (token: string) => {
  const tokenStr = typeof token === 'string' ? token : String(token);
  const tokenId = tokenStr.charCodeAt(0);
  const hue = (tokenId * 137.508) % 360;
  return `hsl(${hue}, 50%, 80%)`;
};

function TokenizationDemo() {
  const [inputText, setInputText] = useState('');
  const [tokens, setTokens] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const generateTokens = async () => {
    try {
      setError(null);  // Clear any previous errors
      const response = await fetch('/api/tokens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputText }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate tokens');
      }

      const data = await response.json();
      console.log(`data: %o`, data.tokens);
      setTokens(data.tokens);
    } catch (error) {
      console.error('Error generating tokens:', error);
      setError('There was an error generating tokens. Please try again.');
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const handleTokenizeClick = () => {
    generateTokens();
  };

  return (
    <div className='flex flex-col items-center justify-center h-full rounded-2xl mt-10 bg-cover text-black'>
      <div className="backdrop-blur-sm bg-white/30 border-dotted rounded-lg border-2 border-gray-300 p-1 sm:p-5 md:p-12 md:max-w-[90%]">
        <h1 className="text-sm sm:text-xl md:text-4xl font-medium sm:font-normal mb-10">Tokenization Demo</h1>
        <p className="text-xs md:text-base text-gray-700 text-pretty mb-6">This interactive demo showcases the process of tokenization, a fundamental technique used in natural language processing (NLP) and generative AI.</p>
        <p className="text-xs md:text-base text-gray-700 text-pretty mb-6">Enter any text into the input field below...</p>
        <div className="mb-6">
          <input
            type="text"
            id="input-text"
            name="input-text"
            onChange={handleInputChange}
            value={inputText}
            className="mt-1 block w-full rounded-md bg-white border border-gray-300 placeholder-gray-400 text-black focus:border-[#1C17FF] focus:ring focus:ring-[#1C17FF] focus:ring-opacity-50 p-3 shadow-sm"
            placeholder="Type something..."
          />
        </div>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" role="alert">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <div className="mb-6">
          <p className="text-xs md:text-base text-gray-700 text-pretty mb-6">As you type, your sentence is split into words, the way us humans tend to see and read them:</p>
          <div className="inline-block">
            {inputText.split(' ').map((word, index) => (
              <span
                key={index}
                className="inline-block px-3 py-2 text-lg font-bold text-white text-shadow"
                style={{
                  backgroundColor: getColorForToken(word),
                  textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
                  margin: '0 4px',
                }}
              >
                {word}
              </span>
            ))}
          </div>
          <br />
          <p className="text-xs md:text-base text-gray-700 text-pretty mt-6 mb-6">But how does a machine see them? Click the button below to tokenize your text, which will convert your words into token IDs for a given vocabulary.</p>
          <button
            className="bg-[#1C17FF] hover:bg-[#1C17FF]/80 text-white font-bold py-2 px-4 rounded mb-6"
            onClick={handleTokenizeClick}
          >
            Tokenize text
          </button>
          <p className="text-xs md:text-base text-gray-700 text-pretty mb-6">These are the token IDs that the tiktoken library assigned to your words. This is closer to how ChatGPT and other LLMs see your text when you write a prompt in natural language:</p>
          <div>
            {tokens.map((token, index) => (
              <span
                key={index}
                className="inline-block px-3 py-2 text-lg font-bold text-white text-shadow"
                style={{
                  backgroundColor: getColorForToken(token),
                  textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
                  margin: '0 4px',
                }}
              >
                {token}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TokenizationDemoWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TokenizationDemo />
    </Suspense>
  );
}

