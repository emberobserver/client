import { get } from "@ember/object";
import { compare } from "@ember/utils";

/**
 * Reads a list as an array. A native array or an ember-data record array stays as it is.
 * An async hasMany gives the records that it loaded, and nothing before they load.
 */
export default function asArray(value) {
  if (value == null) return [];
  if (Array.isArray(value)) return value;
  if ("content" in value) return asArray(value.content);

  let items = [];

  value.forEach?.((item) => items.push(item));

  return items;
}

/**
 * Sorts a list as the `sort` macro did, by definitions such as `["name", "score:desc"]`.
 */
export function sortBy(list, definitions) {
  let keys = Array.from(definitions, (definition) => definition.split(":"));

  return asArray(list)
    .slice()
    .sort((a, b) => {
      for (let [key, direction] of keys) {
        let result = compare(get(a, key), get(b, key));

        if (result !== 0) return direction === "desc" ? -result : result;
      }

      return 0;
    });
}

/**
 * Reads the record of an async belongsTo, which ember-data 5 does not take as a value of another relationship.
 */
export function asRecord(value) {
  return value != null && typeof value === "object" && "content" in value ? value.content : value;
}
