import { FC, ReactNode } from "react";

const TodoLoading: FC = (): ReactNode => {
  return (
    <div style={{ margin: "100px 0 0 200px" }}>
      <svg
        width="100"
        height="100"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="#e0e0e0"
          strokeWidth="10"
          fill="none"
        />
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="#3498db"
          strokeWidth="10"
          fill="none"
          strokeDasharray="283"
          strokeDashoffset="283"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 50 50"
            to="360 50 50"
            dur="1.5s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="stroke-dashoffset"
            from="283"
            to="0"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    </div>
  );
};

export default TodoLoading;
