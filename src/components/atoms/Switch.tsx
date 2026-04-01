"use client";

interface SwitchProps {
  enabled: boolean;
  onChange: () => void;
}

export const Switch = ({ enabled, onChange }: SwitchProps) => {
  return (
    <button
      onClick={onChange}
      className={`${
        enabled ? "bg-green-500" : "bg-gray-300"
      } relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none shadow-inner`}
    >
      <span
        className={`${
          enabled ? "translate-x-6" : "translate-x-1"
        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ease-in-out shadow-md`}
      />
    </button>
  );
};