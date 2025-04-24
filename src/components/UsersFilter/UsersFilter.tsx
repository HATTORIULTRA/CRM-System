import { FC, ReactNode, SetStateAction, Dispatch } from "react";
import { Button, Popover } from "antd";

import { getAllUsers } from "../../store/slices/adminSlice.ts";
import { FilterOutlined } from "@ant-design/icons";
import { useAppDispatch } from "../../hooks/redux.ts";
import { FilterButtons } from "../../pages/UsersPage/UsersPage.tsx";

interface UsersFilterProps {
  filterButtons: FilterButtons[];
  activeFilter: number;
  setActiveFilter: Dispatch<SetStateAction<number>>;
}

const UsersFilter: FC<UsersFilterProps> = ({
  filterButtons,
  activeFilter,
  setActiveFilter,
}): ReactNode => {
  const dispatch = useAppDispatch();
  return (
    <Popover
      content={
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {filterButtons.map((item, i) => (
            <Button
              style={
                activeFilter === i
                  ? {
                      color: "white",
                      backgroundColor: "#4096ff",
                    }
                  : {}
              }
              onClick={() => {
                const active = filterButtons[i].isBlocked;
                dispatch(getAllUsers({ isBlocked: active }));
                setActiveFilter(i);
              }}
              key={i}
            >
              {item.title}
            </Button>
          ))}
        </div>
      }
      title="Дополнительные действия"
      trigger="click"
      placement="leftBottom"
    >
      <Button style={{ height: "45px", fontSize: "18px" }}>
        <FilterOutlined /> Filters
      </Button>
    </Popover>
  );
};

export default UsersFilter;
