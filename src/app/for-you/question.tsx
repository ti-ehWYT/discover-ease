"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { logEvent } from "firebase/analytics";
import Cookies from "js-cookie";
import { Post } from "../../../type/post";
import PostDialog from "@/components/post-dialog";
import { analytics } from "../../../firebase/client";
import Masonry from "react-masonry-css";

const questions = [
  {
    question: "You are a ___ person",
    options: ["Beach", "Mountain"],
  },
  {
    question: "You prefer",
    options: ["Relax", "Adventurous"],
  },
  {
    question: "You more likely to",
    options: ["Reading", "Outdoor"],
  },
  {
    question: "You will choose",
    options: ["Cafe", "Hiking"],
  },
  {
    question: "You like",
    options: ["Quiet", "Happening"],
  },
  {
    question: "Which one describes your holiday most",
    options: ["Peaceful", "Energetic"],
  },
  {
    question: "What food do you prefer?",
    options: ["Fine dining", "Street food"],
  },
  {
    question: "You will prefer...",
    options: ["Beautiful view", "Activities"],
  },
];
const breakpointColumnsObj = {
  default: 3,
  1024: 2,
  640: 1,
};
export default function Question({ data }: { data: Post[] }) {
  const [started, setStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [finished, setFinished] = useState(false);
  const saved = Cookies.get("travelAnswers");
  const userPreference = saved ? JSON.parse(saved) : [];

  const taggedPosts = data.filter((post) =>
    post.user_preference?.some((prefer) => userPreference.includes(prefer))
  );

  const untaggedPosts = data.filter(
    (post) => !post.user_preference?.some((prefer) => userPreference.includes(prefer))
  );

  const finalPosts =
    taggedPosts.length > 0 ? [...taggedPosts, ...untaggedPosts] : data;

  const handleStart = () => {
    setStarted(true);
  };

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);
    if (analytics) {
      logEvent(analytics, "user_preference", {
        user_preference: newAnswers,
      });
    }
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setFinished(true);
    }
  };

  const handleRestart = () => {
    setStarted(false);
    setFinished(false);
    setAnswers([]);
    setCurrentQuestion(0);
    Cookies.remove("travelAnswers");
  };

  const handleComplete = () => {
    setFinished(false);
    Cookies.set("travelAnswers", JSON.stringify(answers), {
      expires: 365,
    });
  };

  return (
    <div>
      {!started && !finished && !saved && (
        <div className="py-10">
          <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
            Want to get a trip just for you?
          </h1>

          <h4 className="text-center text-balance mt-4">
            Answer some questions to let me know you more!
          </h4>

          <div className="flex justify-center mt-6">
            <Button className="px-8 py-4 text-lg" onClick={handleStart}>
              Start now
            </Button>
          </div>
        </div>
      )}

      {started && !finished && !saved && (
        <div className="text-center py-10">
          <h2 className="text-2xl font-semibold mb-6">
            {questions[currentQuestion].question}
          </h2>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {questions[currentQuestion].options.map((option, index) => (
              <Button
                key={index}
                className="px-6 py-3 text-base"
                onClick={() => handleAnswer(option)}
              >
                {option}
              </Button>
            ))}
          </div>
        </div>
      )}

      {finished && (
        <div className="text-center py-10">
          <h2 className="text-3xl font-bold mb-4">Your Travel Style</h2>
          <ul className="text-left bg-muted p-6 rounded-xl shadow space-y-2">
            {questions.map((q, i) => (
              <li key={i}>
                <span className="font-medium">{q.question}</span>:{" "}
                <span>{answers[i]}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6">
            <Button onClick={handleRestart}>Start Over</Button>
            <Button className="ml-4" onClick={handleComplete}>
              Complete
            </Button>
          </div>
        </div>
      )}

      {saved && (
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {finalPosts.map((item) => (
            <div key={item.id} className="mb-4 break-inside-avoid">
              <PostDialog postItem={item} allowEdit={false} />
            </div>
          ))}
          {finalPosts.length === 0 && (
            <div className="text-center col-span-full my-masonry-grid text-gray-500">
              No posts matched your preferences.
            </div>
          )}
        </Masonry>
      )}
    </div>
  );
}
