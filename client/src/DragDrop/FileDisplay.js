import { formatBytes } from "../utils/formatBytes";
import { FaRegFile } from "react-icons/fa";
import { BsX } from "react-icons/bs";

export function FileDisplay({ file, index, onDelete }) {
  return (
    <div
      key={index}
      className="w-full px-3 py-3.5 rounded-md bg-slate-200 space-y-3"
    >
      <div className="flex justify-between">
        <div className="w-[70%] flex justify-start items-center space-x-2">
          <div className="text-primary text-[37px]">
            <FaRegFile />
          </div>
          <div className=" space-y-1">
            <div className="text-xs font-medium text-gray-500">{file.name}</div>
            <div className="text-[10px] font-medium text-gray-400">
              {formatBytes(file.size)}
            </div>
          </div>
        </div>
        <div className="flex-1 flex justify-end">
          <div className="space-y-1">
            <div
              className="text-gray-500 text-[17px] cursor-pointer"
              onClick={() => onDelete(index)}
            >
              <BsX className="ml-auto" />
            </div>
            <div className="text-[10px] font-medium text-gray-400">Done</div>
          </div>
        </div>
      </div>
    </div>
  );
}
