export function formatPrompt(template, variables) {
  return Object.entries(variables).reduce(
    (str, [key, val]) => str.replace(new RegExp(`\\{${key}\\}`, 'g'), val),
    template
  );
}