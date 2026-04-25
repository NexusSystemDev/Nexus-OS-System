import de from './locales/de.json' with { type: 'json' };
import en from './locales/en.json' with { type: 'json' };

const locales = { de, en };

/**
 * Translates a key based on the language.
 * @param {string} key - The translation key (e.g., 'bot.ticket_opened')
 * @param {string} lang - The language code ('de' or 'en')
 * @param {Object} variables - Key-value pairs for placeholders in the translation string
 * @returns {string} - The translated string
 */
export function t(key, lang = 'de', variables = {}) {
  const [category, item] = key.split('.');
  const locale = locales[lang] || locales.de;
  
  let translation = locale[category]?.[item] || key;

  // Replace placeholders like {channel} or {user}
  Object.entries(variables).forEach(([name, value]) => {
    translation = translation.replace(new RegExp(`\\{${name}\\}`, 'g'), value);
  });

  return translation;
}

export default { t };
