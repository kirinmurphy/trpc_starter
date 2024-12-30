import { useState } from 'react';

interface UseFormStateReturnProps<FormDataProps> {
  formData: FormDataProps;
  handleFieldChange: (field: keyof FormDataProps) => (value: string) => void;
}

export function useFormState<FormDataProps> (
  defaults: FormDataProps
): UseFormStateReturnProps<FormDataProps> {

  const [formData, setFormData] = useState<FormDataProps>(defaults);

  const handleFieldChange = (field: keyof FormDataProps) => {
    return (value: string) => { 
      setFormData(prev => ({ ...prev, [field]: value }));
    };
  };

  return { formData, handleFieldChange }
}
