import slugify from 'slugify';

/**
 * Generate a slug from a string
 */
export const generateSlug = (text: string): string => {
  return slugify(text, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g,
  });
};

/**
 * Generate a unique slug by appending a random string if needed
 */
export const generateUniqueSlug = (text: string, existingSlugs: string[] = []): string => {
  let slug = generateSlug(text);

  if (!existingSlugs.includes(slug)) {
    return slug;
  }

  // Append random string if slug already exists
  const randomString = Math.random().toString(36).substring(2, 8);
  return `${slug}-${randomString}`;
};
