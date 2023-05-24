import Header from "../components/Header";
import { useState, useEffect } from "react";
import {Link} from 'react-router-dom'
import { Helmet } from "react-helmet-async";
import { FiClipboard } from "react-icons/fi";
import CopyToClipboard from "react-copy-to-clipboard";
import { signOut } from "firebase/auth";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase/config";
import {
  setDoc,
  doc,
  addDoc,
  collection,
  getFirestore,
  getDoc,
} from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";

import "@fortawesome/fontawesome-free/css/all.css";

function MenuPlanner() {
  const API_KEY = import.meta.env.VITE_API_KEY;

  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [gender, setGender] = useState("");
  const [nutritionRatioPreference, setNutritionRatioPreference] = useState("");
  const [height, setHeight] = useState("");
  const [activityLevel, setActivityLevel] = useState("");
  const [exerciseFrequency, setExerciseFrequency] = useState("");
  const [fitnessGoal, setFitnessGoal] = useState("");
  const [dietaryPreference, setDietaryPreference] = useState("");
  const [menu, setMenu] = useState("");
  const [loading, setLoading] = useState(false);
  const [formComplete, setFormComplete] = useState(false);
  const [errors, setErrors] = useState({ ageError: "", weightError: "", heightError: "" });
  const [resultError, setResultError] = useState("");
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [hasPaid, setHasPaid] = useState(false);
  const functions = getFunctions();
  const generateTrainingProgramNew = httpsCallable(functions, 'generateTrainingProgramNew');
  const getPlan = httpsCallable(functions, 'getPlan');


    useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
        setUser(user);
    });
    return () => unsubscribe();
    }, []);



  const checkFormComplete = () => {
    if (
      age &&
      weight &&
      gender &&
      height &&
      activityLevel &&
      exerciseFrequency &&
      dietaryPreference &&
      fitnessGoal
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
    height,
    activityLevel,
    exerciseFrequency,
    dietaryPreference,
    fitnessGoal,
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const ageError = validateAge(age);
    const weightError = validateWeight(weight);
    const heightError = validateHeight(height);

    if (ageError || weightError || heightError) {
      setErrors({ ageError, weightError, heightError });
      return;
    }

    setLoading(true);

    let menu = "";
try {
  const messages = [
    {
      role: "system",
      content:
        "Act as a personal fitness trainer & nutriton expert and create a menu plan according to the details of the trainee. ",
    },
    {
      role: "user",
      content: `Please create a personalized one day menu plan for a  ${age}-year-old with the following details:
    weight: ${weight} kg
    fitnessGoal: ${fitnessGoal}
    dietaryPreference: ${dietaryPreference}
    Please provide daily caloric intake and protein, carbohydrate, and fat amounts for each day
    
    .`,
    },
  ];

      const result = await generateTrainingProgramNew({ messages });
      menu = result.data.choices[0].message.content;

      setResultError("");
    } catch (error) {
      console.log(error.message);
      setResultError('Error generating menu. Please try again later.');

    }
    setMenu(menu);
    setLoading(false);
    // local storage

    if (user) {
        const db = getFirestore();
        const menusCollection = collection(db, "menus");
        const newMenu = {
          userId: user.uid,
            age,
            weight,
            gender,
            height,
            activityLevel,
            exerciseFrequency,
            fitnessGoal,
            dietaryPreference,
            menu,

        };
  
        try {
          const dofRef = await addDoc(menusCollection, newMenu);
          
        } catch (error) {
          console.error("Error adding document: ", error);
        }
      }
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

  const validateHeight = (height) => {
    if (height < 120 || height > 220) {
      return "You must be between 120 and 220 cm to use this service";
    }
    return "";
  };

  const menuFormatted = (menu) => {
    if (menu) {
      // Add line breaks before each meal type (e.g., Breakfast, Mid-morning snack, Lunch, etc.)
      const formattedMenu = menu.replace(/([A-Za-z\s-]+)(\([\d\s\w]+\):)/g, "\n$1$2");
  
      // Add line breaks after semicolons
      const formattedMenuWithSemicolons = formattedMenu.replace(/;/g, ";\n");
  
      // Split the formatted menu into lines
      const lines = formattedMenuWithSemicolons.split("\n");
  
      // Format each line as a paragraph element
      const formattedLines = lines.map((line, index) => {
        return <p key={index}>{line.trim()}</p>;
      });
  
      return formattedLines;
    }
    return "";
  };

        

  return (
    <>
      <header className="flex flex-wrap items-center justify-between bg-white px-6 py-4 md:px-10 md:py-6">
  <h1 className="text-3xl md:text-5xl text-transparent font-bold bg-gradient-to-r from-rose-600 via-rose-700 to-purple-800 bg-clip-text pb-1">MyFit-AI</h1>
  <div className="flex flex-wrap items-center justify-end">
    <Link to="/">
      <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 md:py-3 md:px-5 rounded-full">Home</button>
    </Link>
  </div>
</header>
<section className="title">
      <h1 className="h1 mb-1 leading-tight aos-init aos-animate sm:text-5xl text-4xlfont-bold text-black pb-2 ">
        Your AI Personal Meal Planner 🥗
      </h1>
      <p className="text-lg heading-text text-4xl font-bold text-black">
        Simply fill out the form and in a matter of seconds, you'll receive a
        healthy, personalized menu plan!
      </p>
</section>
      <div className="wrapper" style={{ minHeight: "80vh" }}>
        <div className="container">
          <form className="main-form menu-form" onSubmit={handleSubmit}>
            <label className="label-text">
              Age:
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                min="13"
                max="100"
                style={{ color: "black" }}
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
                style={{ color: "black" }}
              />
              {errors.weightError && (
                <p className="error">{errors.weightError}</p>
              )}
            </label>
            <label>
              Gender:
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                style={{ color: "black" }}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </label>
            <label>
              Height (cm):
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                min='120'
                max='220'
                style={{ color: "black" }}
              />
              {errors.heightError && (
                <p className="error">{errors.heightError}</p>
              )}
                
            </label>
            <label>
              Activity Level:
              <select
                value={activityLevel}
                onChange={(e) => setActivityLevel(e.target.value)}
                style={{ color: "black" }}
              >
                <option value="">Select activity level</option>
                <option value="Lightly active">Lightly active</option>
                <option value="Moderately active">Moderately active</option>
                <option value="Very active">Very active</option>
              </select>
            </label>
            <label>
              Exercise Frequency:
              <select
                value={exerciseFrequency}
                onChange={(e) => setExerciseFrequency(e.target.value)}
                style={{ color: "black" }}
              >
                <option value="">Select exercise frequency</option>
                <option value="2">2 times per week</option>
                <option value="3">3 times per week</option>
                <option value="4">4 times per week</option>
                <option value="5">5 times per week</option>
                <option value="6">6 times per week</option>
                <option value="7">7 times per week</option>
              </select>
            </label>
            <label>
              Fitness Goal:
              <select
                value={fitnessGoal}
                onChange={(e) => setFitnessGoal(e.target.value)}
                style={{ color: "black" }}
              >
                <option value="">Select fitness goal</option>
                <option value="lose weight">Lose weight</option>
                <option value="gain muscle">Gain muscle</option>
                <option value="improve performance">Bulk</option>
                <option value="cut">Cut</option>
                <option value="other">Maintain</option>
              </select>
            </label>
            <label>
              Dietary Preference:
              <select
                value={dietaryPreference}
                onChange={(e) => setDietaryPreference(e.target.value)}
                style={{ color: "black" }}
              >
                <option value="">Select Dietery Perfernce:</option>
                <option value="No Perfernce">No Perfernce</option>
                <option value="Vegetarian">Vegetarian</option>
                <option value="Vegan">Vegan</option>
                <option value="Gluten-free">Gluten-free</option>
              </select>
            </label>
            <button
              id="btn"
              type="submit"
              disabled={!formComplete || loading}
              className="text-blue-600"
            >
              Generate Menu Plan
            </button>
          </form>

          <div className="training-program menu-program">
            Your Menu:
            {loading && (
              <div class="text-center loading">
                <div role="status">
                  <svg
                    aria-hidden="true"
                    class="inline w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                      fill="currentColor"
                    />
                    <path
                      d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                      fill="currentFill"
                    />
                  </svg>
                  <p className="loading-text">
                    Just a few moments, we're creating the perfect menu for
                    you...
                  </p>
                </div>
              </div>
           )}
           {resultError && (
            <div class="text-center error-message">
              <p>{resultError}</p>
            </div>
            )}

            {menu && (
              <div className="formatted-menu">{menuFormatted(menu)}</div>
            )}


            

            


          </div>
        </div>
      </div>
    </>
  );
}

export default MenuPlanner;

