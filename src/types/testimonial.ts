export interface Testimonial {
  firstName: string;
  lastName: string;
  portraitImage: {
    src: string;
    alt: string;
  };
  jobTitle: string;
  company?: string;
  reviewText: string;
  bio?: string;
  projectLink: string;
}
