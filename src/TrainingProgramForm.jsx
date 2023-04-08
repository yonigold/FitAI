import React, { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { OpanAI } from "openai";
import '@fortawesome/fontawesome-free/css/all.css';


const API_KEY = import.meta.env.VITE_API_KEY;

const TrainingProgramForm = () => {
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [gender, setGender] = useState("");
  const [fitnessLevel, setFitnessLevel] = useState("");
  const [trainingExperience, setTrainingExperience] = useState("");
  const [exerciseFrequency, setExerciseFrequency] = useState("");
  const [fitnessGoal, setFitnessGoal] = useState("");
  const [workoutEnvironment, setWorkoutEnvironment] = useState("");
  const [trainingProgram, setTrainingProgram] = useState("");
  const [loading, setLoading] = useState(false);
  const [formComplete, setFormComplete] = useState(false);

  const checkFormComplete = () => {
    if (
      age &&
      height &&
      gender &&
      fitnessLevel &&
      trainingExperience &&
      exerciseFrequency &&
      fitnessGoal &&
      workoutEnvironment
    ) {
      setFormComplete(true);
    } else {
      setFormComplete(false);
    }
  };
  
  useEffect(() => {
    checkFormComplete();
  }, [age, height, gender, fitnessLevel, trainingExperience, exerciseFrequency, fitnessGoal, workoutEnvironment]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const hasGeneratedProgram = localStorage.getItem("hasGeneratedProgram");
    if (hasGeneratedProgram) {
      alert("You reached the limit of 1 program per user. We will be adding subscription plans soon.");
      return;
    }

    
    setLoading(true);
    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "Act as a personal fitness trainer and create a full training program. Make a professional program that considers science and different fitness techniques.",
          },
          {
            role: "user",
            content: `Please create a personalized ${exerciseFrequency} training program for a ${age}-year-old ${gender} with the following details:
            Fitness Level: ${fitnessLevel}
            Training Experience: ${trainingExperience}
            Fitness Goal: ${fitnessGoal}
            Workout Environment: ${workoutEnvironment}

            The training program should include a balanced mix of exercises, rest days, and suggestions for progression. Please provide a detailed workout plan with specific exercises, sets, reps, and any necessary instructions.
            .`,
          },
        ],
        max_tokens: 2000,
        temperature: 0,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setTrainingProgram(data.choices[0].message.content);
        setLoading(false);

        localStorage.setItem("hasGeneratedProgram", true);
      });
  };

  const trainingProgramFormatted = (trainingProgram) => {
    const lines = trainingProgram.split("\n");
    const formattedLines = lines.map((line, index) => {
      if (line.startsWith("-")) {
        return <li key={index}>{line.slice(1).trim()}</li>;
      } else if (line.startsWith("*")) {
        return <h4 key={index}>{line.slice(1).trim()}</h4>;
      } else {
        return <p key={index}>{line}</p>;
      }
    });
    return formattedLines;
  };
  //   const formattedLines = lines.map((line) => {
  //     return <p>{line}</p>;
  //   });
  //   return formattedLines;
  // };

  return (
    <>

  <header className="title">
      <h1 className="font-sans h1 mb-4 leading-tight aos-init aos-animate sm:text-5xl text-4xlfont-bold text-rose-600 " >FitAI - Your AI Personal Trainer!</h1>
      <h2 className="h1 mb-4 leading-tight aos-init aos-animate sm:text-3xl text-4xlfont-bold text-slate-800">The Best AI Fitness Programs Generator On The Interent!</h2>
      <p className="font-sans text-lg heading-text text-4xl font-bold text-slate-800">As Simple as it gets: Fill out the form and in a few seocnds you will get a full tailored fitness program!</p>
      {/* <div className="header-buttons">
  <button className="mt-3 bg-gradient-to-r from-purple-600 via-purple-600 to-indigo-600 text-white border-0 hover:bg-gradient-to-r hover:from-purple-700 hover:via-purple-700 hover:to-indigo-700 py-0 px-2 font-bold rounded-md transition duration-150 ease-in-out">Sign Up</button>
  <button className="mt-3 bg-gradient-to-r from-purple-600 via-purple-600 to-indigo-600 text-white border-0 hover:bg-gradient-to-r hover:from-purple-700 hover:via-purple-700 hover:to-indigo-700 py-0 px-2 font-bold rounded-md transition duration-150 ease-in-out">Login</button>
</div> */}
    </header>
    <div className="container">
    <form onSubmit={handleSubmit}>
  <label>
    Age:
    <input type="number" value={age} onChange={(e) => setAge(e.target.value)} />
  </label>
  <label>
    Height:
    <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
  </label>
  <label>
    Gender:
    <select value={gender} onChange={(e) => setGender(e.target.value)}>
      <option value="">Select gender</option>
      <option value="male">Male</option>
      <option value="female">Female</option>
    </select>
  </label>
  <label>
    Fitness Level:
    <select value={fitnessLevel} onChange={(e) => setFitnessLevel(e.target.value)}>
      <option value="">Select fitness level</option>
      <option value="beginner">Beginner</option>
      <option value="intermediate">Intermediate</option>
      <option value="advanced">Advanced</option>
    </select>
  </label>
  <label>
    Training Experience:
    <select value={trainingExperience} onChange={(e) => setTrainingExperience(e.target.value)}>
      <option value="">Select training experience</option>
      <option value="beginner">Beginner</option>
      <option value="intermediate">Intermediate</option>
      <option value="advanced">Advanced</option>
    </select>
  </label>
  <label>
    Exercise Frequency:
    <select value={exerciseFrequency} onChange={(e) => setExerciseFrequency(e.target.value)}>
      <option value="">Select exercise frequency</option>
      <option value="1-2">1-2 times per week</option>
      <option value="3-4">3-4 times per week</option>
      <option value="5-6">5-6 times per week</option>
      <option value="7">7 times per week</option>
    </select>
  </label>
  <label>
    Fitness Goal:
    <select value={fitnessGoal} onChange={(e) => setFitnessGoal(e.target.value)}>
      <option value="">Select fitness goal</option>
      <option value="lose weight">Lose weight</option>
      <option value="gain muscle">Gain muscle</option>
      <option value="improve performance">Improve performance</option>
      <option value="other">Other</option>
    </select>
  </label>
  <label>
    Workout Environment:
    <select value={workoutEnvironment} onChange={(e) => setWorkoutEnvironment(e.target.value)}>
      <option value="">Select workout environment</option>
      <option value="home">Home</option>
      <option value="gym">Gym</option>
    </select>
  </label>
  <button id="btn" type="submit" disabled={!formComplete} className="text-rose-600">
  Generate Training Program
</button>
</form>
    <div className="training-program">
      Your Training Program:
      {loading && <p>Loading...</p>}
      {trainingProgram && trainingProgramFormatted(trainingProgram)}
  {/* {trainingProgram && trainingProgramFormatted(trainingProgram)} */}
</div>
   </div> 
   <footer className="flex justify-between items-center py-3 bg-gradient-to-r from-rose-600 via-rose-700 to-purple-800">
  <div>&copy; 2023 FitAI. All rights reserved.</div>
  <div className="flex items-center space-x-4">
    <span>Built by Yoni Goldshtein</span>
    <a href="https://twitter.com/"><i className="fab fa-twitter"></i></a>
    <a href="https://www.linkedin.com/in/yoni-goldshtein-55a30710a"><i className="fab fa-linkedin"></i></a>
    
  </div>
</footer>
{/* fixed bottom-0 w-full */}
     </>
  );
};

export default TrainingProgramForm;
