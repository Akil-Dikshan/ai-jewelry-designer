// ===================================================================
// GEM TYPES - Constants from PROMPT_2
// ===================================================================

export const GEM_TYPES = [
  'Diamond',
  'Sapphire',
  'Ruby',
  'Emerald',
  'Topaz',
  'Amethyst',
  'Aquamarine',
  'Opal',
  'Garnet',
  'Peridot',
  'Tanzanite',
  'Tourmaline',
  'Other',
] as const;

export type GemTypeName = (typeof GEM_TYPES)[number];

export const GEM_TYPE_OPTIONS = GEM_TYPES.map((type) => ({
  value: type.toLowerCase().replace(/\s+/g, '-'),
  label: type,
}));
