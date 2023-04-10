import React, { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import { OpenAI } from "openai";
import { Audio } from 'react-loader-spinner'
import { Link } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.css";

const API_KEY = import.meta.env.VITE_API_KEY;


const TrainingProgramForm = () => {
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [gender, setGender] = useState("");
  const [fitnessLevel, setFitnessLevel] = useState("");
  const [trainingExperience, setTrainingExperience] = useState("");
  const [exerciseFrequency, setExerciseFrequency] = useState("");
  const [fitnessGoal, setFitnessGoal] = useState("");
  const [workoutEnvironment, setWorkoutEnvironment] = useState("");
  const [trainingProgram, setTrainingProgram] = useState("");
  const [loading, setLoading] = useState(false);
  const [formComplete, setFormComplete] = useState(false);
  const [errors, setErrors] = useState({ ageError: "", weightError: "" });


  const checkFormComplete = () => {
    if (
      age &&
      weight &&
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
  }, [
    age,
    weight,
    gender,
    fitnessLevel,
    trainingExperience,
    exerciseFrequency,
    fitnessGoal,
    workoutEnvironment,
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const hasGeneratedProgram = localStorage.getItem("hasGeneratedProgram");
    if (hasGeneratedProgram) {
      alert(
        "You reached the limit of 1 program per user. We will be adding subscription plans soon."
      );
      return;
    }

    const ageError = validateAge(age);
    const weightError = validateWeight(weight);

    if (ageError || weightError) {
      setErrors({ ageError, weightError });
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
            content: `Please create a personalized one week week training program for a ${age}-year-old ${gender} with the following details:
            weight: ${weight} kg
            Fitness Level: ${fitnessLevel}
            Training Experience: ${trainingExperience}
            Fitness Goal: ${fitnessGoal}
            Workout Environment: ${workoutEnvironment}
            trainingd days per week: ${exerciseFrequency}

            The training program should include a balanced mix of exercises, rest days, and suggestions for progression. Please provide a detailed workout plan with specific exercises, sets, reps, and any necessary instructions.
            Please format and style the program in a nice and readable way and make sure to add a line break between each day of the training program.
            In the exercise name, embed a hyperlink to google images search for each exercise in the program. the hyperlink shpuld be directly embeded in the exercise name.
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

  const validateAge = (age) => {
    if (age < 13 || age > 100) {
      return "You must be between 13 and 100 years old to use this service";
    }
    return "";
  };

  const validateWeight = (weight) => {
    if (weight < 40 || weight > 220) {
      return "You must be between 40 and 220 kg to use this service";
    }
    return "";
  };


  // const trainingProgramFormatted = (trainingProgram) => {
  //   const lines = trainingProgram.split("\n");
  //   const formattedLines = lines.map((line, index) => {
  //     if (line.startsWith("-")) {
  //       return <li key={index}>{line.slice(1).trim()}</li>;
  //     } else if (line.startsWith("*")) {
  //       return <h4 className="days" key={index} style={{ marginTop: "3.5rem" }}>{line.slice(1).trim()}</h4>;
  //     } else {
  //       return <p key={index}>{line}</p>;
  //     }
  //   });
  //   return formattedLines;
  // };

  const trainingProgramFormatted = (trainingProgram) => {
    const lines = trainingProgram.split("\n");
    const formattedLines = lines.map((line, index) => {
      if (line.startsWith("-")) {
        return <li key={index}>{line.slice(1).trim()}</li>;
      } else if (line.startsWith("*")) {
        return (
          <div key={index} style={{ marginTop: "1.5rem" }}>
            <h4>{line.slice(1).trim()}</h4>
          </div>
        );
      } else {
        // Extract exercise names from numbered list items
        const exerciseNameRegex = /^\d+\.\s+([^–(]*)/gm;
        const match = exerciseNameRegex.exec(line);
        if (match !== null) {
          const exerciseName = match[1];
          const googleImagesSearchUrl = "https://www.google.com/search?q=";
          const exerciseLink = (
            <a  className="exercise-link"
              href={`${googleImagesSearchUrl}${encodeURIComponent(exerciseName)}&tbm=isch`}
              target="_blank"
              rel="noreferrer"
            >
              {exerciseName}
            </a>
            // <Link to={`${googleImagesSearchUrl}${encodeURIComponent(exerciseName)}`} target="_blank">
            //   {exerciseName}
            // </Link>
          );
          return <li key={index}>{line.slice(0, match.index)}{exerciseLink}{line.slice(match.index + match[0].length)}</li>;
        } else {
          return <p key={index}>{line}</p>;
        }
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
      <Helmet>
        <title>MyFit AI - Your AI Personal Trainer!</title>
        <meta
          name="description"
          content="The Best AI Fitness Programs Generator On The Interent! Simply fill out the form and in a matter of seconds, you'll receive a fully tailored fitness program designed just for you"
        />
        <meta
          property="og:title"
          content="MyFit AI - Your AI Personal Trainer!"
        />
        <meta
          property="og:description"
          content="The Best AI Fitness Programs Generator On The Interent! Simply fill out the form and in a matter of seconds, you'll receive a fully tailored fitness program designed just for you"
        />
      </Helmet>

      <header className="title">
        <h1 className="font-sans h1 mb-4 leading-tight aos-init aos-animate sm:text-5xl text-4xlfont-bold text-transparent bg-gradient-to-r from-rose-600 via-rose-700 to-purple-800 bg-clip-text ">
          MyFit AI - Your AI Personal Trainer!
        </h1>
        <h2 className="h1 mb-4 leading-tight aos-init aos-animate sm:text-3xl text-4xlfont-bold text-slate-800">
          The Best AI Fitness Programs Generator On The Interent!
        </h2>
        <p className="font-sans text-lg heading-text text-4xl font-bold text-slate-800">
          Simply fill out the form and in a matter of seconds, you'll receive a
          fully tailored fitness program designed just for you
        </p>
        {/* <div className="header-buttons">
  <button className="mt-3 bg-gradient-to-r from-purple-600 via-purple-600 to-indigo-600 text-white border-0 hover:bg-gradient-to-r hover:from-purple-700 hover:via-purple-700 hover:to-indigo-700 py-0 px-2 font-bold rounded-md transition duration-150 ease-in-out">Sign Up</button>
  <button className="mt-3 bg-gradient-to-r from-purple-600 via-purple-600 to-indigo-600 text-white border-0 hover:bg-gradient-to-r hover:from-purple-700 hover:via-purple-700 hover:to-indigo-700 py-0 px-2 font-bold rounded-md transition duration-150 ease-in-out">Login</button>
</div> */}
      </header>
      <div className="container">
        <form onSubmit={handleSubmit}>
          <label>
            Age:
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              min="13"
              max="100"
            />
              {errors.ageError && <p className="error">{errors.ageError}</p>}


          </label>
          <label>
            Weight (kg):
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              min="40"
              max="220"
            />
            {errors.weightError && <p className="error">{errors.weightError}</p>}
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
            <select
              value={fitnessLevel}
              onChange={(e) => setFitnessLevel(e.target.value)}
            >
              <option value="">Select fitness level</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </label>
          <label>
            Training Experience:
            <select
              value={trainingExperience}
              onChange={(e) => setTrainingExperience(e.target.value)}
            >
              <option value="">Select training experience</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </label>
          <label>
            Exercise Frequency:
            <select
              value={exerciseFrequency}
              onChange={(e) => setExerciseFrequency(e.target.value)}
            >
              <option value="">Select exercise frequency</option>
              <option value="1-2">1-2 times per week</option>
              <option value="3-4">3-4 times per week</option>
              <option value="5-6">5-6 times per week</option>
              <option value="7">7 times per week</option>
            </select>
          </label>
          <label>
            Fitness Goal:
            <select
              value={fitnessGoal}
              onChange={(e) => setFitnessGoal(e.target.value)}
            >
              <option value="">Select fitness goal</option>
              <option value="lose weight">Lose weight</option>
              <option value="gain muscle">Gain muscle</option>
              <option value="improve performance">Improve performance</option>
              <option value="other">Stay in shape</option>
            </select>
          </label>
          <label>
            Workout Environment:
            <select
              value={workoutEnvironment}
              onChange={(e) => setWorkoutEnvironment(e.target.value)}
            >
              <option value="">Select workout environment</option>
              <option value="home">Home</option>
              <option value="gym">Gym</option>
            </select>
          </label>
          <button
            id="btn"
            type="submit"
            disabled={!formComplete || loading }
            className="text-rose-600"
          >
            Generate Training Program
          </button>
        </form>
        <div className="training-program">
          Your Training Program:
          {loading && (
            <div class="text-center loading">
    <div role="status">
        <svg aria-hidden="true" class="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
        </svg>
        <p className="loading-text">Just a few moments, we're creating the perfect workout plan for...</p>
    </div>
</div>
            // <p className="loading">
            //   Just a few moments, we're creating the perfect workout plan for
            //   you !
            // </p>
          )}
          {trainingProgram && trainingProgramFormatted(trainingProgram)}

          {/* {trainingProgram && trainingProgramFormatted(trainingProgram)} */}
        </div>
      </div>
      <footer className="flex justify-between items-center py-3 bg-gradient-to-r from-rose-600 via-rose-700 to-purple-800">
        <div>&copy; 2023 MyFit AI. All rights reserved.</div>
        <div className="flex items-center space-x-4">
          <span>Built by Yoni Goldshtein</span>
          <a href="https://twitter.com/yonigold14?s=21&t=r9WjV3geZvcLI2EcCo3dYg">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="https://www.linkedin.com/in/yoni-goldshtein-55a30710a">
            <i className="fab fa-linkedin"></i>
          </a>
        </div>
      </footer>
      {/* fixed bottom-0 w-full */}
    </>
  );
};

export default TrainingProgramForm;
