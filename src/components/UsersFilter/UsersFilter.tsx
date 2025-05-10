import { FC, ReactNode, SetStateAction, Dispatch } from "react";
import { Button, Popover } from "antd";

import { FilterOutlined } from "@ant-design/icons";
import { FilterButtons } from "../../pages/UsersPage/UsersPage.tsx";

interface UsersFilterProps {
  filterButtons: FilterButtons[];
  activeFilter: number;
  setActiveFilter: Dispatch<SetStateAction<number>>;
  handleBlockedFilter: (filterIndex: number) => void;
}

const UsersFilter: FC<UsersFilterProps> = ({
  filterButtons,
  activeFilter,
  setActiveFilter,
  handleBlockedFilter,
}): ReactNode => {
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
                handleBlockedFilter(i);
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
