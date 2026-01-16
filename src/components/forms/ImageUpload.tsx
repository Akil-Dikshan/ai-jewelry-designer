'use client';

import { useState, useRef, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { cn, formatFileSize, isValidImageType, isValidFileSize, MAX_FILE_SIZE } from '@/lib/utils';

interface ImageUploadProps {
    value: File | null;
    onChange: (file: File | null) => void;
    previewUrl?: string;
    error?: string;
    disabled?: boolean;
}

export function ImageUpload({
    value,
    onChange,
    previewUrl,
    error,
    disabled = false,
}: ImageUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [localPreview, setLocalPreview] = useState<string | null>(previewUrl || null);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFile = useCallback((file: File) => {
        setUploadError(null);

        // Validate file type
        if (!isValidImageType(file)) {
            setUploadError('Please upload a valid image (JPG, PNG, or WebP)');
            return;
        }

        // Validate file size
        if (!isValidFileSize(file)) {
            setUploadError(`File is too large. Maximum size is ${formatFileSize(MAX_FILE_SIZE)}`);
            return;
        }

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            setLocalPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);

        onChange(file);
    }, [onChange]);

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);

        if (disabled) return;

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    }, [disabled, handleFile]);

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (!disabled) {
            setIsDragging(true);
        }
    }, [disabled]);

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            handleFile(files[0]);
        }
    }, [handleFile]);

    const handleRemove = useCallback(() => {
        setLocalPreview(null);
        setUploadError(null);
        onChange(null);
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    }, [onChange]);

    const handleClick = () => {
        if (!disabled) {
            inputRef.current?.click();
        }
    };

    const displayError = error || uploadError;

    return (
        <div className="w-full">
            {/* Label */}
            <label className="block text-sm font-medium text-navy mb-2">
                Upload a photo of your gem
                <span className="text-slate font-normal ml-1">(optional but recommended)</span>
            </label>

            {/* Hidden File Input */}
            <input
                ref={inputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                onChange={handleInputChange}
                disabled={disabled}
                className="sr-only"
                aria-label="Upload gem image"
            />

            {/* Upload Area or Preview */}
            {!localPreview ? (
                // Drag & Drop Zone
                <div
                    onClick={handleClick}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={cn(
                        'relative flex flex-col items-center justify-center',
                        'p-8 rounded-lg border-2 border-dashed',
                        'transition-all duration-200 cursor-pointer',
                        disabled && 'opacity-60 cursor-not-allowed',
                        displayError && 'border-error',
                        isDragging
                            ? 'border-gold bg-cream'
                            : 'border-light-gray bg-white hover:border-gold hover:bg-cream/50'
                    )}
                >
                    <Upload
                        className={cn(
                            'w-12 h-12 mb-3',
                            isDragging ? 'text-gold' : 'text-slate'
                        )}
                    />
                    <p className="text-sm font-medium text-navy mb-1">
                        Drag and drop your image here
                    </p>
                    <p className="text-xs text-slate mb-3">
                        or click to browse files
                    </p>
                    <p className="text-xs text-slate">
                        JPG, PNG, or WebP • Max {formatFileSize(MAX_FILE_SIZE)}
                    </p>
                </div>
            ) : (
                // Image Preview
                <div className="relative rounded-lg border border-light-gray bg-white p-4">
                    <div className="flex items-start gap-4">
                        {/* Thumbnail */}
                        <div className="relative w-24 h-24 flex-shrink-0">
                            <img
                                src={localPreview}
                                alt="Gem preview"
                                className="w-full h-full object-cover rounded-lg"
                            />
                        </div>

                        {/* File Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <ImageIcon className="w-4 h-4 text-slate" />
                                <p className="text-sm font-medium text-navy truncate">
                                    {value?.name || 'Uploaded image'}
                                </p>
                            </div>
                            {value && (
                                <p className="text-xs text-slate mb-3">
                                    {formatFileSize(value.size)}
                                </p>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={handleClick}
                                    disabled={disabled}
                                    className={cn(
                                        'px-3 py-1.5 text-xs font-medium',
                                        'bg-cream text-navy rounded-md',
                                        'hover:bg-light-gray transition-colors',
                                        disabled && 'opacity-60 cursor-not-allowed'
                                    )}
                                >
                                    Replace
                                </button>
                                <button
                                    type="button"
                                    onClick={handleRemove}
                                    disabled={disabled}
                                    className={cn(
                                        'px-3 py-1.5 text-xs font-medium',
                                        'text-error hover:bg-red-50 rounded-md',
                                        'transition-colors',
                                        disabled && 'opacity-60 cursor-not-allowed'
                                    )}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>

                        {/* Quick Remove Button */}
                        <button
                            type="button"
                            onClick={handleRemove}
                            disabled={disabled}
                            className={cn(
                                'absolute top-2 right-2 p-1 rounded-full',
                                'text-slate hover:text-error hover:bg-red-50',
                                'transition-colors',
                                disabled && 'opacity-60 cursor-not-allowed'
                            )}
                            aria-label="Remove image"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Helper Text */}
            <p className="mt-2 text-sm text-slate">
                This helps our AI create more accurate designs
            </p>

            {/* Error Message */}
            {displayError && (
                <div className="mt-2 flex items-center gap-1.5 text-sm text-error" role="alert">
                    <AlertCircle className="w-4 h-4" />
                    {displayError}
                </div>
            )}
        </div>
    );
}

export default ImageUpload;
