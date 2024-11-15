import React, { useState } from "react";
import "./index.css";

// Define the props interface
interface MultiSelectDropdownProps {
  title: string; // Dynamic title
  options: { value: string; label: string }[]; // Dynamic dropdown options
  allowFileUpload?: boolean; // Optional: to enable/disable file upload
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({
  title,
  options,
  allowFileUpload = true, // Default to true
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  const handleOptionChange = (optionValue: string) => {
    const updatedOptions = selectedOptions.includes(optionValue)
      ? selectedOptions.filter((opt) => opt !== optionValue)
      : [...selectedOptions, optionValue];

    setSelectedOptions(updatedOptions);
  };

  const removeOption = (optionValue: string) => {
    const updatedOptions = selectedOptions.filter((opt) => opt !== optionValue);
    setSelectedOptions(updatedOptions);
  };

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      setUploadedFile(file.name); // Save the file name to display
    }
  };

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm)
  );

  return (
    <div className="dropdown-wrapper">
      <div className="dropdown-title">
        <label>{title}</label>
        {allowFileUpload && (
          <div className="file-upload-wrapper">
            <input
              type="file"
              id="file-upload"
              className="file-input"
              onChange={handleFileUpload}
            />
            <label htmlFor="file-upload" className="file-upload-button">
              {uploadedFile ? uploadedFile : "Upload File"}
            </label>
          </div>
        )}
      </div>

      <div className="dropdown-container" onClick={toggleDropdown}>
        <div className="selected-options">
          {selectedOptions.length > 0
            ? selectedOptions.map((option) => (
                <span key={option} className="selected-tag">
                  {options.find((opt) => opt.value === option)?.label}
                  <button
                    className="remove-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeOption(option);
                    }}
                  >
                    &#10005;
                  </button>
                </span>
              ))
            : "Select options"}
        </div>
        <span className={`dropdown-arrow ${isOpen ? "open" : ""}`}></span>
      </div>

      {isOpen && (
        <div className="dropdown-list" onClick={(e) => e.stopPropagation()}>
          <input
            type="text"
            placeholder="Search options..."
            value={searchTerm}
            onChange={handleSearch}
            className="dropdown-search"
          />
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <div key={option.value} className="dropdown-option">
                <input
                  type="checkbox"
                  value={option.value}
                  checked={selectedOptions.includes(option.value)}
                  onChange={() => handleOptionChange(option.value)}
                />
                <label>{option.label}</label>
              </div>
            ))
          ) : (
            <p className="no-options">No options found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;
