const htmlEscapes: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
};

export function escapeHTML (string: string): string {
  return string.replace(/[&<>"'/]/g, char => htmlEscapes[char]);  
}
