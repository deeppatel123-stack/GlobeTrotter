const generateSlug = (text) => {
  const base = text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text

  const randomString = Math.random().toString(36).substring(2, 7);
  return `${base || 'trip'}-${randomString}`;
};

module.exports = { generateSlug };
