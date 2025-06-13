import { FC, memo, ReactNode } from "react";
import { Flex, Radio } from "antd";

import { TodoInfo } from "../../types/apiTypes.ts";
import s from "./TodoFilters.module.scss";

type FilterKeys = keyof TodoInfo;

interface IFiltersArray {
  name: string;
  filter: FilterKeys;
}

interface TodoFiltersProps {
  fetchTodos: (filter?: FilterKeys) => Promise<void>;
  categoryCount: TodoInfo;
}

const TodoFilters: FC<TodoFiltersProps> = ({
  fetchTodos,
  categoryCount,
}): ReactNode => {
  const filtersArray: IFiltersArray[] = [
    { name: "Все", filter: "all" },
    { name: "в работе", filter: "inWork" },
    { name: "сделано", filter: "completed" },
  ];

  const selectedFilter = localStorage.getItem("filter")!;

  const handleClickCategory = (i: number) => {
    fetchTodos(filtersArray[i].filter);
    localStorage.setItem("filter", filtersArray[i].filter);
  };

  return (
    <Flex className={s.wrapper} vertical gap="middle">
      <Radio.Group defaultValue={selectedFilter || "all"} size="large">
        {filtersArray.map((item, i) => (
          <Radio.Button
            className={s.button}
            onClick={() => handleClickCategory(i)}
            value={item.filter}
            key={i}
          >
            {item.name}({categoryCount[item.filter]})
          </Radio.Button>
        ))}
      </Radio.Group>
    </Flex>
  );
};

export default memo(TodoFilters);
