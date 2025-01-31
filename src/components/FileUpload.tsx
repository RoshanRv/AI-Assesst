import { FcFile } from "react-icons/fc";

interface Props {
  file: File | null;
  setFile: (file: File | null) => void;
  uploadDocument: () => void;
  uploading: boolean;
  uploaded: boolean;
}

const FileUpload = ({
  file,
  setFile,
  uploadDocument,
  uploading,
  uploaded,
}: Props) => {
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
    }
  };

  return (
    <div
      className={` border-dashed border-sky-300 rounded-xl bg-white  text-center flex ${
        !uploaded
          ? "flex-col p-8 border-4"
          : "flex-row bg-sky-100 items-center p-4 border-2"
      }  items-center justify-center gap-4`}
    >
      <FcFile size={!uploaded ? 120 : 50} />

      {!uploaded && (
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="hidden"
          id="fileInput"
        />
      )}
      <label htmlFor="fileInput" className="cursor-pointer block">
        <div className="text-black  font-medium text-lg">
          {file ? (
            <a href={URL.createObjectURL(file)} target="_blank">
              {file.name}
            </a>
          ) : (
            <p>Drop your PDF here or click to browse</p>
          )}
        </div>
        {!file && (
          <div className="text-base text-gray-500">Supports PDF files</div>
        )}
      </label>
      {!uploaded && (
        <button
          onClick={uploadDocument}
          disabled={!file || uploading}
          className={`px-10 py-3 rounded-md font-medium text-black ${
            !file || uploading
              ? "bg-violet-300 opacity-50 cursor-not-allowed"
              : "bg-violet-300 hover:bg-violet-200 hover:text-black/70 transition-all duration-300"
          }`}
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      )}
    </div>
  );
};

export default FileUpload;
