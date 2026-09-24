import type { ImageMetadata } from 'astro';
import angularCover from '../assets/books/angular.webp';
import qualityCover from '../assets/books/kontinuierliche-reduzierung.webp';
import windowsPhone75Cover from '../assets/books/windows-phone-7-5.webp';
import windowsPhone8Cover from '../assets/books/windows-phone-8.webp';

export interface Book {
  topic: string;
  title: string;
  subtitle: string;
  description: string;
  cover: ImageMetadata;
  shop: string;
  url: string;
  coauthors?: string;
  review?: { label: string; url: string };
}

// Single source for the /buecher page and the book count in the start page hero.
export const books: Book[] = [
  {
    topic: 'Angular · TypeScript',
    title: 'Angular',
    subtitle: 'Grundlagen, fortgeschrittene Techniken und Best Practices mit TypeScript',
    description:
      'Ein Praxisbuch für Entwickler: von den Grundlagen des Frameworks über fortgeschrittene Techniken bis zu bewährten Vorgehensweisen, durchgängig mit TypeScript. Ab Angular 4, inklusive NativeScript und Redux.',
    cover: angularCover,
    shop: 'Amazon',
    url: 'https://www.amazon.de/Angular-Grundlagen-fortgeschrittene-Techniken-TypeScript/dp/3864903572/',
    coauthors: 'Ferdinand Malcher, Danny Koppenhagen und Johannes Hoppe'
  },
  {
    topic: 'Agile Methoden · Qualität',
    title: 'Kontinuierliche Reduzierung der Minderung von Softwarequalität',
    subtitle: 'Eine agile Methode zur Harmonisierung von Softwareentwicklung und Qualitätssicherung',
    description:
      'Eine Methode, die Entwicklung und Qualitätssicherung zusammenführt, damit die Qualität von Software nicht nur am Ende geprüft, sondern im Alltag des Teams laufend gehalten wird.',
    cover: qualityCover,
    shop: 'Medimops',
    url: 'https://www.medimops.de/gregor-woiwode-kontinuierliche-reduzierung-der-minderung-von-softwarequalitaet-eine-agile-methode-zur-harmonisierung-von-softwareentwicklung-und-qualitaetssicherung-taschenbuch-M03330514981.html'
  },
  {
    topic: 'Windows Phone · App-Entwicklung',
    title: 'Windows Phone 7.5',
    subtitle: 'Grundlagen und fortgeschrittene Programmierung',
    description:
      'Vom ersten Projekt bis zu fortgeschrittenen Techniken: eine Einführung in die App-Entwicklung für Windows Phone 7.5.',
    cover: windowsPhone75Cover,
    shop: 'Amazon',
    url: 'https://www.amazon.de/Windows-Phone-7-5-fortgeschrittene-Programmierung/dp/389864782X',
    coauthors: 'Ralf Ehlert'
  },
  {
    topic: 'Windows Phone · App-Entwicklung',
    title: 'Windows Phone 8',
    subtitle: 'Grundlagen und Praxis der App-Entwicklung',
    description: 'Grundlagen und praktische Anleitung für die App-Entwicklung mit Windows Phone 8.',
    cover: windowsPhone8Cover,
    shop: 'Amazon',
    url: 'https://www.amazon.de/Windows-Phone-Grundlagen-Praxis-App-Entwicklung/dp/3864900689',
    coauthors: 'Ralf Ehlert und Jörg Debus',
    review: {
      label: 'Rezension auf booknerds.de lesen',
      url: 'https://www.booknerds.de/2013/06/ralf-ehlert-gregor-woiwode-joerg-debus-windows-phone-8-grundlagen-und-praxis-der-app-entwicklung-buch/'
    }
  }
];
