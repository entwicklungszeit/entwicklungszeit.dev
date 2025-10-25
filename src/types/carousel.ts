export interface CarouselConfig {
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export interface CarouselPageData {
  episodes: Episode[];
  pageIndex: number;
  totalPages: number;
  itemsPerPage: number;
}

export type { Episode } from './episode';
