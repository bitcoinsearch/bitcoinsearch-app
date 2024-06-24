import {
  SearchResponse,
  SearchResponseBody,
} from "@elastic/elasticsearch/lib/api/types";
import config from "./engine.json";
import { FacetKeys } from "@/types";

/**
 * This file abstracts most logic around the configuration of the Reference UI.
 *
 * Configuration is an important part of the "reusability" and "generic-ness" of
 * the Reference UI, but if you are using this app as a starting point for own
 * project, everything related to configuration can largely be thrown away. To
 * that end, this file attempts to contain most of that logic to one place.
 */

export function getConfig(): typeof config {
  if (process.env.NODE_ENV === "test") {
    return {} as typeof config;
  }

  if (config.engineName) return config;

  if (
    typeof window !== "undefined" &&
    window["appConfig"] &&
    window["appConfig"].engineName
  ) {
    return window["appConfig"];
  }

  return {} as typeof config;
}

function toLowerCase(string: string) {
  if (string) return string.toLowerCase();
}

// function capitalizeFirstLetter(string) {
//   return string.charAt(0).toUpperCase() + string.slice(1);
// }

export function getFacetWithSearch() {
  return getConfig().facetSearch || [];
}
export function getResultTags() {
  return (getConfig().resultTags || []) as FacetKeys[];
}

export function getTitleField() {
  // If no title field configuration has been provided, we attempt
  // to use a "title" field, if one exists
  return getConfig().titleField || "title";
}

export function getUrlField() {
  return getConfig().urlField;
}

// export function getThumbnailField() {
//   return getConfig().thumbnailField;
// }

export function getFacetFields() {
  return (getConfig().facets as FacetKeys[]) || [];
}

export function getSortFields() {
  return getConfig().sortFields || [];
}

export function getResultTitle(result) {
  const titleField = getTitleField();

  return result.getSnippet(titleField);
}

// Because if a field is configured to display as a "title", we don't want
// to display it again in the fields list
export function stripUnnecessaryResultFields(resultFields) {
  return Object.keys(resultFields).reduce((acc, n) => {
    if (
      [
        "_meta",
        "id",
        toLowerCase(getTitleField()),
        toLowerCase(getUrlField()),
        // toLowerCase(getThumbnailField()),
      ].includes(toLowerCase(n))
    ) {
      return acc;
    }

    acc[n] = resultFields[n];
    return acc;
  }, {});
}

export function buildSearchOptionsFromConfig() {
  const config = getConfig();
  const searchFields = (config.searchFields || config.fields || []).reduce(
    (acc, n) => {
      acc = acc || {};
      acc[n] = {};
      return acc;
    },
    undefined
  );

  const resultFields = (config.resultFields || config.fields || []).reduce(
    (acc, n) => {
      acc = acc || {};
      acc[n] = {
        raw: {},
        snippet: {
          size: 100,
          fallback: true,
        },
      };
      return acc;
    },
    undefined
  );

  // We can't use url, thumbnail, or title fields unless they're actually
  // in the reuslts.
  if (config.urlField) {
    resultFields[config.urlField] = {
      raw: {},
      snippet: {
        size: 100,
        fallback: true,
      },
    };
  }

  if (config["thumbnailField"]) {
    resultFields[config["thumbnailField"]] = {
      raw: {},
      snippet: {
        size: 100,
        fallback: true,
      },
    };
  }

  if (config.titleField) {
    resultFields[config.titleField] = {
      raw: {},
      snippet: {
        size: 100,
        fallback: true,
      },
    };
  }

  const searchOptions = {
    result_fields: [],
    search_fields: [],
  };
  searchOptions.result_fields = resultFields;
  searchOptions.search_fields = searchFields;
  return searchOptions;
}

export function buildFacetConfigFromConfig() {
  const config = getConfig();

  const facets = (config.facets || []).reduce((acc, n) => {
    acc[n] = {
      type: "value",
      size: 100,
    };
    return acc;
  }, {});

  return facets;
}

export function buildAutocompleteQueryConfig() {
  const querySuggestFields = getConfig()["querySuggestFields"];
  if (
    !querySuggestFields ||
    !Array.isArray(querySuggestFields) ||
    querySuggestFields.length === 0
  ) {
    return {};
  }

  return {
    suggestions: {
      types: {
        documents: {
          fields: getConfig()["querySuggestFields"],
        },
      },
    },
  };
}

export function getFormURL() {
  return getConfig().userContentFormURL;
}

export function getTopAuthors() {
  const authors = getConfig().topAuthors;

  return authors.map((value) => ({ count: 0, value }));
}

export function getTopKeywords() {
  const keywords = getConfig().topKeywords;

  return keywords.map((value) => ({ count: 0, value }));
}
