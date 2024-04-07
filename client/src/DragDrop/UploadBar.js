export function UploadBar({ uploadProgress }) {
  return (
    <div className="mt-4">
      <div className="bg-gray-200 h-2 rounded-full overflow-hidden">
        <div
          className="bg-primary h-full transition-all duration-500"
          style={{ width: `${uploadProgress}%` }}
        />
      </div>
      <p className="mt-1 text-sm text-gray-500">
        Uploading file... {uploadProgress}%
      </p>
    </div>
  );
}
