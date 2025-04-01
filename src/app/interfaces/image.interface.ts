export interface Entries {
  entries: Entry[];
  meta:    EntriesMeta;
}

export interface Entry {
  meta:   EntryMeta;
  fields: Fields;
}

export interface Fields {
  image: Image;
}

export interface Image {
  url:          string;
  tags:         any[];
  uuid:         string;
  title:        string;
  alt_text:     null;
  description:  null;
  content_type: string;
}

export interface EntryMeta {
  name:              string;
  slug:              string;
  tags:              any[];
  type:              string;
  uuid:              string;
  space:             string;
  author:            Author;
  locale:            string;
  excerpt:           string;
  private:           boolean;
  category:          null;
  segments:          any[];
  created_at:        Date;
  updated_at:        Date;
  published_at:      Date;
  unpublish_at:      null;
  version_type:      string;
  category_name:     null;
  category_slug:     null;
  available_locales: string[];
}

export interface Author {
}

export interface EntriesMeta {
  total_entries: number;
  per_page:      number;
  current_page:  number;
  total_pages:   number;
}
