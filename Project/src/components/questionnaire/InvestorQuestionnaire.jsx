import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, ChevronLeft, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const questions = [
  {
    id: 1,
    question: "What is your primary investment goal?",
    options: [
      { text: "Preserve capital and generate stable income", score: 1 },
      { text: "Balance between growth and income", score: 2 },
      { text: "Maximize long-term capital appreciation", score: 3 }
    ]
  },
  {
    id: 2,
    question: "How would you react if your portfolio dropped 20% in a month?",
    options: [
      { text: "Sell immediately to prevent further losses", score: 1 },
      { text: "Wait and monitor the situation closely", score: 2 },
      { text: "Buy more at lower prices", score: 3 }
    ]
  },
  {
    id: 3,
    question: "What is your investment time horizon?",
    options: [
      { text: "Less than 3 years", score: 1 },
      { text: "3-7 years", score: 2 },
      { text: "More than 7 years", score: 3 }
    ]
  },
  {
    id: 4,
    question: "What annual return do you expect from your investments?",
    options: [
      { text: "4-6% (preservation focused)", score: 1 },
      { text: "7-12% (balanced growth)", score: 2 },
      { text: "15%+ (aggressive growth)", score: 3 }
    ]
  },
  {
    id: 5,
    question: "How much of your income do you allocate to investments?",
    options: [
      { text: "Less than 10%", score: 1 },
      { text: "10-25%", score: 2 },
      { text: "More than 25%", score: 3 }
    ]
  },
  {
    id: 6,
    question: "How do you feel about investing in volatile growth stocks?",
    options: [
      { text: "Uncomfortable - I prefer stable, dividend-paying stocks", score: 1 },
      { text: "Okay with a small allocation", score: 2 },
      { text: "Excited - high risk, high reward", score: 3 }
    ]
  },
  {
    id: 7,
    question: "What's your experience level with investing?",
    options: [
      { text: "Beginner - just starting out", score: 1 },
      { text: "Intermediate - a few years of experience", score: 2 },
      { text: "Advanced - extensive knowledge and experience", score: 3 }
    ]
  },
  {
    id: 8,
    question: "How would you describe your current financial situation?",
    options: [
      { text: "Need to protect what I have", score: 1 },
      { text: "Stable with room for moderate risk", score: 2 },
      { text: "Very secure, can take significant risks", score: 3 }
    ]
  },
  {
    id: 9,
    question: "Which best describes your preferred investment style?",
    options: [
      { text: "Value investing - buy undervalued, stable companies", score: 1 },
      { text: "Blend of value and growth strategies", score: 2 },
      { text: "Growth investing - focus on high-growth potential", score: 3 }
    ]
  },
  {
    id: 10,
    question: "How often do you review and rebalance your portfolio?",
    options: [
      { text: "Rarely - I prefer a set-and-forget approach", score: 1 },
      { text: "Quarterly or semi-annually", score: 2 },
      { text: "Frequently - I actively manage my positions", score: 3 }
    ]
  },
  {
    id: 11,
    question: "What's your view on emerging markets and speculative investments?",
    options: [
      { text: "Avoid them - too risky", score: 1 },
      { text: "Small allocation for diversification", score: 2 },
      { text: "Significant allocation for growth potential", score: 3 }
    ]
  },
  {
    id: 12,
    question: "How important is regular income from your investments?",
    options: [
      { text: "Very important - I rely on dividends/income", score: 1 },
      { text: "Somewhat important", score: 2 },
      { text: "Not important - focused on capital gains", score: 3 }
    ]
  }
];

export default function InvestorQuestionnaire({ onComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selectedOption, setSelectedOption] = useState(null);

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleSelect = (optionIndex, score) => {
    setSelectedOption(optionIndex);
    setAnswers({
      ...answers,
      [questions[currentQuestion].id]: {
        question_id: questions[currentQuestion].id,
        answer: questions[currentQuestion].options[optionIndex].text,
        score
      }
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(answers[questions[currentQuestion + 1]?.id] ? 
        questions[currentQuestion + 1].options.findIndex(o => 
          o.text === answers[questions[currentQuestion + 1].id].answer
        ) : null
      );
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      const prevAnswer = answers[questions[currentQuestion - 1].id];
      setSelectedOption(prevAnswer ? 
        questions[currentQuestion - 1].options.findIndex(o => o.text === prevAnswer.answer) : null
      );
    }
  };

  const handleComplete = () => {
    const totalScore = Object.values(answers).reduce((sum, a) => sum + a.score, 0);
    const maxScore = questions.length * 3;
    const percentage = (totalScore / maxScore) * 100;
    
    let category;
    let riskScore;
    
    if (percentage <= 40) {
      category = 'conservative';
      riskScore = Math.round(percentage * 0.8);
    } else if (percentage <= 70) {
      category = 'moderate';
      riskScore = Math.round(percentage);
    } else {
      category = 'aggressive';
      riskScore = Math.round(50 + percentage * 0.5);
    }

    onComplete({
      category,
      riskScore,
      answers: Object.values(answers),
      totalScore,
      maxScore
    });
  };

  const isLastQuestion = currentQuestion === questions.length - 1;
  const canProceed = selectedOption !== null;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-slate-400">
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <span className="text-sm font-medium text-indigo-400">
            {Math.round(progress)}% Complete
          </span>
        </div>
        <Progress value={progress} className="h-2 bg-slate-800" />
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-8">
            {questions[currentQuestion].question}
          </h2>

          <div className="space-y-4">
            {questions[currentQuestion].options.map((option, index) => (
              <motion.button
                key={index}
                onClick={() => handleSelect(index, option.score)}
                className={cn(
                  "w-full p-5 rounded-xl border text-left transition-all duration-200",
                  "hover:border-indigo-500/50 hover:bg-slate-800/50",
                  selectedOption === index
                    ? "border-indigo-500 bg-indigo-500/10"
                    : "border-slate-700 bg-slate-800/30"
                )}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                    selectedOption === index
                      ? "border-indigo-500 bg-indigo-500"
                      : "border-slate-600"
                  )}>
                    {selectedOption === index && (
                      <CheckCircle className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <span className={cn(
                    "text-lg",
                    selectedOption === index ? "text-white" : "text-slate-300"
                  )}>
                    {option.text}
                  </span>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-6 border-t border-slate-800">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className="border-slate-700 text-slate-300 hover:bg-slate-800"
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          Previous
        </Button>

        {isLastQuestion ? (
          <Button
            onClick={handleComplete}
            disabled={!canProceed}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-8"
          >
            Complete Assessment
            <CheckCircle className="w-5 h-5 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            disabled={!canProceed}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
          >
            Next
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}