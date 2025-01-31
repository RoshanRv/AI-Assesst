import { Fragment } from "react";
import {
  Listbox,
  Transition,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";
import { HiCheck, HiChevronUpDown } from "react-icons/hi2";

interface Props<T> {
  value: T;
  onChange: (value: T) => void;
  options: T[];
  label?: string;
  getLabel: (option: T) => string;
  getId: (option: T) => string | number;
  placeholder?: string;
}

const Select = <T,>({
  value,
  onChange,
  options,
  label,
  getLabel,
  getId,
  placeholder = "Select an option...",
}: Props<T>) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <Listbox value={value} onChange={onChange}>
        <div className="relative">
          <ListboxButton className="relative w-full cursor-default rounded-md outline-none bg-neutral-200 py-3 font-medium pl-3 pr-10 text-left border  sm:text-sm">
            <span className="block truncate text-lg">
              {value ? getLabel(value) : placeholder}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <HiChevronUpDown
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </ListboxButton>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <ListboxOptions className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-neutral-100  text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm z-10">
              {options.map((option) => (
                <ListboxOption
                  key={getId(option)}
                  className={({ active }: { active: boolean }) =>
                    `relative cursor-default select-none py-2.5 pl-10 pr-4 ${
                      active ? "bg-violet-200 text-black" : "text-gray-900"
                    }`
                  }
                  value={option}
                >
                  {({ selected }: { selected: boolean }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {getLabel(option)}
                      </span>
                      {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-violet-600">
                          <HiCheck className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
};

export default Select;
