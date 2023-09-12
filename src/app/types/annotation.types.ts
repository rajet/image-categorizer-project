export interface Annotation {
  description: string;
  score: number;
}

export const annotationMap = new Map<string, string[]>([
  [
    'Car',
    [
      'Car',
      'Vehicle',
      'Automotive',
      'Motor vehicle',
      'Sedan',
      'SUV',
      'Truck',
      'Convertible',
      'Van',
      'Bus',
      'Motorcycle',
      'Bicycle',
    ],
  ],
  [
    'Animal',
    [
      'Animal',
      'Mammal',
      'Bird',
      'Fish',
      'Reptile',
      'Amphibian',
      'Insect',
      'Rodent',
      'Canine',
      'Feline',
      'Equine',
      'Avian',
      'Aquatic animal',
      'Wildlife',
      'Domestic animal',
      'Pet',
      'Giraffe',
    ],
  ],
  [
    'Human',
    [
      'Person',
      'People',
      'Human',
      'Man',
      'Woman',
      'Men',
      'Women',
      'Child',
      'Adult',
      'Teenager',
      'Elderly',
      'Family',
      'Couple',
      'Crowd',
      'Individual',
      'Pedestrian',
      'Worker',
      'Student',
    ],
  ],
  [
    'Landscape',
    [
      'Landscape',
      'Desert',
      'Forest',
      'Mountain',
      'River',
      'Lake',
      'Ocean',
      'Beach',
      'Prairie',
      'Valley',
      'Hill',
      'Island',
      'Swamp',
      'Waterfall',
      'Canyon',
      'Meadow',
      'Glacier',
      'Volcano',
    ],
  ],
]);
