import React, {useState} from "react";
import {Difficulty, fetchQuizQuestions, QuestionState} from "./API";
import QuestionCard from "./components/QuestionCart";

export type AnswerObject = {
    question: string;
    answer: string;
    correct: boolean;
    correctAnswer: string;
}

const TOTAL_QUESTIONS = 10;

const App = () => {
    const [loading, setLoading] = useState(false);
    const [questions, setQuestions] = useState<QuestionState[]>([]);
    const [number, setNumber] = useState(0);
    const [userAnswers, setUserAnswers] = useState<AnswerObject[]>([]);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(true);

    console.log(questions);

    const startTrivia = async () => {
        setLoading(true);
        setGameOver(false);

        const newQuestions = await fetchQuizQuestions(
            TOTAL_QUESTIONS,
            Difficulty.EASY
        );

        setQuestions(newQuestions);
        setScore(0);
        setUserAnswers([]);
        setNumber(0);
        setLoading(false);

    }

    const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!gameOver) {
            //Users Answer
            const answer = e.currentTarget.value
            // Check answer against correct answer
            const correct = questions[number].correct_answer === answer;
            //Add score if answer in correct.
            if (correct) setScore(prev => prev + 1);
            // Save answer in the array for user answers
            const answerObject = {
                question: questions[number].question,
                answer,
                correct,
                correctAnswer: questions[number].correct_answer
            };
            setUserAnswers(prev => [...prev, answerObject]);
        }
    }

    const nextQuestion = () => {
        // Move on to the next question in not the last question
        const nextQuestion = number + 1;

        if (nextQuestion === TOTAL_QUESTIONS) {
            setGameOver(true);
        } else {
            setNumber(nextQuestion);
        }
    }

    return (
        <div className="App">
            <h1>REACT QUIZ</h1>
            {gameOver || userAnswers.length === TOTAL_QUESTIONS ? (
                <button className="start" onClick={startTrivia}>
                    Start
                </button>
            ) : null}
            {!gameOver ? <p className="score">Score: </p> : null}
            {loading && <p>Loading Questions...</p>}
            {!loading && !gameOver && (
                <QuestionCard
                    question={questions[number].question}
                    answers={questions[number].answer}
                    callback={checkAnswer}
                    userAnswer={userAnswers ? userAnswers[number] : undefined}
                    questionNr={number + 1}
                    totalQuestions={TOTAL_QUESTIONS}
                />
            )}
            {!gameOver && !loading && userAnswers.length === number + 1 && number !== TOTAL_QUESTIONS - 1 ? (
                <button className="next" onClick={nextQuestion}>
                    Next
                </button>
            ): null}
        </div>
    );
}

export default App;
