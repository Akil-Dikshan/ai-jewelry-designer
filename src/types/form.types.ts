// ===================================================================
// FORM TYPES - TypeScript Type Definitions for Forms
// ===================================================================

import type { GemData } from './gem.types';
import type { MetalFinish } from '@/constants/materials';

/**
 * Material preferences for jewelry design
 */
export interface MaterialPreferences {
    metals: string[];
    finish: MetalFinish | null;
}

/**
 * Complete form data for design generation
 */
export interface DesignFormData {
    gemData: GemData;
    prompt: string;
    materials: MaterialPreferences;
    numVariations: 2 | 3 | 4;
}

/**
 * Form field error state
 */
export interface FormFieldError {
    field: string;
    message: string;
}

/**
 * Form validation state
 */
export interface FormValidationState {
    isValid: boolean;
    errors: FormFieldError[];
}

/**
 * Base props for form selector components
 */
export interface BaseSelectorProps<T> {
    value: T | null;
    onChange: (value: T) => void;
    error?: string;
    disabled?: boolean;
    required?: boolean;
}

/**
 * Props for text input components
 */
export interface TextInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    maxLength?: number;
    error?: string;
    disabled?: boolean;
    required?: boolean;
    helperText?: string;
}
