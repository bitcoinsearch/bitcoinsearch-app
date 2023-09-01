const AUTHOR = "authors" as const
const DOMAIN = "domain" as const
const TAGS = "tags" as const

export type FacetKeys = typeof AUTHOR | typeof DOMAIN | typeof TAGS

export type Facet = {
  field: FacetKeys;
  value: string
}

