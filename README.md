## Stuffed Recipes Ingredient Processor

This repository just contains some internal tools for processing [FDA food ingredient datasets](https://fdc.nal.usda.gov/download-datasets.html) to seed the Stuffed Recipe databases.

> Note: This isn't complete yet and I've only added processing to the main script for one dataset so far. Command arguments and customizable structure processing is on the roadmap.

### Splitting large files

This command splits the excessively large JSON files into 5,000 lines:

> `split -l 5000 -d data/{change_filename_here}.json ./split/branded_food_ --additional-suffix=.json`

and this one removes trailing commas at the end of each file then adds a closing bracket:

> `sed -i -e '1s/^/[/' -e '${s/,$//;s/$/]/;}' ./split/*`

### Usage

Once the files have been split up, install the node packages:

> `npm i`

Then run the main script:

> `node index.js <filename>`

The following flags are available:

- `--structure="out_struct.json"` - this argument is unimplemented right now, but once added will map the previous data structure to a new one.

### Data Structures

#### Branded Foods

```json
{
  "brand": string,
  "upc": string,
  "description": string,
  "country": string,
  "label_nutrients": [
    {
      "name": string,
      "value": integer,
    }
  ],
  "nutrients": {
    "name": string,
    "unit": string,
    "amount": float,
    "derivation": string,
    "source": string,
  },
  "serving_size": integer,
  "serving_size_unit": string,
  "category": string,
  "created": string // "available" date in MM/DD/YYYY format
}
```

Example:

```json
{
  "brand": "MICHELE'S",
  "upc": "1633636543505",
  "description": "GRANOLA, CINNAMON, RAISIN, CINNAMON, RAISIN",
  "country": "United States",
  "label_nutrients": [
    {
      "name": "fat",
      "value": 7
    }
  ],
  "nutrients": {
    "name": "Protein",
    "unit": "g",
    "amount": 10.7,
    "derivation": "Calculated from value per serving size measure",
    "source": "Manufacturer's analytical; partial documentation"
  },
  "serving_size": 28,
  "serving_size_unit": "g",
  "category": "Cereal",
  "created": "4/26/2020"
}
```

### License

This project is licensed under the same conditions as the [Stuffed Recipes](https://github.com/rjp2525/stuffed-recipes) project, which is licensed under [GNU AGPLv3](https://www.gnu.org/licenses/agpl-3.0.en.html).
