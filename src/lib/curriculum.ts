/**
 * Curated items for the "IOQM 2025 · English" course (code IOQM25).
 * Extracted from the shared spreadsheet, first tab, with links verified
 * against YouTube. Used by the seeder when a catalog course has
 * `curated: true`.
 */
export interface CuratedLecture {
  topic: string;
  videoId: string;
  videoUrl: string;
  notesUrl: string | null;
}

export interface CuratedUnit {
  name: string;
  lectures: CuratedLecture[];
}

export const CURATED_IOQM25: CuratedUnit[] = [
  {
    name: "Basics of Algebra",
    lectures: [
      {
        topic: "Basic Number Sense",
        videoId: "uIvDw_e6ewg",
        videoUrl: "https://www.youtube.com/watch?v=uIvDw_e6ewg",
        notesUrl:
          "https://drive.google.com/file/d/1jI7QOI0M113r4VIGBSu__An-vdzEkYLD/view?usp=sharing",
      },
      {
        topic: "Factorization Technique",
        videoId: "fYwXV-7Myz0",
        videoUrl: "https://www.youtube.com/watch?v=fYwXV-7Myz0",
        notesUrl:
          "https://drive.google.com/file/d/1CGSonWEwk5cI2eAzMk_rF5gqsh66NX-c/view?usp=sharing",
      },
      {
        topic: "All About Algebraic Identities",
        videoId: "WHg8mRaRZBY",
        videoUrl: "https://www.youtube.com/watch?v=WHg8mRaRZBY",
        notesUrl: null,
      },
      {
        topic: "Solving Polynomial Equations",
        videoId: "_wrYorFmejo",
        videoUrl: "https://www.youtube.com/watch?v=_wrYorFmejo",
        notesUrl:
          "https://drive.google.com/file/d/1jTJGKZ9w9DQskJkKzJM5SmIUfV2RSDxZ/view?usp=sharing",
      },
      {
        topic: "Ratio & Proportion",
        videoId: "W_IIGPRia1M",
        videoUrl: "https://www.youtube.com/watch?v=W_IIGPRia1M",
        notesUrl: null,
      },
      {
        topic: "Indeterminate Equations",
        videoId: "f7z5M-X-w5Y",
        videoUrl: "https://www.youtube.com/watch?v=f7z5M-X-w5Y",
        notesUrl: null,
      },
      {
        topic: "Miscellaneous Equations",
        videoId: "7NlzZDYWtMw",
        videoUrl: "https://www.youtube.com/watch?v=7NlzZDYWtMw",
        notesUrl:
          "https://drive.google.com/file/d/1JOdAsUzvEWDyrwsbzngS3gzuVg6Dw0np/view?usp=sharing",
      },
    ],
  },
  {
    name: "Number Theory",
    lectures: [
      {
        topic: "Divisibility & Cyclicity",
        videoId: "05AL50KXFNA",
        videoUrl: "https://www.youtube.com/watch?v=05AL50KXFNA",
        notesUrl: null,
      },
      {
        topic: "Cyclicity & Alphanumeric Problem",
        videoId: "zYZwWB7jJKw",
        videoUrl: "https://www.youtube.com/watch?v=zYZwWB7jJKw",
        notesUrl: null,
      },
      {
        topic: "Euclid Division Lemma & Basics of Congruence",
        videoId: "rZEeX_11cvo",
        videoUrl: "https://www.youtube.com/watch?v=rZEeX_11cvo",
        notesUrl: null,
      },
      {
        topic: "HCF & LCM",
        videoId: "9K1KtMVX7sE",
        videoUrl: "https://www.youtube.com/watch?v=9K1KtMVX7sE",
        notesUrl:
          "https://drive.google.com/file/d/1HeviCxZs0A3viKTDuUA1mwJaY03Hhzts/view?usp=sharing",
      },
      {
        topic: "Problem Solving Session on Number Theory",
        videoId: "kXBsbdrBwhE",
        videoUrl: "https://www.youtube.com/watch?v=kXBsbdrBwhE",
        notesUrl:
          "https://drive.google.com/file/d/1EO37774U0rfwLKigcUWrvvG7tlAzsp55/view?usp=sharing",
      },
    ],
  },
  {
    name: "Geometry",
    lectures: [
      {
        topic: "Basic Geometrical Ideas",
        videoId: "veYilDcWezQ",
        videoUrl: "https://www.youtube.com/watch?v=veYilDcWezQ",
        notesUrl: null,
      },
    ],
  },
];
