import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { getPracticeTypeDetails, savePracticeResult } from '../../services/PracticeService';
import ThemeToggle from '../../components/ThemeToggle';
import Button from '../../components/Button';
import toast from 'react-hot-toast';

const Questionary = () => {
    const params = useParams();
    const practiceTypeId = params.practice_id;

    const navigate = useNavigate();
    const { isDark } = useTheme();
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [currentQuestion, setCurrentQuestion] = useState(1);
    const [answersByQuestion, setAnswersByQuestion] = useState({});

    const [practice, setPractice] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchPracticeTypeQuestions = async () => {
            try {
                const res = await getPracticeTypeDetails(practiceTypeId);
                const practice = res.data.data;
                const apiQuestions = res.data.data.assessment.questions;

                setQuestions(apiQuestions);
                setPractice(practice);
            } catch (error) {
                toast.error(error?.response?.data?.message || 'An error occurred while fetching practice questions.');
            } finally {
                setLoading(false);
            }
        };
        fetchPracticeTypeQuestions();
    }, [practiceTypeId]);

    const totalQuestions = questions.length;

    const currentQuestionData = questions[currentQuestion - 1];

    const question = currentQuestionData?.question || '';
    const answers = currentQuestionData?.options || [];

    const progressPercentage = totalQuestions ? (currentQuestion / totalQuestions) * 100 : 0;

    useEffect(() => {
        const savedAnswer = answersByQuestion[currentQuestion];
        setSelectedAnswer(savedAnswer !== undefined ? savedAnswer : null);
    }, [currentQuestion, answersByQuestion]);

    const handleAnswerSelect = index => {
        setSelectedAnswer(index);
        setAnswersByQuestion(prev => ({
            ...prev,
            [currentQuestion]: index,
        }));
    };

    const calculateResult = () => {
        let correctAnswers = 0;

        questions.forEach((question, index) => {
            const selectedIndex = answersByQuestion[index + 1];

            if (selectedIndex !== undefined && question.options[selectedIndex] === question.correctAnswer) {
                correctAnswers++;
            }
        });

        const totalQuestions = questions.length;
        const score = Math.round((correctAnswers / totalQuestions) * 100);

        return {
            score,
            correctAnswers,
            totalQuestions,
        };
    };

    const buildFinalPayload = () => {
        const answers = buildAnswersPayload();
        const result = calculateResult();

        return {
            score: result.score,
            totalQuestions: result.totalQuestions,
            correctAnswers: result.correctAnswers,
            durationInSec: 120,
            answers,
        };
    };

    const handleNext = async () => {
        if (selectedAnswer === null) return;

        if (currentQuestion < totalQuestions) {
            setCurrentQuestion(prev => prev + 1);
            return;
        }

        // Start loading
        setIsSubmitting(true);

        try {
            const payload = buildFinalPayload();
            const res = await savePracticeResult(practiceTypeId, payload);
            navigate('/questionaryFinalization', {
                state: {
                    result: res.data.data,
                    assessmentName: practice?.assessment?.name,
                    practiceTypeId: practiceTypeId,
                },
            });
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to save practice result');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleBack = () => {
        if (currentQuestion > 1) {
            setCurrentQuestion(currentQuestion - 1);
        } else {
            navigate('/dashboard');
        }
    };

    const buildAnswersPayload = () => {
        const answersPayload = {};

        questions.forEach((question, index) => {
            const selectedIndex = answersByQuestion[index + 1];
            if (selectedIndex !== undefined) {
                answersPayload[question.id] = selectedIndex;
            }
        });

        return answersPayload;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-white text-lg">Loading questions...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[url('/images/Value-Selling-Assessment.png')] bg-cover bg-center relative">
            <div className="max-w-[1440px] mx-auto">
                <div className="px-[44px] pt-[28px] pb-[16px] md:py-[16px] flex justify-between items-center flex-col md:flex-row gap-[8px] relative z-10">
                    <div className="text-white text-2xl font-semibold">AkzoNobel</div>
                    <ThemeToggle bgColor="bg-[#E2E2E2]" />
                </div>

                <div className="relative w-full max-w-[655px] mx-auto px-[13px] pb-[50px]">
                    <div
                        className={`relative rounded-[20px] p-4 md:p-[14px] lg:p-[36px] backdrop-blur-lg ${
                            isDark ? 'bg-[#131313]/80' : 'bg-[linear-gradient(180deg,_rgba(255,255,255,0.83)_58%,_rgba(144,132,113,0.83)_100%)]'
                        }`}
                    >
                        <button onClick={handleBack} className="absolute top-[9px] left-[18px] z-10" aria-label="Go back">
                            <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M18.8125 37.625C22.5333 37.625 26.1705 36.5217 29.2642 34.4545C32.3579 32.3874 34.7691 29.4493 36.193 26.0117C37.6169 22.5742 37.9894 18.7916 37.2635 15.1424C36.5376 11.4931 34.7459 8.14103 32.1149 5.51006C29.484 2.87908 26.1319 1.08737 22.4826 0.361482C18.8334 -0.364401 15.0508 0.00814635 11.6133 1.43202C8.17573 2.85589 5.23762 5.26714 3.17048 8.36084C1.10333 11.4545 -1.96992e-06 15.0917 -1.64464e-06 18.8125C0.00526689 23.8003 1.98899 28.5822 5.51587 32.1091C9.04276 35.636 13.8247 37.6197 18.8125 37.625ZM10.5531 17.7887L16.3415 12.0002C16.6131 11.7287 16.9814 11.5761 17.3654 11.5761C17.7494 11.5761 18.1177 11.7287 18.3892 12.0002C18.6608 12.2717 18.8133 12.64 18.8133 13.024C18.8133 13.4081 18.6608 13.7763 18.3892 14.0479L15.0699 17.3654L26.0481 17.3654C26.4319 17.3654 26.8 17.5178 27.0713 17.7892C27.3427 18.0606 27.4952 18.4287 27.4952 18.8125C27.4952 19.1963 27.3427 19.5644 27.0713 19.8358C26.8 20.1072 26.4319 20.2596 26.0481 20.2596L15.0699 20.2596L18.3892 23.5771C18.6608 23.8487 18.8133 24.217 18.8133 24.601C18.8133 24.985 18.6608 25.3533 18.3892 25.6248C18.1177 25.8963 17.7494 26.0489 17.3654 26.0489C16.9814 26.0489 16.6131 25.8963 16.3415 25.6248L10.5531 19.8363C10.4185 19.7019 10.3118 19.5423 10.239 19.3667C10.1662 19.191 10.1287 19.0027 10.1287 18.8125C10.1287 18.6223 10.1662 18.434 10.239 18.2583C10.3118 18.0827 10.4185 17.9231 10.5531 17.7887Z"
                                    fill={isDark ? 'white' : 'black'}
                                />
                            </svg>
                        </button>

                        <div className="mb-[40px] lg:mb-[30px] mt-[46px] lg:mt-[24px]">
                            <p
                                className={`text-[14px] md:text-[14px] uppercase tracking-[0.5px] mb-[12px] lg:mb-[10px] text-center font-medium ${
                                    isDark ? 'text-[#CECECE]' : 'text-[#757575]'
                                }`}
                            >
                                PRE-SESSION ASSESSMENT
                            </p>
                            <h1
                                className={`text-[26px] md:text-[38px] font-semibold mb-[12px] text-center leading-[35px] lg:leading-[45px] ${
                                    isDark ? 'text-white' : 'text-[#242424]'
                                }`}
                            >
                                {practice?.assessment?.name}
                            </h1>
                            <p className={`text-[18px] md:text-[22px] text-center max-w-[450px] mx-auto ${isDark ? 'text-[#CECECE]' : 'text-[#757575]'}`}>
                                Answer these questions to personalize your practice session.
                            </p>
                        </div>

                        <div className="mb-[35px] lg:mb-[48px]">
                            <div className="flex items-center justify-between mb-2 gap-[12px] flex-col md:flex-row">
                                <div className={`w-full h-1.5 md:h-2 rounded-full overflow-hidden order-2 md:order-1 ${isDark ? 'bg-[#908471]' : 'bg-[#908471]'}`}>
                                    <div
                                        className={`h-full transition-all duration-300 rounded-full ${isDark ? 'bg-[#DCD6CE]' : 'bg-[#FFFAF2]'}`}
                                        style={{ width: `${progressPercentage}%` }}
                                    />
                                </div>
                                <div className={`text-[12px] font-medium whitespace-nowrap order-1 md:order-2 ${isDark ? 'text-[#CECECE]' : 'text-[#757575]'}`}>
                                    Question {currentQuestion} of {totalQuestions}
                                </div>
                            </div>
                        </div>

                        <div
                            className={`p-[18px] pb-[26px] md:p-[24px] rounded-[12px] md:rounded-[20px] mb-[30px] lg:mb-[48px] ${
                                isDark ? 'bg-[#232323]/60' : 'bg-[#908471] bg-opacity-[0.16]'
                            }`}
                        >
                            <div className="mb-[8px] md:mb-[28px]">
                                <p
                                    className={`text-[10px] md:text-[14px] font-medium uppercase tracking-[0.5px] mb-[5px] text-center lg:text-left ${
                                        isDark ? 'text-[#CECECE]' : 'text-[#757575]'
                                    }`}
                                >
                                    QUESTION {currentQuestion}
                                </p>
                                <h2
                                    className={`text-[16px] lg:text-[22px] font-semibold leading-[22px] lg:leading-[30px] mb-0 ${
                                        isDark ? 'text-white' : 'text-[#242424]'
                                    }`}
                                >
                                    {question}
                                </h2>
                            </div>

                            <div className="space-y-2.5 md:space-y-3">
                                {answers.map((answer, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleAnswerSelect(index)}
                                        className={`w-full text-left p-[14px] md:p-[18px] rounded-[10px] md:rounded-[16px] transition-all ${
                                            selectedAnswer === index
                                                ? isDark
                                                    ? 'bg-[#131313] border-1 border-white'
                                                    : 'bg-white border-1 border-[#242424]'
                                                : isDark
                                                ? 'bg-[#131313] border-1 border-[#3a3a3a] hover:border-[#4a4a4a]'
                                                : 'bg-white border-1 border-[#ffffff] hover:border-[#B8A896]'
                                        }`}
                                    >
                                        <div className="flex items-center gap-[8px]">
                                            <div
                                                className={`w-[22px] h-[22px] rounded-full border-[1px] flex items-center justify-center flex-shrink-0 ${
                                                    selectedAnswer === index
                                                        ? isDark
                                                            ? 'border-white bg-white'
                                                            : 'border-[#242424] bg-[#242424]'
                                                        : isDark
                                                        ? 'border-[#908471] bg-transparent'
                                                        : 'border-[#908471] bg-transparent'
                                                }`}
                                            >
                                                {selectedAnswer === index && <div className={`w-2.5 h-2.5 rounded-full ${isDark ? 'bg-black' : 'bg-white'}`} />}
                                            </div>
                                            <span
                                                className={`flex-1 text-[10px] md:text-[14px] leading-[10px] lg:leading-[16px] ${
                                                    isDark ? 'text-white' : 'text-[#000000]'
                                                }`}
                                            >
                                                {answer}
                                            </span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-center gap-[24px] md:gap-[38px]">
                            {currentQuestion > 1 && <Button onClick={handleBack}>Previous</Button>}
                            {/* <Button
                                onClick={handleNext}
                                disabled={selectedAnswer === null}
                                className={`${
                                    selectedAnswer === null
                                        ? 'opacity-50 cursor-not-allowed bg-gray-400 text-gray-600'
                                        : currentQuestion >= totalQuestions
                                        ? '!bg-[#25B045] !text-white hover:!bg-[#25B045]'
                                        : ''
                                }`}
                            >
                                {currentQuestion < totalQuestions ? 'Next Question' : 'Finish Assessment'}
                            </Button> */}
                            <Button
                                onClick={handleNext}
                                disabled={selectedAnswer === null || isSubmitting}
                                className={`${
                                    selectedAnswer === null || isSubmitting
                                        ? 'opacity-50 cursor-not-allowed bg-gray-400 text-gray-600'
                                        : currentQuestion >= totalQuestions
                                        ? '!bg-[#25B045] !text-white hover:!bg-[#25B045]'
                                        : ''
                                }`}
                            >
                                {isSubmitting ? (
                                    <span className="flex justify-center items-center gap-2">
                                        <div className={`w-6 h-6 border-4 border-[#908471] border-t-[#CAD3AC] rounded-full animate-spin`}></div> Calculating...
                                    </span>
                                ) : currentQuestion < totalQuestions ? (
                                    'Next Question'
                                ) : (
                                    'Finish Assessment'
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Questionary;
