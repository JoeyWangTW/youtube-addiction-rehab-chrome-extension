import React, { useEffect, useState } from 'react';

interface TitleEvalResultProps {
  result: {
    evaluation_rating: string;
    evaluation_context: string;
  };
}

const ratingToClassName = (rating: string): string => {
  switch (rating) {
    case 'relevant':
      return 'bg-green-200'; // Corresponding Tailwind class
    case 'not_sure':
      return 'bg-yellow-200';
    case 'irrelevant':
      return 'bg-orange-200';
    case 'avoid':
      return 'bg-red-200';
    default:
      return 'bg-white';
  }
};

export const TitleEvalResult: React.FC<TitleEvalResultProps & { onUnblock?: () => void }> = ({ result, onUnblock }) => {
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const ratingColor = ratingToClassName(result.evaluation_rating);

  const handleButtonClick = () => {
    setShowInput(true);
  };

  useEffect(() => {
    if (inputValue === 'this video is not a distraction' && onUnblock) {
      onUnblock();
    }
  }, [inputValue, onUnblock]);

  return (
    <div className={`w-2/3 my-8 text-black rounded-xl p-4 text-xl ${ratingColor}`}>
      <p>{result.evaluation_context}</p>
      {(result.evaluation_rating === 'not_sure' || result.evaluation_rating === 'irrelevant') && onUnblock && (
        <div className="flex justify-end items-end">
          {!showInput && (
            <button onClick={handleButtonClick} className="mt-2 p-2 bg-gray-200 text-gray-500 rounded-xl">
              Unblock
            </button>)
          }
          {showInput && (
            <div className="mt-4 w-full">
              <div className="text-gray-500 mb-2">Type <strong>"this video is not a distraction"</strong> to unblock</div>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="p-4 border rounded w-full"
                placeholder="Persistence is the key to success"
                onKeyDown={(e) => e.stopPropagation()}
              />
            </div>
          )}
        </div>
      )
      }
    </div >
  );
};

export const Analyzing: React.FC = () => {
  return (
    <div className="w-full h-[500px] flex justify-center items-center">
      <div className="text-center text-white">
        <div className="animate-bounce text-7xl">🤖</div>
        <div className="mt-8 text-7xl font-mono">Analyzing Content...</div>
      </div>
    </div>
  );
};

