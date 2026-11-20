export const breedData = {
  Dog: [
    'Labrador Retriever', 'German Shepherd', 'Golden Retriever', 'French Bulldog',
    'Bulldog', 'Poodle', 'Beagle', 'Rottweiler', 'German Shorthaired Pointer',
    'Dachshund', 'Pembroke Welsh Corgi', 'Yorkshire Terrier', 'Boxer', 'Cavalier King Charles Spaniel',
    'Doberman Pinscher', 'Great Dane', 'Miniature Schnauzer', 'Shih Tzu', 'Siberian Husky',
    'Bernese Mountain Dog', 'Pomeranian', 'Boston Terrier', 'Havanese', 'Shetland Sheepdog',
    'Cocker Spaniel', 'Border Collie', 'Chihuahua', 'Pug', 'Maltese',
    'Dalmatian', 'Indian Spitz', 'Indian Pariah Dog', 'Rajapalayam', 'Mudhol Hound',
    'Indie (Mixed Breed)', 'Mixed Breed',
  ],
  Cat: [
    'Persian', 'Maine Coon', 'Ragdoll', 'British Shorthair', 'Siamese',
    'Bengal', 'Abyssinian', 'Birman', 'Sphynx', 'Scottish Fold',
    'Russian Blue', 'Norwegian Forest', 'Himalayan', 'Exotic Shorthair',
    'Devon Rex', 'Bombay', 'Indie (Mixed Breed)', 'Mixed Breed',
  ],
  Bird: [
    'Budgerigar', 'Cockatiel', 'Lovebird', 'Parrot', 'Canary',
    'Finch', 'Conure', 'Macaw', 'African Grey', 'Mixed/Unknown',
  ],
  Rabbit: [
    'Holland Lop', 'Mini Rex', 'Netherland Dwarf', 'Lionhead',
    'Flemish Giant', 'Dutch Rabbit', 'English Angora', 'Mixed Breed',
  ],
  default: ['Mixed/Unknown'],
};

export function getBreedsForSpecies(species) {
  return breedData[species] || breedData.default;
}
