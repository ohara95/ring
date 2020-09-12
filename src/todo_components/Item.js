import React, { useContext } from "react";
import { AuthContext } from "../AuthService";

import { Checkbox, List } from "semantic-ui-react";

const Item = ({ value, todos, setTodos, isDone, id, userId }) => {
  const { user } = useContext(AuthContext);

  // 一個のチェックボックスだけにチェック出来る処理
  const onClickSelect = (e) => {
    // isDoneとリンクさせるためにClickBoxのname属性にtodoのidを入れる
    // console.log(e.target.name);

    // クリックしたらisDoneの値を変える処理
    // 選択された値が変わったtodosが変数に入る
    const checkedTodos = todos.map((todo) => {
      // もしname属性に入れたidとtodosに入っているidが同じだったら
      if (e.target.id === todo.id) {
        // スプレッド構文でisDoneプロパティの値を上書き
        // isDoneはデフォルトでfalseに設定してるからnotIsDoneでtrueにする
        // 切り替えるために!todo.isDoneにしている(falseではなくて)
        return { ...todo, isDone: !todo.isDone };
      } else {
        // 同じじゃなかったらそのままのtodoを返す
        return todo;
      }
    });
    // todosの状態を更新
    // (checkedTodosの返り値はtodoだから更新しないと反映されない)
    setTodos(checkedTodos);
  };

  return (
    <>
      {user && (
        <>
          {user.uid === userId && (
            <>
              <div style={{ fontSize: "18px", marginTop: "20px" }}>
                <Checkbox
                  color="blue"
                  // valueにstate入れるのと同じ考え方
                  checked={isDone}
                  id={id}
                  onClick={onClickSelect}
                  style={{ margin: "0 10px" }}
                />
                <span
                  style={{
                    textDecoration: isDone ? "line-through" : "none",
                  }}
                >
                  {value}
                </span>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
};

export default Item;
