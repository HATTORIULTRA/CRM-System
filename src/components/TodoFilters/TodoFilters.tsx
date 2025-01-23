import { FC, ReactNode, useState } from "react";

import { ICategoryCount } from "../../types/types.ts";
import s from "./TodoFilters.module.scss";


type FilterKeys = keyof ICategoryCount;

interface IFiltersArray {
	name: string;
	filter: FilterKeys;
}

interface TodoFiltersProps {
	fetchTodos: (filter?: FilterKeys) => Promise<ICategoryCount>;
	categoryCount: ICategoryCount;
}

const TodoFilters: FC<TodoFiltersProps> = ({
	fetchTodos,
	categoryCount,
}): ReactNode => {
	const [selectedFilter, setSelectedFilter] = useState<number>(0);

	const filtersArray: IFiltersArray[] = [
		{ name: "Все", filter: "all" },
		{ name: "в работе", filter: "inWork" },
		{ name: "сделано", filter: "completed" },
	];

	const handleClickCategory = (i: number) => {
		setSelectedFilter(i);
		fetchTodos(filtersArray[i].filter);
	};

	return (
		<ul className={s.list}>
			{filtersArray.map((item, i) => (
				<li
					onClick={() => handleClickCategory(i)}
					className={`${s.item} ${selectedFilter === i ? s.active : ""}`}
					key={i}
				>
					{item.name}
					<span>({categoryCount[item.filter]})</span>
				</li>
			))}
		</ul>
	);
};

export default TodoFilters;
