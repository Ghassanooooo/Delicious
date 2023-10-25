import "./App.css";

import { useEffect, useRef, useState } from "react";

export default function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [list, setList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [meals, setMeals] = useState([]);
  const inputRef = useRef();

  useEffect(() => {
    const darkMode = localStorage.getItem("darkMode");
    if (darkMode) {
      setDarkMode(JSON.parse(darkMode));
    }
    async function getIngredient() {
      const response = await fetch(
        "https://www.themealdb.com/api/json/v1/1/list.php?i=list"
      );
      const data = await response.json();

      const ingredients = data.meals.map((ingredient) => {
        return ingredient.strIngredient.trim().toLowerCase();
      });
      setList(ingredients);
    }
    try {
      getIngredient();
    } catch (err) {
      alert(err);
    }
  }, []);

  useEffect(() => {
    async function getIngredient() {
      const response = await fetch(
        "https://www.themealdb.com/api/json/v1/1/filter.php?i=" + searchQuery
      );
      const data = await response.json();

      setMeals(data.meals || []);
    }

    try {
      getIngredient();
    } catch (err) {
      alert(err);
    }
  }, [searchQuery]);

  console.log(meals);

  const handerSearch = (e) => {
    const value = e.target.value.trim().toLowerCase();
    if (!value || value.length < 3) {
      setIngredients([]);
      return;
    }
    const find = list.filter((str) => str.includes(value));
    setIngredients(find);
  };

  const handlerSelectIngredient = (e) => {
    const value = e.target.textContent;
    setIngredients([]);
    setSearchQuery(value);
    inputRef.current.value = value;
  };

  const handlerDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem("darkMode", !darkMode);
  };
  return (
    <div className={`h-screen ${darkMode ? "dark" : ""}`}>
      <div
        className={`h-full overflow-auto bg-white dark:bg-black text-black dark:text-white`}
      >
        <button
          className="absolute bg-slate-100 text-black p-2 top-5 right-5 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium "
          onClick={handlerDarkMode}
        >
          {darkMode ? "Light" : "Dark"}
        </button>
        <h1 className="text-3xl text-center p-8">Delicious</h1>
        <div className="w-1/2 m-auto mt-8 sticky top-2">
          <input
            placeholder="Search by ingredient"
            ref={inputRef}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            onChange={handerSearch}
          />
          {ingredients.length >= 3 && (
            <div className="border p-4 absolute top-10 w-full bg-slate-50 dark:bg-slate-800">
              {ingredients.map((ingredient) => (
                <p
                  onClick={handlerSelectIngredient}
                  className="hover:underline cursor-pointer"
                  key={ingredient}
                >
                  {ingredient}
                </p>
              ))}
            </div>
          )}
        </div>
        {meals.length > 0 ? (
          <div className="w-[80%] m-auto mt-8 grid grid-cols-5 gap-4">
            {meals.map((meal) => (
              <div
                className=" rounded overflow-hidden shadow-lg "
                key={meal.idMeal}
              >
                <img
                  className="w-full"
                  src={meal.strMealThumb}
                  alt="Mountain"
                />
                <div className="px-6 py-4">
                  <div className="font-bold text-xl mb-2">{meal.strMeal}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-10">No Meals Found</div>
        )}
      </div>
    </div>
  );
}
