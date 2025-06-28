import { useState, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import Button from "../Button/Button";
import Loading from "../Loading/Loading";
import styles from "./ImageUploader.module.scss";

const ImageUploader = ({
    value = [],
    onChange,
    maxFiles = 5,
    maxFileSize = 5 * 1024 * 1024, // 5MB
    acceptedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"],
    showPreview = true,
    // allowCrop = false, // TODO: Implement cropping feature in future version
    className,
    ...props
}) => {
    const [files, setFiles] = useState(value);
    const [dragActive, setDragActive] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [errors, setErrors] = useState([]);
    const fileInputRef = useRef(null);

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const validateFile = (file) => {
        const errors = [];

        // Check file type
        if (!acceptedTypes.includes(file.type)) {
            errors.push(
                `${
                    file.name
                }: Invalid file type. Accepted types: ${acceptedTypes.join(
                    ", "
                )}`
            );
        }

        // Check file size
        if (file.size > maxFileSize) {
            errors.push(
                `${file.name}: File too large. Maximum size: ${(
                    maxFileSize /
                    1024 /
                    1024
                ).toFixed(1)}MB`
            );
        }

        return errors;
    };

    const processFiles = useCallback(
        (fileList) => {
            const newFiles = Array.from(fileList);
            const validationErrors = [];

            // Check total number of files
            if (files.length + newFiles.length > maxFiles) {
                validationErrors.push(`Maximum ${maxFiles} files allowed`);
                return;
            }

            const processedFiles = [];

            newFiles.forEach((file) => {
                const fileErrors = validateFile(file);
                if (fileErrors.length > 0) {
                    validationErrors.push(...fileErrors);
                } else {
                    // Create file object with preview
                    const fileObj = {
                        id: Math.random().toString(36).substr(2, 9),
                        file,
                        name: file.name,
                        size: file.size,
                        type: file.type,
                        preview: URL.createObjectURL(file),
                        uploaded: false,
                        uploading: false,
                        error: null,
                    };
                    processedFiles.push(fileObj);
                }
            });

            if (validationErrors.length > 0) {
                setErrors(validationErrors);
                return;
            }

            setErrors([]);
            const updatedFiles = [...files, ...processedFiles];
            setFiles(updatedFiles);

            if (onChange) {
                onChange(updatedFiles);
            }
        },
        [files, maxFiles, maxFileSize, acceptedTypes, onChange]
    );

    const handleDrop = useCallback(
        (e) => {
            e.preventDefault();
            e.stopPropagation();
            setDragActive(false);

            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                processFiles(e.dataTransfer.files);
            }
        },
        [processFiles]
    );

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files[0]) {
            processFiles(e.target.files);
        }
    };

    const removeFile = (fileId) => {
        const updatedFiles = files.filter((f) => f.id !== fileId);
        setFiles(updatedFiles);

        if (onChange) {
            onChange(updatedFiles);
        }

        // Revoke object URL to prevent memory leaks
        const fileToRemove = files.find((f) => f.id === fileId);
        if (fileToRemove && fileToRemove.preview) {
            URL.revokeObjectURL(fileToRemove.preview);
        }
    };

    const simulateUpload = async (fileObj) => {
        // Update file state to uploading
        setFiles((prev) =>
            prev.map((f) =>
                f.id === fileObj.id ? { ...f, uploading: true, error: null } : f
            )
        );

        try {
            // Simulate upload delay
            await new Promise((resolve) =>
                setTimeout(resolve, 2000 + Math.random() * 3000)
            );

            // Simulate random upload success/failure
            const success = Math.random() > 0.1; // 90% success rate

            if (success) {
                // Update file state to uploaded
                setFiles((prev) =>
                    prev.map((f) =>
                        f.id === fileObj.id
                            ? {
                                  ...f,
                                  uploading: false,
                                  uploaded: true,
                                  url: `https://example.com/uploads/${fileObj.id}.jpg`, // Mock URL
                              }
                            : f
                    )
                );
            } else {
                // Update file state with error
                setFiles((prev) =>
                    prev.map((f) =>
                        f.id === fileObj.id
                            ? {
                                  ...f,
                                  uploading: false,
                                  error: "Upload failed. Please try again.",
                              }
                            : f
                    )
                );
            }
        } catch (error) {
            setFiles((prev) =>
                prev.map((f) =>
                    f.id === fileObj.id
                        ? {
                              ...f,
                              uploading: false,
                              error: "Upload failed. Please try again.",
                          }
                        : f
                )
            );
        }
    };

    const uploadAll = async () => {
        setUploading(true);

        const filesToUpload = files.filter(
            (f) => !f.uploaded && !f.uploading && !f.error
        );

        // Upload files in parallel
        await Promise.all(filesToUpload.map((file) => simulateUpload(file)));

        setUploading(false);
    };

    const retryUpload = (fileObj) => {
        simulateUpload(fileObj);
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    const hasUnuploadedFiles = files.some((f) => !f.uploaded && !f.uploading);

    return (
        <div
            className={`${styles.imageUploader} ${className || ""}`}
            {...props}
        >
            {/* Upload Area */}
            <div
                className={`${styles.uploadArea} ${
                    dragActive ? styles.dragActive : ""
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept={acceptedTypes.join(",")}
                    onChange={handleFileSelect}
                    className={styles.hiddenInput}
                />

                <div className={styles.uploadContent}>
                    <div className={styles.uploadIcon}>📁</div>
                    <h3 className={styles.uploadTitle}>
                        Drag & drop images here
                    </h3>
                    <p className={styles.uploadDescription}>
                        or click to browse files
                    </p>
                    <div className={styles.uploadLimits}>
                        <span>Max {maxFiles} files</span>
                        <span>•</span>
                        <span>
                            Up to {(maxFileSize / 1024 / 1024).toFixed(1)}MB
                            each
                        </span>
                    </div>
                </div>
            </div>

            {/* Errors */}
            {errors.length > 0 && (
                <div className={styles.errors}>
                    {errors.map((error, index) => (
                        <div key={index} className={styles.error}>
                            ⚠️ {error}
                        </div>
                    ))}
                </div>
            )}

            {/* File Preview */}
            {showPreview && files.length > 0 && (
                <div className={styles.preview}>
                    <div className={styles.previewHeader}>
                        <h4 className={styles.previewTitle}>
                            Selected Images ({files.length}/{maxFiles})
                        </h4>

                        {hasUnuploadedFiles && (
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={uploadAll}
                                loading={uploading}
                                disabled={uploading}
                            >
                                Upload All
                            </Button>
                        )}
                    </div>

                    <div className={styles.fileList}>
                        {files.map((fileObj) => (
                            <div key={fileObj.id} className={styles.fileItem}>
                                <div className={styles.filePreview}>
                                    <img
                                        src={fileObj.preview}
                                        alt={fileObj.name}
                                        className={styles.previewImage}
                                    />

                                    {fileObj.uploading && (
                                        <div
                                            className={styles.uploadingOverlay}
                                        >
                                            <Loading size="sm" />
                                        </div>
                                    )}

                                    {fileObj.uploaded && (
                                        <div className={styles.successOverlay}>
                                            ✅
                                        </div>
                                    )}

                                    {fileObj.error && (
                                        <div className={styles.errorOverlay}>
                                            ❌
                                        </div>
                                    )}
                                </div>

                                <div className={styles.fileInfo}>
                                    <div className={styles.fileName}>
                                        {fileObj.name}
                                    </div>
                                    <div className={styles.fileSize}>
                                        {formatFileSize(fileObj.size)}
                                    </div>

                                    {fileObj.error && (
                                        <div className={styles.fileError}>
                                            {fileObj.error}
                                        </div>
                                    )}
                                </div>

                                <div className={styles.fileActions}>
                                    {fileObj.error && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => retryUpload(fileObj)}
                                        >
                                            Retry
                                        </Button>
                                    )}

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeFile(fileObj.id)}
                                        className={styles.removeButton}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

ImageUploader.propTypes = {
    value: PropTypes.array,
    onChange: PropTypes.func,
    maxFiles: PropTypes.number,
    maxFileSize: PropTypes.number,
    acceptedTypes: PropTypes.arrayOf(PropTypes.string),
    showPreview: PropTypes.bool,
    // allowCrop: PropTypes.bool, // TODO: Implement cropping feature
    className: PropTypes.string,
};

export default ImageUploader;
