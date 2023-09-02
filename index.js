const API = "http://themealdb.com/api/json/v1/1/";
const app = document.querySelector(".app");
console.log(app);
const screen = {
  main: app.querySelector(".main-screen"),
  recipe: app.querySelector(".recipe-screen"),
};
console.log(screen);

const showFullRecipe = async (id) => {
  screen.main.classList.add("hidden");
  screen.recipe.classList.remove("hidden");

  screen.recipe.querySelector(".back-btn").addEventListener("click", () => {
    screen.recipe.classList.add("hidden");
    screen.main.classList.remove("hidden");
    screen.recipe.querySelector(".thumbnail img").innerHTML = "";
    screen.recipe.querySelector(".details h2").innerHTML = "";
    screen.recipe.querySelector(".details ul").innerHTML = "";
    screen.recipe.querySelector(".details ol").innerHTML = "";
  });

  try {
    const res = await fetch(API + "lookup.php?i=" + id);
    const data = await res.json();
    const recipe = data.meals[0];
    console.log(recipe);
    screen.recipe.querySelector(".thumbnail img").src = recipe.strMealThumb;
    screen.recipe.querySelector(".details h2").innerText = recipe.strMeal;

    for (let i = 1; i < 20; i++) {
      if (recipe["strIngredient" + i].length == 0) {
        break;
      }
      const li = document.createElement("li");
      li.innerText = `${recipe["strIngredient" + i]} = ${
        recipe["strMeasure" + i]
      }

        `;
      screen.recipe.querySelector(".details ul").appendChild(li);
    }

    let instructions = recipe.strInstructions
      .split("\r\n")
      .filter((str) => str);
    for (let i = 0; i < instructions.length; i++) {
      let li = document.createElement("li");
      li.innerText = instructions[i];
      screen.recipe.querySelector(".details ol").appendChild(li);
    }
  } catch (error) {
    console.error("ShowFullRecipe: ", error);
  }
};

const getRecipeOfCategory = async (category) => {
  screen.main.querySelector(".recipe-list").innerHTML = "";
  try {
    const res = await fetch(API + "filter.php?c=" + category);
    const data = await res.json();
    const recipe = data.meals;
    for (let i = 0; i < recipe.length; i++) {
      const div = document.createElement("div");
      div.classList.add("item");
      div.addEventListener("click", () => {
        showFullRecipe(recipe[i].idMeal);
      });
      div.innerHTML = `
      <div class="thumbnail">
      <img src="${recipe[i].strMealThumb}"
      </div>
      <div class="details">
        <h2>${recipe[i].strMeal}</h2>
      </div>
      `;
      screen.main.querySelector(".recipe-list").appendChild(div);
    }
    console.log(data);
  } catch (error) {
    console.error("getRecipe: " + error);
  }
};

const main = async () => {
  try {
    const res = await fetch(API + "list.php?c=list");
    const data = await res.json();
    const categories = data.meals;
    console.log(categories);

    for (let i = 0; i < categories.length; i++) {
      let div = document.createElement("div");
      div.innerText = categories[i].strCategory;
      div.addEventListener("click", () => {
        screen.main
          .querySelector(".categories .active")
          .classList.remove("active");
        div.classList.add("active");
        getRecipeOfCategory(categories[i].strCategory);
      });
      if (i == 0) {
        div.classList.add("active");
        getRecipeOfCategory(categories[i].strCategory);
      }
      screen.main.querySelector(".categories").appendChild(div);
    }
  } catch (error) {
    console.error("Main: ", error);
  }
};

main();
