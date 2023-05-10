import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../firebase/config';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../firebase/config';
import { Link } from 'react-router-dom'

function MyPrograms() {
  const [programs, setPrograms] = useState([]);
  const [menus, setMenus] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for changes in authentication state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        setUser(user);
      } else {
        // User is signed out
        setUser(null);
      }
    });

    // Clean up the listener
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Query the programs collection for the current user's programs
    const fetchPrograms = async () => {

      const programsRef = collection(db, "programs");
      const q = query(programsRef, where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);

      // Get the program data from the query snapshot
      const programs = [];
      querySnapshot.forEach((doc) => {
        programs.push({ id: doc.id, ...doc.data() });
      });

      setPrograms(programs);
      setLoading(false);
    };

    // Fetch the user's programs on component mount
    if (user) {
        fetchPrograms();
    }
    

  }, [user]);

  const fetchMenuPlans = async () => {
    const menuPlansRef = collection(db, "menus");
    const q = query(menuPlansRef, where("userId", "==", user.uid));
    const querySnapshot = await getDocs(q);
  
    const fetchedMenuPlans = [];
    querySnapshot.forEach((doc) => {
      fetchedMenuPlans.push({ id: doc.id, ...doc.data() });
    });
  
    setMenus(fetchedMenuPlans);
  };

  useEffect(() => {
    if (user) {
      fetchMenuPlans();
    }
  }, [user]);

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
            <a
              className="exercise-link"
              href={`${googleImagesSearchUrl}${encodeURIComponent(
                exerciseName
              )}&tbm=isch`}
              target="_blank"
              rel="noreferrer"
            >
              {exerciseName}
            </a>
            // <Link to={`${googleImagesSearchUrl}${encodeURIComponent(exerciseName)}`} target="_blank">
            //   {exerciseName}
            // </Link>
          );
          return (
            <li key={index}>
              {line.slice(0, match.index)}
              {exerciseLink}
              {line.slice(match.index + match[0].length)}
            </li>
          );
        } else {
          return <p key={index}>{line}</p>;
        }
      }
    });
    return formattedLines;
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

<div>
  {loading ? (
    <p>Loading...</p>
  ) : programs.length > 0  || menus.length > 0 ? (
    <div className="myprograms-container grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      {programs.map((program) => (
        <div key={program.id} className="training-program  p-4 rounded-lg ">
          <p className="font-bold mb-2">Training Program:</p>
          <div className="text-sm">{trainingProgramFormatted(program.trainingProgram)}</div>
        </div>
      ))}
      {menus.map((menu) => (
        <div key={menu.id} className="training-program menu-program p-4 rounded-lg">
          <p className="font-bold mb-2">Menu Plan:</p>
          <div className="text-sm">{menuFormatted(menu.menu)}</div>
          </div>
      ))}
      
    </div>
  ) : (
    <p>No programs found.</p>
  )}
</div>

    </>
  );
}

export default MyPrograms;
