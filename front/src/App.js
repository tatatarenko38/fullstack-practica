import { React, useReducer } from "react";

import Page from "./component/page";
import Grid from "./component/grid";
import Box from "./component/box";

// //хук редукції стану

const LIST_ACTION_TYPE = {
  ADD: "add",
  DELETE: "delete",
  SELECT: "select",
  REVERSE: "reverse",
};

//відповідає, щоб повернути новий об'єкт стану
function listReducer(state, action) {
  if (!action.payload) throw new Error("need action.payload");
  switch (action.type) {
    case LIST_ACTION_TYPE.ADD:
      const id = new Date().getTime();

      //payload - фраза, що означає данні,
      //які приходять в нашій дії(в dispatch)
      const newItem = { value: action.payload, id };
      //повертаємо новий об'єкт з деструктуризацією state
      //вказуємо властивість items, кладемо туди все,
      //що було в state.items i action(сюди приходить нове значення,
      //що вводиться в поле)
      return {
        //щоб всі значенняБ що були - збереглися
        ...state,
        //оновлюються тілки ці
        items: [...state.items, newItem],
      };

    case LIST_ACTION_TYPE.DELETE:
      const newItems = state.items.filter((item) => item.id !== action.payload);

      return {
        ...state,
        items: newItems,
      };

    case LIST_ACTION_TYPE.SELECT:
      return {
        //повертаємо минулий state
        ...state,
        //та властивість selectedId, якщо === то до цього був обраний
        //цей елемент і ми ще раз на нього натискаємо, то null -
        //тобто прибиралося, що елемент обраний(відбувається перемикання
        //активного елемента)
        selectedId: action.payload === state.selectedId ? null : action.payload,
      };

    case LIST_ACTION_TYPE.REVERSE:
      return {
        ...state,
        items: state.items.reverse(),
      };

    default:
      //повертаємо ті самі значення
      return { ...state };
  }
}

const initState = { items: [] };

function App() {
  //   const [state, dispatch] = useReducer(listReducer, initState);

  //використання init в хуке редукції стану
  //додаємо початкові данні без переписання initState
  //це локально прив'язано до конкретного компонента
  const init = (state) => {
    if (state.items && state.items.length === 0) {
      return {
        ...state,
        items: [{ id: 432312, value: "first item" }],
      };
    } else {
      return state;
    }
  };

  const [state, dispatch] = useReducer(listReducer, initState, init);

  const handleAddItem = (e) => {
    // для зручності, щоб не писати e.target
    const { value } = e.target;

    //trimm() прибирає зайві пробіли(щоб не було значення одні пробіли)
    if (value.trim() === "") return null;
    // console.log(e.target.value);
    dispatch({ type: LIST_ACTION_TYPE.ADD, payload: value });

    //зкидаємо значення в полі
    e.target.value = "";
  };

  // для кнопки "видалити"
  const handleRemoveItem = (id) =>
    dispatch({ type: LIST_ACTION_TYPE.DELETE, payload: id });

  //для вибору активного елемента (payload: id - id елемента,
  //який треба обрати
  const handleSelectItem = (id) =>
    dispatch({ type: LIST_ACTION_TYPE.SELECT, payload: id });

  // змінити порядок
  const handleReverseItems = () => dispatch({ type: LIST_ACTION_TYPE.REVERSE });
  return (
    <Page>
      <Grid>
        <Box>
          <Grid>
            <h1>Список елементів</h1>

            <ul>
              <Grid>
                {state.items.map(({ value, id }) => (
                  <li onClick={() => handleSelectItem(id)} key={id}>
                    <Box
                      style={{
                        borderColor:
                          state.selectedId === id ? "blue" : "#e6e6e6",
                      }}
                    >
                      <Grid>
                        <span>{value}</span>
                        <Box>
                          <button
                            onClick={(e) => {
                              // щоб не спливала подія, бо в нас є ще
                              //один onClick y selecty
                              e.stopPropagation();
                              handleRemoveItem(id);
                            }}
                          >
                            Видалити
                          </button>
                        </Box>
                      </Grid>
                    </Box>
                  </li>
                ))}
              </Grid>
            </ul>
          </Grid>
        </Box>

        <Box>
          <input
            // подія, коли ми виходимо з input в браузері(змінюємо фокус)
            onBlur={handleAddItem}
            type="text"
            placeholder="Введіть новий елемент"
          />
        </Box>

        <Box>
          <button onClick={handleReverseItems}>Змінити порядок</button>
        </Box>
      </Grid>
    </Page>
  );
}

export default App;
